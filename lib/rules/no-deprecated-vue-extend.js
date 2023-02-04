/**
 * @author Madogiwa(@madogiwa0124)
 * See LICENSE file in root directory for full license.
 */
'use strict'

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using deprecated `Vue.extend` (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-vue-extend.html'
    },
    fixable: null,
    schema: [],
    messages: {
      noDeprecatedVueExtend: '`Vue.extend` are deprecated.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return {
      /** @param {CallExpression} node */
      CallExpression(node) {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.object.name === 'Vue' &&
          node.callee.property.name === 'extend'
        ) {
          context.report({ node, messageId: 'noDeprecatedVueExtend' })
        }
      }
    }
  }
}
