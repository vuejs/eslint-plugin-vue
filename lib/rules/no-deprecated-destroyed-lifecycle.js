/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow using deprecated `destroyed` and `beforeDestroy` lifecycle hooks (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url:
        'https://eslint.vuejs.org/rules/no-deprecated-destroyed-lifecycle.html'
    },
    fixable: null,
    schema: [],
    messages: {
      deprecatedDestroyed:
        'The `destroyed` lifecycle hook is deprecated. Use `unmounted` instead.',
      deprecatedBeforeDestroy:
        'The `beforeDestroy` lifecycle hook is deprecated. Use `beforeUnmount` instead.',
      insteadUnmounted: 'Instead, change to `unmounted`.',
      insteadBeforeUnmount: 'Instead, change to `beforeUnmount`.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.executeOnVue(context, (obj) => {
      const destroyed = utils.findProperty(obj, 'destroyed')

      if (destroyed) {
        context.report({
          node: destroyed.key,
          messageId: 'deprecatedDestroyed',
          // I don't know if they have exactly the same function, so don't do autofix.
          suggest: [
            {
              messageId: 'insteadUnmounted',
              fix(fixer) {
                if (destroyed.shorthand) {
                  return fixer.insertTextBefore(destroyed.key, 'unmounted:')
                }
                return fixer.replaceText(destroyed.key, 'unmounted')
              }
            }
          ]
        })
      }

      const beforeDestroy = utils.findProperty(obj, 'beforeDestroy')
      if (beforeDestroy) {
        context.report({
          node: beforeDestroy.key,
          messageId: 'deprecatedBeforeDestroy',
          // I don't know if they have exactly the same function, so don't do autofix.
          suggest: [
            {
              messageId: 'insteadBeforeUnmount',
              fix(fixer) {
                if (beforeDestroy.shorthand) {
                  return fixer.insertTextBefore(
                    beforeDestroy.key,
                    'beforeUnmount:'
                  )
                }
                return fixer.replaceText(beforeDestroy.key, 'beforeUnmount')
              }
            }
          ]
        })
      }
    })
  }
}
