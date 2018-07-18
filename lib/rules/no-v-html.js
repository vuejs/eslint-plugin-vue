/**
 * @fileoverview Restrict or warn use of v-html to prevent XSS attack
 * @author Nathan Zeplowitz
 */
'use strict'
const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definitionutilu
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'disallow use of v-html to prevent XSS attack',
      category: undefined,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.7.0/docs/rules/no-v-html.md'
    },
    fixable: null,
    schema: []
  },
  create (context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name='html']" (node) {
        context.report({
          node,
          loc: node.loc,
          message: "'v-html' directive can lead to XSS attack."
        })
      }
    })
  }
}
