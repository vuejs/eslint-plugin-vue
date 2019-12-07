/**
 * @fileoverview Prevent usage of button without an explicit type attribute
 * @author Jonathan Santerre
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const optionDefaults = {
  button: true,
  submit: true,
  reset: true
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prevent usage of button without an explicit type attribute',
      category: 'recommended',
      url: 'https://eslint.vuejs.org/rules/html-button-has-type.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          button: {
            default: optionDefaults.button,
            type: 'boolean'
          },
          submit: {
            default: optionDefaults.submit,
            type: 'boolean'
          },
          reset: {
            default: optionDefaults.reset,
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      missingTypeAttribute: 'Missing an explicit type attribute for button.',
      invalidTypeAttribute: '{{value}} is an invalid value for button type attribute.',
      forbiddenTypeAttribute: '{{value}} is a forbidden value for button type attribute.',
      emptyTypeAttribute: 'A value must be set for button type attribute.'
    }
  },

  create: function (context) {
    const configuration = Object.assign({}, optionDefaults, context.options[0]);
    return utils.defineTemplateBodyVisitor(context, {
      VElement (node) {
        if (utils.isHtmlElementNode(node) && node.name === 'button') {
          if (!utils.hasAttribute(node, 'type')) {
            context.report({
              node: node.startTag,
              loc: node.startTag.loc,
              messageId: 'missingTypeAttribute'
            })
          } else {
            const value = utils.getAttribute(node, 'type').value.value
            if (value === '') {
              context.report({
                node,
                messageId: 'emptyTypeAttribute',
              })
            } else if (!(value in configuration)) {
              context.report({
                node,
                messageId: 'invalidTypeAttribute',
                data: { value }
              })
            } else if (!configuration[value]) {
              context.report({
                node,
                messageId: 'forbiddenTypeAttribute',
                data: { value }
              })
            }
          }
        }
      }
    })
  }
}
