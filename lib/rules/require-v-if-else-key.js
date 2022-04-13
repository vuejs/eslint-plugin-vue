/**
 * @author Doug Wade <douglas.b.wade@gmail.com>
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

// ...

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require `key` with `v-if/v-else-if/v-else` directives',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-v-if-else-key.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected:
        'Elements in v-if/v-else-if/v-else expect to have distinct keys if they are of the same type.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const NO_MATCH = Symbol('no match')

    /**
     * Gets the key from an element.
     * @param {VElement} element The element node to get the key from.
     * @return {String | null}
     */
    function getKey(element) {
      const keyAttribute = utils.getAttribute(element, 'key')
      if (keyAttribute) {
        return keyAttribute?.value?.value || ''
      }

      const keyDirective = utils.getDirective(element, 'bind', 'key')
      if (!keyDirective) {
        return ''
      }

      if (keyDirective.value?.expression?.type !== 'Identifier') {
        return null
      }

      return `v-bind:${keyDirective.value?.expression?.name}`
    }

    /**
     * Check the given element about `v-bind:key` attributes.
     * @param {VElement} element The element node to check.
     */
    function checkKey(element) {
      const prevSibling = utils.prevSibling(element)

      if (!prevSibling) {
        return
      }

      if (prevSibling.name !== element.name) {
        return
      }

      const key = getKey(element)

      if (key === null) {
        return
      }

      if (!key || key === getKey(prevSibling)) {
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
