/**
 * @author Wayne
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * @param {*} expression
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
 * @param {VElement} node The element node to get the next sibling element
 * @returns {VElement|null} The next sibling element
 */
function getNextSibling(node) {
  if (!node.parent || !node.parent.children) {
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
  return !!(nextElement && utils.hasDirective(nextElement, 'else'))
}

/**
 * @param {VDirective} node The directive node
 * @param {RuleContext} context The rule context
 */
function checkNegatedCondition(node, context) {
  if (!node.value || !node.value.expression) {
    return
  }

  const expression = node.value.expression
  const element = node.parent.parent

  if (isNegatedExpression(expression) && isDirectlyFollowedByElse(element)) {
    context.report({
      node: expression,
      messageId: 'negatedCondition'
    })
  }
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow negated conditions in v-if/v-else',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-negated-condition.html'
    },
    fixable: null,
    schema: [],
    messages: {
      negatedCondition: 'Unexpected negated condition in v-if with v-else.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VDirective} node */
      "VAttribute[directive=true][key.name.name='if']"(node) {
        checkNegatedCondition(node, context)
      },
      /** @param {VDirective} node */
      "VAttribute[directive=true][key.name.name='else-if']"(node) {
        checkNegatedCondition(node, context)
      }
    })
  }
}
