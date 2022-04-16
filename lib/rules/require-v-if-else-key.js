/**
 * @author Doug Wade <douglas.b.wade@gmail.com>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require `key` with `v-if`/`v-else-if`/`v-else` directives',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-v-if-else-key.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected:
        'Elements in v-if/v-else-if/v-else should have distinct keys if they have the same tag name.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * Check the given element about `v-bind:key` attributes.
     * @param {VElement} element The element node to check.
     */
    function checkKey(element) {
      if (element.name === 'template') {
        return
      }
      
      const prevSibling = utils.prevSibling(element)

      if (prevSibling && prevSibling.name !== element.name) {
        return
      }

      const keyAttribute = utils.getAttribute(element, 'key')
      const keyDirective = utils.getDirective(element, 'bind', 'key')

      if (keyAttribute) {
        return
      }

      if (!keyDirective) {
        context.report({ node: element, messageId: 'unexpected' })
        return
      }

      if (
        !keyDirective.value ||
        !keyDirective.value.expression ||
        keyDirective.value.expression.type !== 'Identifier'
      ) {
        return
      }

      if (!keyDirective.value.expression.name) {
        context.report({ node: element, messageId: 'unexpected' })
      }
    }

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VDirective} node */
      "VAttribute[directive=true][key.name.name='else']"(node) {
        checkKey(node.parent.parent)
      },
      /** @param {VDirective} node */
      "VAttribute[directive=true][key.name.name='else-if']"(node) {
        checkKey(node.parent.parent)
      }
    })
  }
}
