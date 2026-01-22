/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils/index.ts')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `v-text` directives',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/valid-v-text.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpectedArgument: "'v-text' directives require no argument.",
      unexpectedModifier: "'v-text' directives require no modifier.",
      expectedValue: "'v-text' directives require that attribute value."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VDirective} node */
      "VAttribute[directive=true][key.name.name='text']"(node) {
        if (node.key.argument) {
          context.report({
            node: node.key.argument,
            messageId: 'unexpectedArgument'
          })
        }
        const lastModifier = node.key.modifiers.at(-1)
        if (lastModifier) {
          context.report({
            node,
            loc: {
              start: node.key.modifiers[0].loc.start,
              end: lastModifier.loc.end
            },
            messageId: 'unexpectedModifier'
          })
        }
        if (!node.value || utils.isEmptyValueDirective(node, context)) {
          context.report({
            node,
            messageId: 'expectedValue'
          })
        }
      }
    })
  }
}
