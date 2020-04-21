/**
 * @author Yosuke Ota
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
      description: 'disallow using deprecated `inline-template` attribute',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-inline-template.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: '`inline-template` are deprecated.'
    }
  },

  create: function (context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=false] > VIdentifier[rawName='inline-template']" (node) {
        context.report({
          node,
          loc: node.loc,
          messageId: 'unexpected'
        })
      }
    })
  }
}
