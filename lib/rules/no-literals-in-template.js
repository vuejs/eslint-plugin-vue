/**
 * @author rzzf
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * @type {Record<string, 'object' | 'array' | 'function' | 'arrow function' | undefined>}
 */
const EXPRESSION_TYPES = {
  ObjectExpression: 'object',
  ArrayExpression: 'array',
  FunctionExpression: 'function',
  ArrowFunctionExpression: 'arrow function'
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow object literals in template',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-literals-in-template.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Unexpected {{type}} literal in template.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      /**
       * @param {VDirective} node
       */
      "VAttribute[directive=true][key.name.name='bind']"(node) {
        const expression = node.value?.expression
        if (
          !expression ||
          (node.key.argument &&
            node.key.argument.type === 'VIdentifier' &&
            (node.key.argument.name === 'class' ||
              node.key.argument.name === 'style'))
        ) {
          return
        }

        const type = EXPRESSION_TYPES[expression.type]
        if (type) {
          context.report({
            node: expression,
            messageId: 'unexpected',
            data: { type }
          })
        }
      }
    })
  }
}
