/**
 * @fileoverview disallow using deprecated number (keycode) modifiers
 * @author yoyo930021
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const keyCodeToKey = require('../utils/keycode-to-key.json')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using deprecated number (keycode) modifiers',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-v-on-number-modifiers.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      numberModifierIsDeprecated: "'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."
    }
  },

  create (context) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='on']" (node) {
        const modifier = node.key.modifiers.find(mod => Number.isInteger(parseInt(mod.name, 10)))
        if (!modifier) return

        const keyCodes = parseInt(modifier.name, 10)
        if (
          keyCodes > 9 || keyCodes < 0
        ) {
          context.report({
            node,
            loc: node.loc,
            messageId: 'numberModifierIsDeprecated',
            fix: (fixer) => {
              const key = keyCodeToKey[keyCodes]
              if (!key) return

              return fixer.replaceTextRange(modifier.range, `${key}`)
            }
          })
        }
      }
    })
  }
}
