/**
 * @author Doug Wade <douglas.b.wade@gmail.com>
 */

'use strict'

const utils = require('../utils')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'prevent usage of forbidden html elements',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/html-forbid-elements.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          forbid: {
            type: 'array',
            uniqueItems: true,
            minItems: 1,
            items: {
              type: 'string'
            }
          }
        },
        required: ['forbid']
      }
    ],
    messages: {
      unexpectedUseOfForbiddenElement:
        'Unexpected use of forbidden HTML element {{ actual }}.'
    }
  },
  /**
   * @param {RuleContext} context - The rule context.
   * @returns {RuleListener} AST event handlers.
   */
  create(context) {
    const option = context.options[0]

    return utils.defineTemplateBodyVisitor(context, {
      /**
       * @param {VElement} node
       */
      VElement(node) {
        if (!utils.isHtmlElementNode(node)) {
          return
        }

        if (option.forbid.includes(node.name)) {
          context.report({
            messageId: 'unexpectedUseOfForbiddenElement',
            node: node.startTag,
            data: { actual: node.name }
          })
        }
      }
    })
  }
}
