/**
 * @author Eduard Deisling
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

const MACROS_EMITS = 'defineEmits'
const MACROS_PROPS = 'defineProps'
const MACROS_OPTIONS = 'defineOptions'
const MACROS_SLOTS = 'defineSlots'
const MACROS_MODEL = 'defineModel'
const MACROS_EXPOSE = 'defineExpose'
const KNOWN_MACROS = new Set([
  MACROS_EMITS,
  MACROS_PROPS,
  MACROS_OPTIONS,
  MACROS_SLOTS,
  MACROS_MODEL,
  MACROS_EXPOSE
])
const DEFAULT_ORDER = [MACROS_PROPS, MACROS_EMITS]

function isDeclareStatement(node: ASTNode) {
  return 'declare' in node && node.declare === true
}

function isUseStrictStatement(node: ASTNode) {
  return (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'Literal' &&
    node.expression.value === 'use strict'
  )
}

/**
 * Get an index of the first statement after imports and interfaces in order
 * to place defineEmits and defineProps before this statement
 */
function getTargetStatementPosition(scriptSetup: VElement, program: Program) {
  const skipStatements = new Set([
    'ImportDeclaration',
    'TSEnumDeclaration',
    'TSModuleDeclaration',
    'TSInterfaceDeclaration',
    'TSTypeAliasDeclaration',
    'DebuggerStatement',
    'EmptyStatement',
    'ExportNamedDeclaration'
  ])

  for (const [index, item] of program.body.entries()) {
    if (
      utils.isInRange(scriptSetup, item) &&
      !skipStatements.has(item.type) &&
      !isDeclareStatement(item) &&
      !isUseStrictStatement(item)
    ) {
      return index
    }
  }

  return -1
}

/**
 * We need to handle cases like "const props = defineProps(...)"
 * Define macros must be used only on top, so we can look for "Program" type
 * inside node.parent.type
 */
function getDefineMacrosStatement(node: ASTNode): ASTNode {
  if (!node.parent) {
    throw new Error('Node has no parent')
  }

  return node.parent.type === 'Program'
    ? node
    : getDefineMacrosStatement(node.parent)
}

/**
 * Find the top-level statement in `body` that contains the given node.
 */
function findTopLevelStatement(
  body: Program['body'],
  node: ASTNode
): ASTNode | null {
  let low = 0
  let high = body.length - 1
  while (low <= high) {
    const middle = (low + high) >> 1
    const statement = body[middle]
    if (node.range[1] <= statement.range[0]) {
      high = middle - 1
    } else if (node.range[0] >= statement.range[1]) {
      low = middle + 1
    } else {
      return statement
    }
  }
  return null
}

function isAmbientStatement(node: ASTNode) {
  return (
    isDeclareStatement(node) ||
    (node.type === 'ExportNamedDeclaration' &&
      node.declaration != null &&
      isDeclareStatement(node.declaration))
  )
}

interface StatementDependencies {
  /** Statements that declare values or types the statement references */
  all: Set<ASTNode>
  /** Statements that declare runtime values the statement references */
  runtime: Set<ASTNode>
}

type DependencyGetter = (
  statement: ASTNode
) => StatementDependencies | undefined

/**
 * Map each top-level statement to the top-level statements that declare the
 * variables and types it references.
 */
function getStatementDependencies(
  sourceCode: SourceCode,
  program: Program
): Map<ASTNode, StatementDependencies> {
  const dependencies = new Map<ASTNode, StatementDependencies>()
  const variables = sourceCode.scopeManager.scopes
    .filter((scope) => scope.block === program)
    .flatMap((scope) => scope.variables)

  for (const variable of variables) {
    for (const def of variable.defs) {
      const declaration = findTopLevelStatement(program.body, def.node)
      // Imports are hoisted, and they belong at the top anyway
      if (!declaration || declaration.type === 'ImportDeclaration') {
        continue
      }
      const isRuntimeDeclaration = !isAmbientStatement(declaration)

      for (const reference of variable.references) {
        const statement = findTopLevelStatement(
          program.body,
          reference.identifier
        )
        if (!statement || statement === declaration) {
          continue
        }
        let statementDependencies = dependencies.get(statement)
        if (!statementDependencies) {
          statementDependencies = { all: new Set(), runtime: new Set() }
          dependencies.set(statement, statementDependencies)
        }
        statementDependencies.all.add(declaration)
        // `isValueReference` is only set by `@typescript-eslint/scope-manager`,
        // other scope managers only create value references.
        const isValueReference =
          (reference as { isValueReference?: boolean }).isValueReference !==
          false
        if (isRuntimeDeclaration && isValueReference) {
          statementDependencies.runtime.add(declaration)
        }
      }
    }
  }

  return dependencies
}

/**
 * Get the statements in `region` that `macro` references, either directly or
 * through other statements in `region`, in source order.
 */
function getReferencedChain(
  macro: ASTNode,
  region: ASTNode[],
  getDependencies: DependencyGetter
): ASTNode[] {
  if (region.length === 0) {
    return []
  }
  const regionStatements = new Set(region)
  const chain = new Set<ASTNode>()
  const queue = [macro]
  let statement = queue.pop()
  while (statement) {
    const dependencies = getDependencies(statement)?.all ?? []
    for (const dependency of dependencies) {
      if (!regionStatements.has(dependency) || chain.has(dependency)) {
        continue
      }
      chain.add(dependency)
      queue.push(dependency)
    }
    statement = queue.pop()
  }
  return region.filter((node) => chain.has(node))
}

/**
 * Check that moving `nodes` (in this order) before `target` does not place
 * any of them above a runtime declaration it references, which would break
 * the code.
 */
function canMoveBefore(
  nodes: ASTNode[],
  target: ASTNode,
  getDependencies: DependencyGetter
): boolean {
  return nodes.every((node, index) => {
    const dependencies = getDependencies(node)?.runtime ?? []
    for (const dependency of dependencies) {
      const dependencyIndex = nodes.indexOf(dependency)
      const isBrokenDependency =
        dependencyIndex === -1
          ? // a declaration that stays between `target` and `node`
            dependency.range[0] >= target.range[0] &&
            dependency.range[0] < node.range[0]
          : // a declaration that is moved below `node`
            dependencyIndex > index
      if (isBrokenDependency) {
        return false
      }
    }
    return true
  })
}

function create(context: RuleContext) {
  const scriptSetup = utils.getScriptSetupElement(context)

  if (!scriptSetup) {
    return {}
  }

  const options = context.options
  const order: string[] = (options[0] && options[0].order) || DEFAULT_ORDER
  const shouldDefineExposeBeLast: boolean =
    (options[0] && options[0].defineExposeLast) || false
  if (shouldDefineExposeBeLast && order.includes(MACROS_EXPOSE)) {
    throw new Error(
      "`defineExpose` macro can't be in the `order` array if `defineExposeLast` is true."
    )
  }
  const shouldAllowReferencedAbove: boolean =
    !options[0] || options[0].allowReferencedAbove !== false

  const sourceCode = context.sourceCode
  const macrosNodes = new Map<string, ASTNode[]>()
  let defineExposeNode: ASTNode

  return utils.compositingVisitors(
    utils.defineScriptSetupVisitor(context, {
      onDefinePropsExit(node) {
        macrosNodes.set(MACROS_PROPS, [getDefineMacrosStatement(node)])
      },
      onDefineEmitsExit(node) {
        macrosNodes.set(MACROS_EMITS, [getDefineMacrosStatement(node)])
      },
      onDefineOptionsExit(node) {
        macrosNodes.set(MACROS_OPTIONS, [getDefineMacrosStatement(node)])
      },
      onDefineSlotsExit(node) {
        macrosNodes.set(MACROS_SLOTS, [getDefineMacrosStatement(node)])
      },
      onDefineModelExit(node) {
        const currentModelMacros = macrosNodes.get(MACROS_MODEL) ?? []
        currentModelMacros.push(getDefineMacrosStatement(node))
        macrosNodes.set(MACROS_MODEL, currentModelMacros)
      },
      onDefineExposeExit(node) {
        defineExposeNode = getDefineMacrosStatement(node)
      },

      'Program > ExpressionStatement > CallExpression, Program > VariableDeclaration > VariableDeclarator > CallExpression'(
        node: CallExpression
      ) {
        if (
          node.callee &&
          node.callee.type === 'Identifier' &&
          order.includes(node.callee.name) &&
          !KNOWN_MACROS.has(node.callee.name)
        ) {
          macrosNodes.set(node.callee.name, [getDefineMacrosStatement(node)])
        }
      }
    }),
    {
      'Program:exit'(program) {
        interface OrderedData {
          name: string
          node: ASTNode
        }
        const firstStatementIndex = getTargetStatementPosition(
          scriptSetup,
          program
        )
        const orderedList = order
          .flatMap((name) => {
            const nodes = macrosNodes.get(name) ?? []
            return nodes.map((node) => ({ name, node }))
          })
          .filter((data): data is OrderedData => utils.isDef(data.node))

        let dependencies: Map<ASTNode, StatementDependencies> | undefined
        const getDependencies: DependencyGetter = (statement) => {
          dependencies ??= getStatementDependencies(sourceCode, program)
          return dependencies.get(statement)
        }

        const statements =
          firstStatementIndex === -1
            ? []
            : program.body.slice(firstStatementIndex)

        const macroStatements = new Set(orderedList.map(({ node }) => node))

        // With `allowReferencedAbove`, the statements between a macro and the
        // previous one (or the start) that the macro references, directly or
        // through each other, are allowed there.
        const allowedStatements = new Set<ASTNode>()
        if (shouldAllowReferencedAbove) {
          let region: ASTNode[] = []
          for (const statement of statements) {
            if (!macroStatements.has(statement)) {
              region.push(statement)
              continue
            }
            for (const referenced of getReferencedChain(
              statement,
              region,
              getDependencies
            )) {
              allowedStatements.add(referenced)
            }
            region = []
          }
        }
        // The statements the macros are compared against
        const targetStatements = statements.filter(
          (statement) => !allowedStatements.has(statement)
        )

        /**
         * Get the statements to move before `before` to fix the order of the
         * given macros, or `null` if that would break the code.
         */
        const getNodesToMove = (
          nodes: ASTNode[],
          before: ASTNode
        ): ASTNode[] | null => {
          const movedNodes: ASTNode[] = []
          for (const node of nodes) {
            if (shouldAllowReferencedAbove) {
              // Move the declarations that the macro references along with
              // it, so that they stay above it.
              const passedOver = statements.filter(
                (statement) =>
                  statement.range[0] >= before.range[0] &&
                  statement.range[0] < node.range[0] &&
                  !macroStatements.has(statement) &&
                  !movedNodes.includes(statement)
              )
              movedNodes.push(
                ...getReferencedChain(node, passedOver, getDependencies)
              )
            }
            movedNodes.push(node)
          }
          // Don't move a macro above a declaration it uses. This includes
          // `before` itself, if a moved macro references it.
          return !movedNodes.includes(before) &&
            canMoveBefore(movedNodes, before, getDependencies)
            ? movedNodes
            : null
        }

        // check last node
        if (shouldDefineExposeBeLast) {
          const lastNode = program.body.at(-1)
          if (defineExposeNode && lastNode && lastNode !== defineExposeNode) {
            reportExposeNotOnBottom(defineExposeNode, lastNode)
          }
        }

        for (const [index, should] of orderedList.entries()) {
          const targetStatement = targetStatements[index]

          if (should.node !== targetStatement) {
            let moveTargetNodes = orderedList
              .slice(index)
              .map(({ node }) => node)
            const targetStatementIndex =
              moveTargetNodes.indexOf(targetStatement)

            if (targetStatementIndex !== -1) {
              moveTargetNodes = moveTargetNodes.slice(0, targetStatementIndex)
            }
            reportNotOnTop(
              should.name,
              moveTargetNodes,
              targetStatement,
              getNodesToMove(moveTargetNodes, targetStatement)
            )
            return
          }
        }
      }
    }
  )

  function reportNotOnTop(
    macro: string,
    nodes: ASTNode[],
    before: ASTNode,
    movedNodes: ASTNode[] | null
  ) {
    // Determine if 'before' is a macro from the order list
    const beforeMacro = order.find((macroName) =>
      (macrosNodes.get(macroName) ?? []).includes(before)
    )

    // Decide which message to use
    const messageId = beforeMacro ? 'macrosUnordered' : 'macrosNotAtTop'
    const data = { macro, ...(beforeMacro ? { before: beforeMacro } : {}) }

    context.report({
      node: nodes[0],
      loc: nodes[0].loc,
      messageId,
      data,
      fix: movedNodes
        ? function* (fixer) {
            for (const node of movedNodes) {
              yield* moveNodeBefore(fixer, node, before)
            }
          }
        : null
    })
  }

  function reportExposeNotOnBottom(node: ASTNode, lastNode: ASTNode) {
    context.report({
      node,
      loc: node.loc,
      messageId: 'defineExposeNotTheLast',
      suggest: [
        {
          messageId: 'putExposeAtTheLast',
          fix(fixer) {
            return moveNodeToLast(fixer, node, lastNode)
          }
        }
      ]
    })
  }

  /**
   * Move all lines of "node" with its comments to after the "target"
   */
  function moveNodeToLast(fixer: RuleFixer, node: ASTNode, target: ASTNode) {
    // get comments under tokens(if any)
    const beforeNodeToken = sourceCode.getTokenBefore(node)
    const nodeComment = sourceCode.getTokenAfter(beforeNodeToken, {
      includeComments: true
    })
    const nextNodeComment = sourceCode.getTokenAfter(node, {
      includeComments: true
    })

    // remove position: node (and comments) to next node (and comments)
    const cutStart = getLineStartIndex(nodeComment, beforeNodeToken)
    const cutEnd = getLineStartIndex(nextNodeComment, node)

    // insert text: comment + node
    const textNode = sourceCode.getText(
      node,
      node.range[0] - beforeNodeToken.range[1]
    )

    return [
      fixer.insertTextAfter(target, textNode),
      fixer.removeRange([cutStart, cutEnd])
    ]
  }

  /**
   * Move all lines of "node" with its comments to before the "target"
   */
  function moveNodeBefore(fixer: RuleFixer, node: ASTNode, target: ASTNode) {
    // get comments under tokens(if any)
    const beforeNodeToken = sourceCode.getTokenBefore(node)
    const nodeComment = sourceCode.getTokenAfter(beforeNodeToken, {
      includeComments: true
    })
    const nextNodeComment = sourceCode.getTokenAfter(node, {
      includeComments: true
    })
    // get positions of what we need to remove
    const cutStart = getLineStartIndex(nodeComment, beforeNodeToken)
    const cutEnd = getLineStartIndex(nextNodeComment, node)
    // get space before target
    const beforeTargetToken = sourceCode.getTokenBefore(target)
    const targetComment = sourceCode.getTokenAfter(beforeTargetToken, {
      includeComments: true
    })
    // make insert text: comments + node + space before target
    const textNode = sourceCode.getText(
      node,
      node.range[0] - nodeComment.range[0]
    )
    const insertText = getInsertText(textNode, target)

    return [
      fixer.insertTextBefore(targetComment, insertText),
      fixer.removeRange([cutStart, cutEnd])
    ]
  }

  /**
   * Get result text to insert
   */
  function getInsertText(textNode: string, target: ASTNode) {
    const afterTargetComment = sourceCode.getTokenAfter(target, {
      includeComments: true
    })
    const afterText = sourceCode.text.slice(
      target.range[1],
      afterTargetComment.range[0]
    )
    // handle case when a();b() -> b()a();
    const isInvalidResult = !textNode.endsWith(';') && !afterText.includes('\n')

    return textNode + afterText + (isInvalidResult ? ';' : '')
  }

  /**
   * Get position of the beginning of the token's line(or prevToken end if no line)
   */
  function getLineStartIndex(
    token: ASTNode | Token,
    prevToken: ASTNode | Token
  ) {
    // if we have next token on the same line - get index right before that token
    if (token.loc.start.line === prevToken.loc.end.line) {
      return prevToken.range[1]
    }

    return sourceCode.getIndexFromLoc({
      line: token.loc.start.line,
      column: 0
    })
  }
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description:
        'enforce order of compiler macros (`defineProps`, `defineEmits`, etc.)',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/define-macros-order.html'
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'array',
            items: {
              type: 'string',
              minLength: 1
            },
            uniqueItems: true
          },
          defineExposeLast: {
            type: 'boolean'
          },
          allowReferencedAbove: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      macrosNotAtTop:
        '{{macro}} should be placed at the top of `<script setup>` (after any potential import statements or type definitions).',
      macrosUnordered: '{{macro}} should be above {{before}}.',
      defineExposeNotTheLast:
        '`defineExpose` should be the last statement in `<script setup>`.',
      putExposeAtTheLast:
        'Put `defineExpose` as the last statement in `<script setup>`.'
    }
  },
  create
}
