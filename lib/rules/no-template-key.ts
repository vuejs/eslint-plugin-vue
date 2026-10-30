/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

export default {
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
  create(context: RuleContext) {
    return utils.defineTemplateBodyVisitor(context, {
      "VElement[name='template']"(node: VElement) {
        const keyNode =
          utils.getAttribute(node, 'key') ||
          utils.getDirective(node, 'bind', 'key')
        if (!keyNode || utils.hasDirective(node, 'for')) {
          // v-for on template is valid for Vue.js 3.x.
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
    })
  }
}
