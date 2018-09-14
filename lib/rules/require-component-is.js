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
      description: 'require `v-bind:is` of `<component>` elements',
      category: 'essential',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.3/docs/rules/require-component-is.md'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VElement[name='component']" (node) {
        if (!utils.hasDirective(node, 'bind', 'is')) {
          context.report({
            node,
            loc: node.loc,
            message: "Expected '<component>' elements to have 'v-bind:is' attribute."
          })
        }
      }
    })
  }
}
