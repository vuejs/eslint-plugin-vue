/**
 * @fileoverview Disallow usage of button without an explicit type attribute
 * @author Jonathan Santerre <jonathan@santerre.dev>
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
      description: 'disallow usage of button without an explicit type attribute',
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
    const configuration = Object.assign({}, optionDefaults, context.options[0])

    function report (node, messageId, data) {
      context.report({
        node,
        messageId,
        data
      })
    }

    function validateAttribute (attribute) {
      const value = attribute.value
      const strValue = value.value
      if (strValue === '') {
        report(value, 'emptyTypeAttribute')
      } else if (!(strValue in configuration)) {
        report(value, 'invalidTypeAttribute', { value: strValue })
      } else if (!configuration[strValue]) {
        report(value, 'forbiddenTypeAttribute', { value: strValue })
      }
    }

    function validateDirective (directive) {
      const value = directive.value
      if (!value.expression) {
        report(value, 'emptyTypeAttribute')
      }
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VElement[name='button']" (node) {
        if (utils.hasAttribute(node, 'type')) {
          validateAttribute(utils.getAttribute(node, 'type'))
        } else if (utils.hasDirective(node, 'bind', 'type')) {
          validateDirective(utils.getDirective(node, 'bind', 'type'))
        } else {
          report(node, 'missingTypeAttribute')
        }
      }
    })
  }
}
