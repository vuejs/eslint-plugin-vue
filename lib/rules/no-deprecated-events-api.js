/**
 * @fileoverview disallow using deprecated events api
 * @author yoyo930021
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
      description: 'disallow using deprecated events api (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-events-api.html'
    },
    fixable: null,
    schema: [],
    messages: {
      noDeprecatedEventsApi: 'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.'
    }
  },

  create (context) {
    return utils.defineVueVisitor(context,
      {
        'CallExpression > MemberExpression > ThisExpression' (node) {
          if (!['$on', '$off', '$once'].includes(node.parent.property.name)) return

          context.report({
            node: node.parent.parent,
            messageId: 'noDeprecatedEventsApi'
          })
        }
      }
    )
  }
}
