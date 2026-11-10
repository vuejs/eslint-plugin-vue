/**
 * @author ItMaga
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'require components to be the default export',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-default-export.html'
    },
    fixable: null,
    schema: [],
    messages: {
      missing: 'Missing default export.',
      mustBeDefaultExport: 'Component must be the default export.'
    }
  },
  create(context: RuleContext) {
    const sourceCode = context.sourceCode
    const documentFragment = sourceCode.parserServices.getDocumentFragment?.()

    const hasScript =
      documentFragment &&
      documentFragment.children.some(
        (e) => utils.isVElement(e) && e.name === 'script'
      )

    if (!hasScript || utils.isScriptSetup(context)) {
      return {}
    }

    let hasDefaultExport = false
    let hasDefinedComponent = false

    return utils.compositingVisitors(
      utils.defineVueVisitor(context, {
        onVueObjectExit() {
          hasDefinedComponent = true
        }
      }),

      {
        'Program > ExportDefaultDeclaration'() {
          hasDefaultExport = true
        },

        'Program:exit'(node: Program) {
          if (!hasDefaultExport && node.body.length > 0) {
            context.report({
              loc: node.tokens.at(-1)!.loc,
              messageId: hasDefinedComponent ? 'mustBeDefaultExport' : 'missing'
            })
          }
        }
      }
    )
  }
}
