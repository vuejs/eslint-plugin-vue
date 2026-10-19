/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

type VIfDirective = VDirective & {
  value: (VExpressionContainer & { expression: Expression | null }) | null
}

function isNegatedExpression(expression: Expression): boolean {
  return (
    (expression.type === 'UnaryExpression' && expression.operator === '!') ||
    (expression.type === 'BinaryExpression' &&
      (expression.operator === '!=' || expression.operator === '!=='))
  )
}

function getNextSibling(node: VElement): VElement | null {
  if (!node.parent?.children) {
    return null
  }

  const siblings = node.parent.children
  const currentIndex = siblings.indexOf(node)

  for (let i = currentIndex + 1; i < siblings.length; i++) {
    const sibling = siblings[i]
    if (sibling.type === 'VElement') {
      return sibling
    }
  }

  return null
}

function isDirectlyFollowedByElse(element: VElement): boolean {
  const nextElement = getNextSibling(element)
  return nextElement ? utils.hasDirective(nextElement, 'else') : false
}

function getDirective(element: VElement) {
  return element.startTag.attributes.find(
    (attr): attr is VIfDirective =>
      attr.directive &&
      Boolean(attr.key.name?.name) &&
      ['if', 'else-if', 'else'].includes(attr.key.name.name)
  )
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow negated conditions in v-if/v-else',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-negated-v-if-condition.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      negatedCondition: 'Unexpected negated condition in v-if with v-else.'
    }
  },
  create(context: RuleContext) {
    const sourceCode = context.sourceCode

    const processedPairs = new Set()

    function getConvertedCondition(expression: Expression): string {
      if (
        expression.type === 'UnaryExpression' &&
        expression.operator === '!'
      ) {
        return sourceCode.text.slice(
          expression.range[0] + 1,
          expression.range[1]
        )
      }

      if (expression.type === 'BinaryExpression') {
        const left = sourceCode.getText(expression.left)
        const right = sourceCode.getText(expression.right)

        if (expression.operator === '!=') {
          return `${left} == ${right}`
        }
        if (expression.operator === '!==') {
          return `${left} === ${right}`
        }
      }

      return sourceCode.getText(expression)
    }

    function checkNegatedCondition(node: VIfDirective) {
      if (!node.value?.expression) {
        return
      }

      const expression = node.value.expression
      const element = node.parent.parent

      if (
        !isNegatedExpression(expression) ||
        !isDirectlyFollowedByElse(element)
      ) {
        return
      }

      const elseElement = getNextSibling(element)
      if (!elseElement) {
        return
      }

      const pairKey = `${element.range[0]}-${elseElement.range[0]}`
      if (processedPairs.has(pairKey)) {
        return
      }
      processedPairs.add(pairKey)

      context.report({
        node: expression,
        messageId: 'negatedCondition',
        fix: (fixer) => swapElements(fixer, element, elseElement, expression)
      })
    }

    function* swapElements(
      fixer: RuleFixer,
      ifElement: VElement,
      elseElement: VElement,
      expression: Expression
    ) {
      const convertedCondition = getConvertedCondition(expression)

      const ifDir = getDirective(ifElement)
      const elseDir = getDirective(elseElement)

      if (!ifDir || !elseDir) {
        return
      }

      const ifDirectiveName = ifDir.key.name.name

      const ifText = sourceCode.text.slice(
        ifElement.range[0],
        ifElement.range[1]
      )
      const elseText = sourceCode.text.slice(
        elseElement.range[0],
        elseElement.range[1]
      )

      const newIfDirective = `v-${ifDirectiveName}="${convertedCondition}"`
      const newIfText =
        elseText.slice(0, elseDir.range[0] - elseElement.range[0]) +
        newIfDirective +
        elseText.slice(elseDir.range[1] - elseElement.range[0])

      const newElseDirective = 'v-else'
      const newElseText =
        ifText.slice(0, ifDir.range[0] - ifElement.range[0]) +
        newElseDirective +
        ifText.slice(ifDir.range[1] - ifElement.range[0])

      yield fixer.replaceTextRange(ifElement.range, newIfText)
      yield fixer.replaceTextRange(elseElement.range, newElseText)
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='if']"(node: VIfDirective) {
        checkNegatedCondition(node)
      },
      "VAttribute[directive=true][key.name.name='else-if']"(
        node: VIfDirective
      ) {
        checkNegatedCondition(node)
      }
    })
  }
}
