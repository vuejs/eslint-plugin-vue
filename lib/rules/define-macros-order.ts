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
 * Check whether a statement starting with the token would continue the
 * previous statement if that doesn't end with a semicolon
 */
function isAsiHazard(token: Token): boolean {
  return /^[(+\-/[`]/u.test(token.value)
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
 * Find the top-level statement that contains the given node.
 */
function findTopLevelStatement(node: ASTNode): ASTNode | null {
  let current = node
  while (current.parent) {
    if (current.parent.type === 'Program') {
      return current
    }
    current = current.parent
  }
  return null
}

/** Declarations that are erased by the TypeScript compiler */
const TYPE_ONLY_DECLARATIONS = new Set([
  'TSInterfaceDeclaration',
  'TSTypeAliasDeclaration',
  'TSDeclareFunction'
])

/** Declarations that can emit runtime code */
const RUNTIME_DECLARATIONS = new Set([
  'VariableDeclaration',
  'FunctionDeclaration',
  'ClassDeclaration',
  'TSEnumDeclaration',
  'TSModuleDeclaration'
])

/**
 * Get the declaration of a top-level statement, looking through `export`,
 * or `null` if the statement is not a declaration.
 */
function getDeclaration(statement: ASTNode): ASTNode | null {
  const declaration =
    statement.type === 'ExportNamedDeclaration'
      ? statement.declaration
      : statement
  return declaration &&
    (TYPE_ONLY_DECLARATIONS.has(declaration.type) ||
      RUNTIME_DECLARATIONS.has(declaration.type))
    ? declaration
    : null
}

/**
 * Check whether the given top-level statement only declares types or ambient
 * values, so its position doesn't matter at runtime.
 */
function isTypeOnlyDeclaration(statement: ASTNode): boolean {
  const declaration = getDeclaration(statement)
  return (
    declaration != null &&
    (TYPE_ONLY_DECLARATIONS.has(declaration.type) ||
      isDeclareStatement(declaration))
  )
}

/**
 * Check whether the reference only uses the variable as a type.
 * `isValueReference` is only set by `@typescript-eslint/scope-manager`, other
 * scope managers only create value references.
 */
function isTypeReference(reference: Reference): boolean {
  return 'isValueReference' in reference && reference.isValueReference === false
}

/**
 * Get the variables declared in the top-level scope.
 */
function getTopLevelVariables(sourceCode: SourceCode, program: Program) {
  return sourceCode.scopeManager.scopes
    .filter((scope) => scope.block === program)
    .flatMap((scope) => scope.variables)
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

  for (const variable of getTopLevelVariables(sourceCode, program)) {
    for (const def of variable.defs) {
      const declaration = findTopLevelStatement(def.node)
      // Only declarations can be allowed above a macro. This skips imports
      // (they are hoisted and belong at the top anyway), as well as `var`s
      // declared inside other statements.
      if (!declaration || !getDeclaration(declaration)) {
        continue
      }
      const isRuntimeDeclaration = !isTypeOnlyDeclaration(declaration)

      for (const reference of variable.references) {
        const statement = findTopLevelStatement(reference.identifier)
        if (!statement || statement === declaration) {
          continue
        }
        let statementDependencies = dependencies.get(statement)
        if (!statementDependencies) {
          statementDependencies = { all: new Set(), runtime: new Set() }
          dependencies.set(statement, statementDependencies)
        }
        statementDependencies.all.add(declaration)
        if (isRuntimeDeclaration && !isTypeReference(reference)) {
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
  const addDependencies = (statement: ASTNode) => {
    const dependencies = getDependencies(statement)?.all ?? []
    for (const dependency of dependencies) {
      if (!regionStatements.has(dependency) || chain.has(dependency)) {
        continue
      }
      chain.add(dependency)
      addDependencies(dependency)
    }
  }
  addDependencies(macro)
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

/** Nodes whose contents are only used as types */
const TYPE_NODES = new Set([
  'TSTypeAnnotation',
  'TSTypeParameterInstantiation',
  'TSTypeQuery'
])

/**
 * Check whether the reference uses the variable at runtime, i.e. not as a
 * type, e.g. `typeof x`. Uses in functions count, as they may be called
 * anywhere.
 */
function isRuntimeUse(reference: Reference, statement: ASTNode): boolean {
  if (isTypeReference(reference) || isTypeOnlyDeclaration(statement)) {
    return false
  }
  for (
    let node: ASTNode | null = reference.identifier.parent;
    node && node !== statement;
    node = node.parent
  ) {
    if (TYPE_NODES.has(node.type)) {
      return false
    }
  }
  return true
}

interface VariableUses {
  /** The variables each top-level statement declares or uses at runtime */
  statementVariables: Map<ASTNode, Set<Variable>>
  /** The top-level statements that declare `let` and `const` variables */
  lexicalDeclarations: Map<Variable, ASTNode>
}

/**
 * Get the top-level `let`, `const` and `var` variables that each top-level
 * statement declares or uses at runtime. Imports, functions, classes and types
 * are left out, so that e.g. calling the same function doesn't count.
 */
function getVariableUses(
  sourceCode: SourceCode,
  program: Program
): VariableUses {
  const statementVariables = new Map<ASTNode, Set<Variable>>()
  const lexicalDeclarations = new Map<Variable, ASTNode>()
  const addUse = (statement: ASTNode, variable: Variable) => {
    let variables = statementVariables.get(statement)
    if (!variables) {
      variables = new Set()
      statementVariables.set(statement, variables)
    }
    variables.add(variable)
  }

  for (const variable of getTopLevelVariables(sourceCode, program)) {
    const defs = variable.defs.filter((def) => def.type === 'Variable')
    if (defs.length === 0) {
      continue
    }
    // This includes `var`s declared inside other statements
    for (const def of defs) {
      const statement = findTopLevelStatement(def.node)
      if (!statement || isTypeOnlyDeclaration(statement)) {
        continue
      }
      addUse(statement, variable)
      if (def.parent.kind !== 'var') {
        lexicalDeclarations.set(variable, statement)
      }
    }
    for (const reference of variable.references) {
      const statement = findTopLevelStatement(reference.identifier)
      if (statement && isRuntimeUse(reference, statement)) {
        addUse(statement, variable)
      }
    }
  }

  return { statementVariables, lexicalDeclarations }
}

/**
 * Check that moving `nodes` (in this order) before `target` does not move any
 * of them above a statement that uses the same variable, which could change
 * the value they see, e.g. `count++` between `let count = 0` and
 * `const api = { count }`.
 */
function canMoveBeforeVariableUses(
  nodes: ASTNode[],
  target: ASTNode,
  statements: ASTNode[],
  { statementVariables, lexicalDeclarations }: VariableUses
): boolean {
  return nodes.every((node, index) => {
    const nodeVariables = statementVariables.get(node)
    if (!nodeVariables) {
      return true
    }
    const movedAbove = new Set(nodes.slice(0, index))
    return statements.every((statement) => {
      const isPassedOver =
        statement.range[0] >= target.range[0] &&
        statement.range[0] < node.range[0] &&
        !movedAbove.has(statement)
      if (!isPassedOver) {
        return true
      }
      const variables = statementVariables.get(statement) ?? []
      for (const variable of variables) {
        if (!nodeVariables.has(variable)) {
          continue
        }
        // A statement above a `let` or `const` declaration can only use the
        // variable in a function called later, so the declaration can be
        // moved above it.
        if (lexicalDeclarations.get(variable) !== node) {
          return false
        }
      }
      return true
    })
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
  const notAtTopMessageId = shouldAllowReferencedAbove
    ? 'macrosNotAtTopOrReferenced'
    : 'macrosNotAtTop'

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
            // Move the declarations that the macro references along with it,
            // so that they stay above it.
            let referenced: ASTNode[] = []
            if (shouldAllowReferencedAbove) {
              const passedOver = statements.filter(
                (statement) =>
                  statement.range[0] >= before.range[0] &&
                  statement.range[0] < node.range[0] &&
                  !macroStatements.has(statement) &&
                  !movedNodes.includes(statement)
              )
              referenced = getReferencedChain(node, passedOver, getDependencies)
            }
            if (referenced.includes(before)) {
              if (movedNodes.length > 0) {
                // Move only the previous macros, this one can stay below the
                // declaration it references.
                break
              }
              if (!isTypeOnlyDeclaration(before)) {
                // Don't move the macro above a runtime declaration it uses
                return null
              }
              // Types can be used above their declaration, so leave it
              referenced = referenced.filter(
                (statement) => statement !== before
              )
            }
            movedNodes.push(...referenced, node)
          }
          // Don't move a macro above a runtime declaration it uses, or above
          // a statement that uses the same variables
          return canMoveBefore(movedNodes, before, getDependencies) &&
            canMoveBeforeVariableUses(
              movedNodes,
              before,
              statements,
              getVariableUses(sourceCode, program)
            )
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
    const messageId = beforeMacro ? 'macrosUnordered' : notAtTopMessageId
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

    const fixes = [
      fixer.insertTextBefore(targetComment, insertText),
      fixer.removeRange([cutStart, cutEnd])
    ]
    // handle case when moving b() out of a()\nb()\n;(c)() would leave
    // a()\n(c)(), as b() takes the semicolon with it
    const afterNodeToken = sourceCode.getTokenAfter(node)
    if (
      afterNodeToken &&
      beforeNodeToken.value !== ';' &&
      isAsiHazard(afterNodeToken)
    ) {
      fixes.push(fixer.insertTextBefore(afterNodeToken, ';'))
    }
    return fixes
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
    // handle case when a();b() -> b()a();, and when moving c() before (b)()
    // in a\n;(b)() -> a\n;c()\n(b)()
    const isInvalidResult =
      !textNode.endsWith(';') &&
      (!afterText.includes('\n') ||
        isAsiHazard(sourceCode.getFirstToken(target)))

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
      macrosNotAtTopOrReferenced:
        '{{macro}} should be placed at the top of `<script setup>` (after any potential import statements, type definitions or declarations it references).',
      macrosUnordered: '{{macro}} should be above {{before}}.',
      defineExposeNotTheLast:
        '`defineExpose` should be the last statement in `<script setup>`.',
      putExposeAtTheLast:
        'Put `defineExpose` as the last statement in `<script setup>`.'
    }
  },
  create
}
