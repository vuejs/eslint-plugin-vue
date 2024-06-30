/**
 * @author ItMaga
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require default export',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/require-default-export.html'
    },
    fixable: null,
    schema: [],
    messages: {
      missing: 'Missing default export.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const sourceCode = context.getSourceCode()
    const documentFragment = sourceCode.parserServices.getDocumentFragment?.()

    const hasScript =
      documentFragment &&
      documentFragment.children.some(
        (e) => utils.isVElement(e) && e.name === 'script'
      )

    if (utils.isScriptSetup(context) || !hasScript) {
      return {}
    }

    let hasDefaultExport = false

    return {
      'Program > ExportDefaultDeclaration'() {
        hasDefaultExport = true
      },

      /**
       * @param {Program} node
       */
      'Program:exit'(node) {
        if (!hasDefaultExport && node.body.length > 0) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missing'
          })
        }
      }
    }
  }
}
