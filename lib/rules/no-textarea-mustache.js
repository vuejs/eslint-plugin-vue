/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'disallow mustaches in `<textarea>`',
      category: 'essential',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.7.0/docs/rules/no-textarea-mustache.md'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VElement[name='textarea'] VExpressionContainer" (node) {
        if (node.parent.type !== 'VElement') {
          return
        }

        context.report({
          node,
          loc: node.loc,
          message: "Unexpected mustache. Use 'v-model' instead."
        })
      }
    })
  }
}
