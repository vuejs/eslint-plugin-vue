/**
 * @author Flo Edelmann
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * @param {RuleContext} context
 * @param {ASTNode} node
 */
function reportWithoutSuggestion(context, node) {
  context.report({
    node,
    messageId: 'deprecatedModel'
  })
}

/**
 * @param {ObjectExpression} node
 * @param {string} key
 * @returns {Literal | undefined}
 */
function findPropertyValue(node, key) {
  const property = node.properties.find(
    (property) =>
      property.type === 'Property' &&
      property.key.type === 'Identifier' &&
      property.key.name === key
  )
  if (
    !property ||
    property.type !== 'Property' ||
    property.value.type !== 'Literal'
  ) {
    return undefined
  }
  return property.value
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow deprecated `model` definition (in Vue.js 3.0.0+)',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-deprecated-model-definition.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          allowVue3Compat: {
            type: 'boolean'
          }
        }
      }
    ],
    messages: {
      deprecatedModel: '`model` definition is deprecated.',
      renameEvent: 'Rename event to `{{expectedEventName}}`.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const allowVue3Compat = Boolean(context.options[0]?.allowVue3Compat)

    return utils.executeOnVue(context, (obj) => {
      const modelProperty = utils.findProperty(obj, 'model')
      if (!modelProperty || modelProperty.value.type !== 'ObjectExpression') {
        return
      }

      if (!allowVue3Compat) {
        reportWithoutSuggestion(context, modelProperty)
        return
      }

      const propName = findPropertyValue(modelProperty.value, 'prop')
      const eventName = findPropertyValue(modelProperty.value, 'event')

      if (!propName || !eventName) {
        reportWithoutSuggestion(context, modelProperty)
        return
      }

      const expectedEventName = `update:${propName.value}`
      if (eventName.value !== expectedEventName) {
        context.report({
          node: modelProperty,
          messageId: 'deprecatedModel',
          suggest: [
            {
              messageId: 'renameEvent',
              data: { expectedEventName },
              fix(fixer) {
                return fixer.replaceTextRange(
                  [eventName.range[0] + 1, eventName.range[1] - 1],
                  expectedEventName
                )
              }
            }
          ]
        })
      }
    })
  }
}
