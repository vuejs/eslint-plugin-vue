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
    if (utils.isScriptSetup(context)) {
      return {}
    }

    return {
      /**
       * @param {Program} node
       */
      'Program:exit'(node) {
        const hasDefaultExport = node.body.some(
          (item) => item.type === 'ExportDefaultDeclaration'
        )

        if (!hasDefaultExport) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: 'missing'
          })
        }
      }
    }
  }
}
