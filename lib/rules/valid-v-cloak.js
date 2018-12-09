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
      description: 'enforce valid `v-cloak` directives',
      category: 'essential',
      url: 'https://vuejs.github.io/eslint-plugin-vue/rules/valid-v-cloak.html'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name='cloak']" (node) {
        if (node.key.argument) {
          context.report({
            node,
            loc: node.loc,
            message: "'v-cloak' directives require no argument."
          })
        }
        if (node.key.modifiers.length > 0) {
          context.report({
            node,
            loc: node.loc,
            message: "'v-cloak' directives require no modifier."
          })
        }
        if (node.value) {
          context.report({
            node,
            loc: node.loc,
            message: "'v-cloak' directives require no attribute value."
          })
        }
      }
    })
  }
}
