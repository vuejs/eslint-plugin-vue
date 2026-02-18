/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const {
  defineTemplateBodyVisitor,
  getAttribute,
  getDirective,
  hasDirective
} = require('../utils/index.ts')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow `key` attribute on `<template>`',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-template-key.html'
    },
    fixable: null,
    schema: [],
    messages: {
      disallow:
        "'<template>' cannot be keyed. Place the key on real elements instead."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return defineTemplateBodyVisitor(context, {
      /** @param {VElement} node */
      "VElement[name='template']"(node) {
        const keyNode =
          getAttribute(node, 'key') || getDirective(node, 'bind', 'key')
        if (keyNode) {
          if (hasDirective(node, 'for')) {
            // It's valid for Vue.js 3.x.
            // <template v-for="item in list" :key="item.id"> ... </template>
            // see https://github.com/vuejs/vue-next/issues/1734
            return
          }
          context.report({
            node: keyNode,
            loc: keyNode.loc,
            messageId: 'disallow'
          })
        }
      }
    })
  }
}
