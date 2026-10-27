/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

type VExpression = NonNullable<VExpressionContainer['expression']>

interface OrOperands {
  node: VExpression
  operands: AndOperands[]
}

interface AndOperands {
  node: VExpression
  operands: VExpression[]
}

/**
 * Splits the given node by the given logical operator.
 * @param operator Logical operator `||` or `&&`.
 * @returns Array of conditions that makes the node when joined by the operator.
 */
function splitByLogicalOperator(
  operator: string,
  node: VExpression
): VExpression[] {
  if (node.type === 'LogicalExpression' && node.operator === operator) {
    return [
      ...splitByLogicalOperator(operator, node.left),
      ...splitByLogicalOperator(operator, node.right)
    ]
  }
  return [node]
}

function splitByOr(node: VExpression) {
  return splitByLogicalOperator('||', node)
}
function splitByAnd(node: VExpression) {
  return splitByLogicalOperator('&&', node)
}

function buildOrOperands(node: VExpression): OrOperands {
  const orOperands = splitByOr(node)
  return {
    node,
    operands: orOperands.map((orOperand) => {
      const andOperands = splitByAnd(orOperand)
      return {
        node: orOperand,
        operands: andOperands
      }
    })
  }
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow duplicate conditions in `v-if` / `v-else-if` chains',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-dupe-v-else-if.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected:
        'This branch can never execute. Its condition is a duplicate or covered by previous conditions in the `v-if` / `v-else-if` chain.'
    }
  },
  create(context: RuleContext) {
    const sourceCode = context.sourceCode
    const tokenStore =
      sourceCode.parserServices.getTemplateBodyTokenStore &&
      sourceCode.parserServices.getTemplateBodyTokenStore()
    /**
     * Determines whether the two given nodes are considered to be equal. In particular, given that the nodes
     * represent expressions in a boolean context, `||` and `&&` can be considered as commutative operators.
     */
    function isEqual(a: VExpression, b: VExpression): boolean {
      return (
        a.type === b.type &&
        (utils.equalTokens(a, b, tokenStore) ||
          (a.type === 'LogicalExpression' &&
            b.type === 'LogicalExpression' &&
            (a.operator === '||' || a.operator === '&&') &&
            a.operator === b.operator &&
            ((isEqual(a.left, b.left) && isEqual(a.right, b.right)) ||
              (isEqual(a.left, b.right) && isEqual(a.right, b.left)))))
      )
    }

    /**
     * Determines whether the first given AndOperands is a subset of the second given AndOperands.
     *
     * e.g. A: (a && b), B: (a && b && c): B is a subset of A.
     */
    function isSubset(operandsA: AndOperands, operandsB: AndOperands): boolean {
      return operandsA.operands.every((operandA) =>
        operandsB.operands.some((operandB) => isEqual(operandA, operandB))
      )
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='else-if']"(node) {
        if (!node.value || !node.value.expression) {
          return
        }
        const test = node.value.expression
        const conditionsToCheck =
          test.type === 'LogicalExpression' && test.operator === '&&'
            ? [...splitByAnd(test), test]
            : [test]
        const listToCheck = conditionsToCheck.map(buildOrOperands)

        let current: VElement | null = node.parent.parent
        while ((current &&= utils.prevSibling(current))) {
          const vIf = utils.getDirective(current, 'if')
          const currentTestDir = vIf || utils.getDirective(current, 'else-if')
          if (!currentTestDir) {
            return
          }
          if (currentTestDir.value && currentTestDir.value.expression) {
            const currentOrOperands = buildOrOperands(
              currentTestDir.value.expression
            )

            for (const condition of listToCheck) {
              const operands = (condition.operands = condition.operands.filter(
                (orOperand) =>
                  currentOrOperands.operands.every(
                    (currentOrOperand) => !isSubset(currentOrOperand, orOperand)
                  )
              ))
              if (operands.length === 0) {
                context.report({
                  node: condition.node,
                  messageId: 'unexpected'
                })
                return
              }
            }
          }

          if (vIf) {
            return
          }
        }
      }
    })
  }
}
