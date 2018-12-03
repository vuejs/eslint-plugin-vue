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
      description: 'enforce valid `v-html` directives',
      category: 'essential',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0/docs/rules/valid-v-html.md'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name='html']" (node) {
        if (node.key.argument) {
          context.report({
            node,
            loc: node.loc,
            message: "'v-html' directives require no argument."
          })
        }
        if (node.key.modifiers.length > 0) {
          context.report({
            node,
            loc: node.loc,
            message: "'v-html' directives require no modifier."
          })
        }
        if (!utils.hasAttributeValue(node)) {
          context.report({
            node,
            loc: node.loc,
            message: "'v-html' directives require that attribute value."
          })
        }
      }
    })
  }
}
