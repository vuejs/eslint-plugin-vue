/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

/**
 * count ObjectExpression element
 */
function countObjectExpression(
  node: VDirective & {
    value: VExpressionContainer & { expression: ArrayExpression }
  }
): number {
  return node.value.expression.elements.filter(
    (element) => element && element.type === 'ObjectExpression'
  ).length
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow passing multiple objects in an array to class',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-multiple-objects-in-class.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Unexpected multiple objects. Merge objects.'
    }
  },
  create(context: RuleContext) {
    return utils.defineTemplateBodyVisitor(context, {
      'VAttribute[directive=true][key.argument.name="class"][key.name.name="bind"][value.expression.type="ArrayExpression"]'(
        node: VDirective & {
          value: VExpressionContainer & { expression: ArrayExpression }
        }
      ) {
        if (countObjectExpression(node) > 1) {
          context.report({
            node,
            loc: node.loc,
            messageId: 'unexpected'
          })
        }
      }
    })
  }
}
