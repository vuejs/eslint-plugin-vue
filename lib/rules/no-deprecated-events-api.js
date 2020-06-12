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
      noDeprecatedEventsApi:
        'The Events api `$on`, `$off` `$once` is deprecated. Using external library instead, for example mitt.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineVueVisitor(context, {
      /** @param {MemberExpression & {parent: CallExpression}} node */
      'CallExpression > MemberExpression'(node) {
        const call = node.parent
        if (
          call.callee !== node ||
          node.property.type !== 'Identifier' ||
          !['$on', '$off', '$once'].includes(node.property.name)
        ) {
          return
        }
        if (!utils.isThis(node.object, context)) {
          return
        }

        context.report({
          node: node.property,
          messageId: 'noDeprecatedEventsApi'
        })
      }
    })
  }
}
