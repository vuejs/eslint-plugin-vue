/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using deprecated `Vue.config.keyCodes` (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-vue-config-keycodes.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: '`Vue.config.keyCodes` are deprecated.'
    }
  },

  create: function (context) {
    return {
      "MemberExpression[property.type='Identifier'][property.name='keyCodes']" (node) {
        const config = node.object
        if (config.type !== 'MemberExpression' ||
          config.property.type !== 'Identifier' ||
          config.property.name !== 'config' ||
          config.object.type !== 'Identifier' ||
          config.object.name !== 'Vue') {
          return
        }
        context.report({
          node,
          messageId: 'unexpected'
        })
      }
    }
  }
}
