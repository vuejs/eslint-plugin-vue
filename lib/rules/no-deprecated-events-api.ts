/**
 * @fileoverview disallow using deprecated events api
 * @author yoyo930021
 */
import utils from '../utils/index.js'

export default {
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
  create(context: RuleContext) {
    return utils.defineVueVisitor(context, {
      'CallExpression > MemberExpression, CallExpression > ChainExpression > MemberExpression'(
        node: MemberExpression &
          (
            | { parent: CallExpression }
            | { parent: ChainExpression & { parent: CallExpression } }
          )
      ) {
        const call =
          node.parent.type === 'ChainExpression'
            ? node.parent.parent
            : node.parent

        // Optional chaining (e.g. `this.$on?.()`) is OK because checking whether it is deprecated.
        if (
          call.optional ||
          utils.skipChainExpression(call.callee) !== node ||
          !['$on', '$off', '$once'].includes(
            utils.getStaticPropertyName(node) || ''
          ) ||
          !utils.isThis(node.object, context)
        ) {
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
