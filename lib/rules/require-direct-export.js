/**
 * @fileoverview require the component to be directly exported
 * @author Hiroki Osame <hiroki.osame@gmail.com>
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'require the component to be directly exported',
      category: 'essential',
      recommended: false,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.3/docs/rules/require-direct-export.md'
    },
    fixable: null,  // or "code" or "whitespace"
    schema: []
  },

  create (context) {
    const filePath = context.getFilename()

    return {
      'ExportDefaultDeclaration:exit' (node) {
        const isVueFile = utils.isVueFile(filePath)
        if (!isVueFile) { return }

        const isObjectExpression = (
          node.type === 'ExportDefaultDeclaration' &&
                    node.declaration.type === 'ObjectExpression'
        )

        if (!isObjectExpression) {
          context.report({
            node,
            message: `Expected the component literal to be directly exported.`
          })
        }
      }
    }
  }
}
