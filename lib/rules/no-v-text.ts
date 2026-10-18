/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use of v-text',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-v-text.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: "Don't use 'v-text'."
    }
  },
  create(context: RuleContext) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='text']"(node: VDirective) {
        context.report({
          node,
          loc: node.loc,
          messageId: 'unexpected'
        })
      }
    })
  }
}
