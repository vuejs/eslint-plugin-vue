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
    type: 'problem',
    docs: {
      description: 'enforce valid `v-once` directives',
      category: 'essential',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0/docs/rules/valid-v-once.md'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name='once']" (node) {
        if (node.key.argument) {
          context.report({
            node,
            loc: node.loc,
            message: "'v-once' directives require no argument."
          })
        }
        if (node.key.modifiers.length > 0) {
          context.report({
            node,
            loc: node.loc,
            message: "'v-once' directives require no modifier."
          })
        }
        if (node.value) {
          context.report({
            node,
            loc: node.loc,
            message: "'v-once' directives require no attribute value."
          })
        }
      }
    })
  }
}
