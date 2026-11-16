/**
 * @author Thomasan1999
 * See LICENSE file in root directory for full license.
 */
import { findVariable } from '@eslint-community/eslint-utils'
import utils from '../utils/index.ts'

type ScriptRef = [string, CallExpression]

function getScriptRefsFromSetupFunction(
  body: (Statement | ModuleDeclaration)[]
): ScriptRef[] {
  return body.flatMap((child) => {
    if (child.type === 'VariableDeclaration') {
      const declarator = child.declarations[0]

      if (
        declarator.init?.type === 'CallExpression' &&
        declarator.init.callee?.type === 'Identifier' &&
        declarator.id.type === 'Identifier' &&
        ['ref', 'shallowRef'].includes(declarator.init.callee.name)
      )
        return [[declarator.id.name, declarator.init]]
    }

    return []
  })
}

const USE_TEMPLATE_REF_IMPORT = "import { useTemplateRef } from 'vue';"

function hasNoInitialValue(node: CallExpression): boolean {
  const args = node.arguments
  return (
    args.length === 0 ||
    (args.length === 1 && args[0].type === 'Literal' && args[0].raw === 'null')
  )
}

function isWriteTarget(node: Expression): boolean {
  const parent = node.parent
  return (
    (parent.type === 'AssignmentExpression' && parent.left === node) ||
    parent.type === 'UpdateExpression'
  )
}

/**
 * Whether the variable or its `.value` is written anywhere in the script.
 * `useTemplateRef()` returns a readonly ref, so such code would break.
 */
function isWrittenInScript(variable: Variable): boolean {
  return variable.references.some((reference) => {
    if (reference.init) {
      return false
    }
    if (reference.isWrite()) {
      return true
    }
    const parent = reference.identifier.parent
    return (
      parent.type === 'MemberExpression' &&
      parent.object === reference.identifier &&
      isWriteTarget(parent)
    )
  })
}

function getIndent(sourceCode: SourceCode, node: ASTNode): string {
  const line = sourceCode.lines[node.loc.start.line - 1]
  return line.slice(0, line.length - line.trimStart().length)
}

/**
 * Gets the top-level statements of the `<script>` block that contains the node.
 */
function getScriptStatements(
  context: RuleContext,
  node: ASTNode
): (Statement | ModuleDeclaration)[] {
  const sourceCode = context.sourceCode
  const documentFragment = sourceCode.parserServices.getDocumentFragment?.()
  const script = documentFragment?.children
    .filter(utils.isVElement)
    .find(
      (element) =>
        element.name === 'script' &&
        element.range[0] <= node.range[0] &&
        node.range[1] <= element.range[1]
    )
  return script
    ? sourceCode.ast.body.filter(
        (statement) =>
          script.range[0] <= statement.range[0] &&
          statement.range[1] <= script.range[1]
      )
    : sourceCode.ast.body
}

function fixImport(
  context: RuleContext,
  fixer: RuleFixer,
  node: CallExpression
): Fix {
  const sourceCode = context.sourceCode
  const imports = sourceCode.ast.body.filter(
    (statement): statement is ImportDeclaration =>
      statement.type === 'ImportDeclaration'
  )

  const vueImport = imports.find(
    (declaration) =>
      declaration.source.value === 'vue' &&
      declaration.importKind !== 'type' &&
      declaration.specifiers.some(
        (specifier) => specifier.type === 'ImportSpecifier'
      )
  )
  if (vueImport) {
    return fixer.insertTextAfter(
      vueImport.specifiers.at(-1)!,
      ', useTemplateRef'
    )
  }

  const lastImport = imports.at(-1)
  if (lastImport) {
    return fixer.insertTextAfter(
      lastImport,
      `
${getIndent(sourceCode, lastImport)}${USE_TEMPLATE_REF_IMPORT}`
    )
  }

  const firstStatement = getScriptStatements(context, node)[0]
  return fixer.insertTextBefore(
    firstStatement,
    `${USE_TEMPLATE_REF_IMPORT}
${getIndent(sourceCode, firstStatement)}`
  )
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require using `useTemplateRef` instead of `ref`/`shallowRef` for template refs',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-use-template-ref.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferUseTemplateRef: "Replace '{{name}}' with 'useTemplateRef'."
    }
  },
  create(context: RuleContext) {
    const templateRefs = new Set<string>()
    const templateWrites = new Set<string>()

    const scriptRefs: ScriptRef[] = []

    function canFix(node: CallExpression, name: string): boolean {
      const { id } = node.parent as VariableDeclarator
      if (
        !hasNoInitialValue(node) ||
        // the annotation was written for `ref()` and may not match
        (id.type === 'Identifier' && id.typeAnnotation) ||
        templateWrites.has(name)
      ) {
        return false
      }
      const scope = utils.getScope(context, node)
      const useTemplateRefVariable = findVariable(scope, 'useTemplateRef')
      // a local `useTemplateRef` is something else; imports and globals are fine
      if (
        useTemplateRefVariable?.defs.some((def) => def.type !== 'ImportBinding')
      ) {
        return false
      }
      const variable = findVariable(scope, name)
      return variable !== null && !isWrittenInScript(variable)
    }

    function fix(fixer: RuleFixer, node: CallExpression, name: string): Fix[] {
      const sourceCode = context.sourceCode
      const typeArguments = node.typeArguments
        ? sourceCode.getText(node.typeArguments)
        : ''
      const fixes = [
        fixer.replaceText(node, `useTemplateRef${typeArguments}('${name}')`)
      ]
      if (!findVariable(utils.getScope(context, node), 'useTemplateRef')) {
        fixes.push(fixImport(context, fixer, node))
      }
      return fixes
    }

    return utils.compositingVisitors(
      utils.defineTemplateBodyVisitor(context, {
        'VAttribute[directive=false]'(node) {
          if (node.key.name === 'ref' && node.value?.value) {
            templateRefs.add(node.value.value)
          }
        },
        "VAttribute[directive=true][key.name.name='model']"(node) {
          if (node.value?.expression?.type === 'Identifier') {
            templateWrites.add(node.value.expression.name)
          }
        },
        VExpressionContainer(node) {
          for (const reference of node.references) {
            if (reference.mode !== 'r') {
              templateWrites.add(reference.id.name)
            }
          }
        }
      }),
      utils.defineVueVisitor(context, {
        onSetupFunctionEnter(node) {
          if (node.type === 'ArrowFunctionExpression' && node.expression) {
            return
          }
          const newScriptRefs = getScriptRefsFromSetupFunction(node.body.body)
          scriptRefs.push(...newScriptRefs)
        }
      }),
      utils.defineScriptSetupVisitor(context, {
        Program(node) {
          const newScriptRefs = getScriptRefsFromSetupFunction(node.body)

          scriptRefs.push(...newScriptRefs)
        }
      }),
      {
        'Program:exit'() {
          const scriptRefsMap = new Map(scriptRefs)

          for (const templateRef of templateRefs) {
            const scriptRef = scriptRefsMap.get(templateRef)

            if (!scriptRef) {
              continue
            }

            context.report({
              node: scriptRef,
              messageId: 'preferUseTemplateRef',
              data: {
                name: (scriptRef.callee as Identifier).name
              },
              fix: canFix(scriptRef, templateRef)
                ? (fixer) => fix(fixer, scriptRef, templateRef)
                : null
            })
          }
        }
      }
    )
  }
}
