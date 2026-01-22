/**
 * @author rzzf
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils/index.ts')

/**
 * @type {Record<string, 'object' | 'array' | 'function' | 'arrow function' | undefined>}
 */
const EXPRESSION_TYPES = {
  ObjectExpression: 'object',
  ArrayExpression: 'array',
  FunctionExpression: 'function',
  ArrowFunctionExpression: 'arrow function'
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow object, array, and function literals in template',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-literals-in-template.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Unexpected {{type}} literal in template.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {Set<VElement>} */
    const upperElements = new Set()

    /**
     * Checks whether the given node refers to a variable of the element.
     * @param {Expression | VForExpression | VOnExpression | VSlotScopeExpression | VFilterSequenceExpression} node
     */
    function hasReferenceUpperElementVariable(node) {
      for (const element of upperElements) {
        for (const variable of element.variables) {
          for (const reference of variable.references) {
            const { range } = reference.id
            if (node.range[0] <= range[0] && range[1] <= node.range[1]) {
              return true
            }
          }
        }
      }
      return false
    }

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VElement} node */
      VElement(node) {
        upperElements.add(node)
      },
      /** @param {VElement} node */
      'VElement:exit'(node) {
        upperElements.delete(node)
      },
      /**
       * @param {VDirective} node
       */
      "VAttribute[directive=true][key.name.name='bind']"(node) {
        const expression = node.value?.expression
        if (
          !expression ||
          (node.key.argument &&
            node.key.argument.type === 'VIdentifier' &&
            (node.key.argument.name === 'class' ||
              node.key.argument.name === 'style'))
        ) {
          return
        }

        const type = EXPRESSION_TYPES[expression.type]
        if (type && !hasReferenceUpperElementVariable(expression)) {
          context.report({
            node: expression,
            messageId: 'unexpected',
            data: { type }
          })
        }
      }
    })
  }
}
