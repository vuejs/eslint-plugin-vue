/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

// Vue unwraps these TypeScript nodes before checking the defineOptions argument.
const TS_WRAPPER_TYPES = new Set([
  'TSAsExpression',
  'TSTypeAssertion',
  'TSNonNullExpression',
  'TSInstantiationExpression',
  'TSSatisfiesExpression'
])
const UNSUPPORTED_OPTIONS = new Set(['props', 'emits', 'expose', 'slots'])

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce use of `defineOptions` instead of default export',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-define-options.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferDefineOptions: 'Use `defineOptions` instead of default export.'
    }
  },
  create(context: RuleContext): RuleListener {
    const scriptSetup = utils.getScriptSetupElement(context)
    if (!scriptSetup) {
      return {}
    }

    let defineOptionsNode: CallExpression | null = null
    let exportDefaultDeclaration: ExportDefaultDeclaration | null = null
    let lastImportDeclaration: ImportDeclaration | null = null

    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        ImportDeclaration(node) {
          lastImportDeclaration = node
        },
        onDefineOptionsEnter(node) {
          defineOptionsNode = node
        }
      }),
      {
        ExportDefaultDeclaration(node) {
          exportDefaultDeclaration = node
        },
        'Program:exit'() {
          if (!exportDefaultDeclaration) {
            return
          }
          context.report({
            node: exportDefaultDeclaration,
            messageId: 'preferDefineOptions',
            fix: defineOptionsNode
              ? null
              : buildFix(exportDefaultDeclaration, scriptSetup)
          })
        }
      }
    )

    function buildFix(
      node: ExportDefaultDeclaration,
      scriptSetup: VElement
    ): ((fixer: RuleFixer) => Fix[]) | null {
      let declaration = node.declaration
      while (TS_WRAPPER_TYPES.has(declaration.type)) {
        declaration = (declaration as { expression: Expression }).expression
      }
      if (
        declaration.type === 'ObjectExpression' &&
        declaration.properties.some((property) => {
          if (!utils.isProperty(property)) {
            return false
          }
          // Vue checks identifier keys even for computed properties.
          const name =
            property.key.type === 'Identifier'
              ? property.key.name
              : utils.getStaticPropertyName(property)
          return name != null && UNSUPPORTED_OPTIONS.has(name)
        })
      ) {
        return null
      }

      return (fixer) => {
        const sourceCode = context.sourceCode

        // Calc remove range
        let removeRange: Range = [...node.range]

        const script = scriptSetup.parent.children
          .filter(utils.isVElement)
          .find(
            (node) =>
              node.name === 'script' && !utils.hasAttribute(node, 'setup')
          )
        if (
          script &&
          script.endTag &&
          sourceCode
            .getTokensBetween(script.startTag, script.endTag, {
              includeComments: true
            })
            .every(
              (token) =>
                removeRange[0] <= token.range[0] &&
                token.range[1] <= removeRange[1]
            )
        ) {
          removeRange = [...script.range]
        }
        const removeStartLoc = sourceCode.getLocFromIndex(removeRange[0])
        if (
          sourceCode.lines[removeStartLoc.line - 1]
            .slice(0, removeStartLoc.column)
            .trim() === ''
        ) {
          removeRange[0] =
            removeStartLoc.line === 1
              ? 0
              : sourceCode.getIndexFromLoc({
                  line: removeStartLoc.line - 1,
                  column: sourceCode.lines[removeStartLoc.line - 2].length
                })
        }

        const insertAfterTag: VStartTag | ImportDeclaration =
          lastImportDeclaration || scriptSetup.startTag

        return [
          fixer.removeRange(removeRange),
          fixer.insertTextAfter(
            insertAfterTag,
            `\ndefineOptions(${sourceCode.getText(node.declaration)})\n`
          )
        ]
      }
    }
  }
}
