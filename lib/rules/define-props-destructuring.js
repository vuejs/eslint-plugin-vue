/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils/index.ts')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce consistent style for props destructuring',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/define-props-destructuring.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          destructure: {
            enum: ['only-when-assigned', 'always', 'never']
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      preferDestructuring: 'Prefer destructuring from `defineProps` directly.',
      avoidDestructuring: 'Avoid destructuring from `defineProps`.',
      avoidWithDefaults: 'Avoid using `withDefaults` with destructuring.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0] || {}
    const destructurePreference = options.destructure || 'only-when-assigned'

    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, props) {
          const hasArgs = props.some(
            (prop) => prop.propName || (prop.type === 'unknown' && prop.node)
          )
          if (!hasArgs) {
            return
          }

          const hasDestructure = utils.isUsingPropsDestructure(node)
          const hasWithDefaults = utils.hasWithDefaults(node)
          const hasAssigned = !!utils.getLeftOfDefineProps(node)

          if (destructurePreference === 'never') {
            if (hasDestructure) {
              context.report({
                node,
                messageId: 'avoidDestructuring'
              })
            }
            return
          }

          if (
            !hasDestructure &&
            (destructurePreference === 'always' || hasAssigned)
          ) {
            context.report({
              node,
              messageId: 'preferDestructuring'
            })
            return
          }

          if (hasWithDefaults) {
            context.report({
              node: node.parent.callee,
              messageId: 'avoidWithDefaults'
            })
          }
        }
      })
    )
  }
}
