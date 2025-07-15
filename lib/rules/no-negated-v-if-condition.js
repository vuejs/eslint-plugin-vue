/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef { VDirective & { value: (VExpressionContainer & { expression: Expression | null } ) | null  } } VIfDirective
 */

/**
 * @param {Expression} expression
 * @returns {boolean}
 */
function isNegatedExpression(expression) {
  return (
    (expression.type === 'UnaryExpression' && expression.operator === '!') ||
    (expression.type === 'BinaryExpression' &&
      (expression.operator === '!=' || expression.operator === '!=='))
  )
}

/**
 * @param {VElement} node
 * @returns {VElement|null}
 */
function getNextSibling(node) {
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

/**
 * @param {VElement} element
 * @returns {boolean}
 */
function isDirectlyFollowedByElse(element) {
  const nextElement = getNextSibling(element)
  return nextElement ? utils.hasDirective(nextElement, 'else') : false
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow negated conditions in v-if/v-else',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-negated-v-if-condition.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      negatedCondition: 'Unexpected negated condition in v-if with v-else.',
      fixNegatedCondition:
        'Convert to positive condition and swap if/else blocks.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const sourceCode = context.getSourceCode()
    const templateTokens =
      sourceCode.parserServices.getTemplateBodyTokenStore &&
      sourceCode.parserServices.getTemplateBodyTokenStore()

    /**
     * @param {VIfDirective} node
     */
    function checkNegatedCondition(node) {
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

      context.report({
        node: expression,
        messageId: 'negatedCondition',
        suggest: [
          {
            messageId: 'fixNegatedCondition',
            *fix(fixer) {
              yield* convertNegatedCondition(fixer, expression)
              yield* swapElementContents(fixer, element, elseElement)
            }
          }
        ]
      })
    }

    /**
     * @param {RuleFixer} fixer
     * @param {Expression} expression
     */
    function* convertNegatedCondition(fixer, expression) {
      if (
        expression.type === 'UnaryExpression' &&
        expression.operator === '!'
      ) {
        const token = templateTokens.getFirstToken(expression)
        if (token?.type === 'Punctuator' && token.value === '!') {
          yield fixer.remove(token)
        }
        return
      }

      if (expression.type === 'BinaryExpression') {
        const operatorToken = templateTokens.getTokenAfter(
          expression.left,
          (token) =>
            token?.type === 'Punctuator' && token.value === expression.operator
        )

        if (!operatorToken) return

        if (expression.operator === '!=') {
          yield fixer.replaceText(operatorToken, '==')
        } else if (expression.operator === '!==') {
          yield fixer.replaceText(operatorToken, '===')
        }
      }
    }

    /**
     * @param {VElement} element
     * @returns {string}
     */
    function getElementContent(element) {
      if (element.children.length === 0 || !element.endTag) {
        return ''
      }

      const contentStart = element.startTag.range[1]
      const contentEnd = element.endTag.range[0]

      return sourceCode.text.slice(contentStart, contentEnd)
    }

    /**
     * @param {RuleFixer} fixer
     * @param {VElement} ifElement
     * @param {VElement} elseElement
     */
    function* swapElementContents(fixer, ifElement, elseElement) {
      if (!ifElement.endTag || !elseElement.endTag) {
        return
      }

      const ifContent = getElementContent(ifElement)
      const elseContent = getElementContent(elseElement)

      if (ifContent === elseContent) {
        return
      }

      yield fixer.replaceTextRange(
        [ifElement.startTag.range[1], ifElement.endTag.range[0]],
        elseContent
      )
      yield fixer.replaceTextRange(
        [elseElement.startTag.range[1], elseElement.endTag.range[0]],
        ifContent
      )
    }

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VIfDirective} node */
      "VAttribute[directive=true][key.name.name='if']"(node) {
        checkNegatedCondition(node)
      },
      /** @param {VIfDirective} node */
      "VAttribute[directive=true][key.name.name='else-if']"(node) {
        checkNegatedCondition(node)
      }
    })
  }
}
