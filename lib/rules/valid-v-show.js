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
      description: 'enforce valid `v-show` directives',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/valid-v-show.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpectedArgument: "'v-show' directives require no argument.",
      unexpectedModifier: "'v-show' directives require no modifier.",
      expectedValue: "'v-show' directives require that attribute value.",
      unexpectedTemplate:
        "'v-show' directives cannot be put on <template> tags."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VDirective} node */
      "VAttribute[directive=true][key.name.name='show']"(node) {
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
        if (node.parent.parent.name === 'template') {
          context.report({
            node,
            messageId: 'unexpectedTemplate'
          })
        }
      }
    })
  }
}
