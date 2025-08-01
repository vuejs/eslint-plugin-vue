/**
 * @fileoverview Restrict or warn use of v-html to prevent XSS attack
 * @author Nathan Zeplowitz
 */
'use strict'
const utils = require('../utils')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use of v-html to prevent XSS attack',
      categories: ['vue3-recommended', 'vue2-recommended'],
      url: 'https://eslint.vuejs.org/rules/no-v-html.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignorePattern: {
            type: 'string'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpected: "'v-html' directive can lead to XSS attack."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0]
    const ignoreRegEx = options?.ignorePattern
      ? new RegExp(options.ignorePattern, 'u')
      : undefined

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VDirective} node */
      "VAttribute[directive=true][key.name.name='html']"(node) {
        if (
          ignoreRegEx &&
          node.value &&
          node.value.expression &&
          node.value.expression.type === 'Identifier' &&
          ignoreRegEx.test(node.value.expression.name)
        ) {
          return
        }
        context.report({
          node,
          loc: node.loc,
          messageId: 'unexpected'
        })
      }
    })
  }
}
