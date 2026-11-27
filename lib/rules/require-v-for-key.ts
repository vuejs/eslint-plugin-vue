/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'require `v-bind:key` with `v-for` directives',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/require-v-for-key.html'
    },
    fixable: null,
    schema: [],
    messages: {
      requireKey:
        "Elements in iteration expect to have 'v-bind:key' directives."
    }
  },
  create(context: RuleContext) {
    /**
     * Check the given element about `v-bind:key` attributes.
     */
    function checkKey(element: VElement) {
      if (utils.hasDirective(element, 'bind', 'key')) {
        return
      }
      if (element.name === 'template' || element.name === 'slot') {
        for (const child of element.children) {
          if (child.type === 'VElement') {
            checkKey(child)
          }
        }
      } else if (!utils.isCustomComponent(element)) {
        context.report({
          node: element.startTag,
          loc: element.startTag.loc,
          messageId: 'requireKey'
        })
      }
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='for']"(node: VDirective) {
        checkKey(node.parent.parent)
      }
    })
  }
}
