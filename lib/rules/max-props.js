/**
 * @author kevsommer Kevin Sommer
 * See LICENSE file in root directory for full license.
 */
'use strict'
const utils = require('../utils')
const { getRuleOptions } = require('../utils/rule-options')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce maximum number of props in Vue component',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/max-props.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          maxProps: {
            type: 'integer',
            minimum: 1
          }
        },
        additionalProperties: false,
        minProperties: 1
      }
    ],
    defaultOptions: [{ maxProps: 1 }],
    messages: {
      tooManyProps:
        'Component has too many props ({{propCount}}). Maximum allowed is {{limit}}.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {{ maxProps: number }[]} */
    const [{ maxProps }] = getRuleOptions(context, __filename)

    /**
     * @param {import('../utils').ComponentProp[]} props
     */
    function checkMaxNumberOfProps(props) {
      if (props.length > maxProps && props[0].node) {
        context.report({
          node: props[0].node.parent,
          messageId: 'tooManyProps',
          data: {
            propCount: props.length,
            limit: maxProps
          }
        })
      }
    }

    return utils.compositingVisitors(
      utils.executeOnVue(context, (obj) => {
        checkMaxNumberOfProps(utils.getComponentPropsFromOptions(obj))
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(_, props) {
          checkMaxNumberOfProps(props)
        }
      })
    )
  }
}
