/**
 * @author Yosuke Ota
 *
 * Style guide: https://vuejs.org/style-guide/rules-essential.html#avoid-v-if-with-v-for
 */
import utils from '../utils/index.ts'

/**
 * Check whether the given `v-if` node is using the variable which is defined by the `v-for` directive.
 */
function isUsingIterationVar(vIf: VDirective): boolean {
  return getVForUsingIterationVar(vIf) !== null
}

function getVForUsingIterationVar(vIf: VDirective) {
  if (!vIf.value) {
    return null
  }
  const element = vIf.parent.parent
  for (const reference of vIf.value.references) {
    const targetVFor = element.variables.find(
      (variable) =>
        variable.id.name === reference.id.name && variable.kind === 'v-for'
    )
    if (targetVFor) {
      return targetVFor
    }
  }
  return null
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow using `v-if` on the same element as `v-for`',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-use-v-if-with-v-for.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allowUsingIterationVar: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      movedToWrapper: "This 'v-if' should be moved to the wrapper element.",
      shouldUseComputed:
        "The '{{iteratorName}}' {{kind}} inside 'v-for' directive should be replaced with a computed property that returns filtered array instead. You should not mix 'v-for' with 'v-if'."
    }
  },
  create(context: RuleContext) {
    const options = context.options[0] || {}
    const shouldAllowUsingIterationVar = options.allowUsingIterationVar === true // default false
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='if']"(node: VDirective) {
        const element = node.parent.parent

        if (utils.hasDirective(element, 'for')) {
          if (isUsingIterationVar(node)) {
            if (!shouldAllowUsingIterationVar) {
              const vForVar = getVForUsingIterationVar(node)
              if (!vForVar) {
                return
              }

              let targetVForExpr = vForVar.id.parent
              while (targetVForExpr.type !== 'VForExpression') {
                targetVForExpr = targetVForExpr.parent as ASTNode
              }
              const iteratorNode = targetVForExpr.right
              context.report({
                node,
                loc: node.loc,
                messageId: 'shouldUseComputed',
                data: {
                  iteratorName:
                    iteratorNode.type === 'Identifier'
                      ? iteratorNode.name
                      : context.sourceCode.getText(iteratorNode),
                  kind:
                    iteratorNode.type === 'Identifier'
                      ? 'variable'
                      : 'expression'
                }
              })
            }
          } else {
            context.report({
              node,
              loc: node.loc,
              messageId: 'movedToWrapper'
            })
          }
        }
      }
    })
  }
}
