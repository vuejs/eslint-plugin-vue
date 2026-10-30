/**
 * @fileoverview Enforces render function to always return value.
 * @author Armano
 */
import utils from '../utils/index.ts'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce render function to always return value',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/require-render-return.html'
    },
    fixable: null,
    schema: [],
    messages: {
      expectedReturn: 'Expected to return a value in render function.'
    }
  },
  create(context: RuleContext) {
    const renderFunctions = new Map<ESNode, Property['key']>()

    return utils.compositingVisitors(
      utils.defineVueVisitor(context, {
        onRenderFunctionEnter(node) {
          renderFunctions.set(node, node.parent.key)
        }
      }),
      utils.executeOnFunctionsWithoutReturn(context, true, (node) => {
        const key = renderFunctions.get(node)
        if (key) {
          context.report({
            node: key,
            messageId: 'expectedReturn'
          })
        }
      })
    )
  }
}
