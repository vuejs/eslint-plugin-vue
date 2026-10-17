/**
 * @author Yang Bai
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using `$el`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-dollar-el.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Unexpected use of `$el`.'
    }
  },
  create(context: RuleContext) {
    function verifyMemberExpression(node: MemberExpression) {
      if (utils.getStaticPropertyName(node) !== '$el') {
        return
      }
      context.report({
        node: node.property,
        messageId: 'unexpected'
      })
    }

    const scriptVisitor = {
      MemberExpression: verifyMemberExpression
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {
        VExpressionContainer(node: VExpressionContainer) {
          for (const reference of node.references) {
            if (reference.variable != null) {
              // Not vm reference
              continue
            }
            if (reference.id.name === '$el') {
              context.report({
                node: reference.id,
                messageId: 'unexpected'
              })
            }
          }
        },
        MemberExpression: verifyMemberExpression
      },
      utils.compositingVisitors(
        utils.defineVueVisitor(context, scriptVisitor),
        utils.defineScriptSetupVisitor(context, scriptVisitor)
      )
    )
  }
}
