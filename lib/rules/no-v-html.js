/**
 * @fileoverview Restrict or warn use of v-html to prevent XSS attack
 * @author Nathan Zeplowitz
 */
'use strict'
const utils = require('../utils')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use of v-html to prevent XSS attack',
      categories: ['vue3-recommended', 'vue2-recommended'],
      url: 'https://eslint.vuejs.org/rules/no-v-html.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignorePattern: {
            type: 'string'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpected: "'v-html' directive can lead to XSS attack."
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const options = context.options[0]
    const ignoreRegEx = options?.ignorePattern
      ? new RegExp(options.ignorePattern, 'u')
      : undefined

    /**
     * Check if the expression matches the ignore pattern
     * @param {VExpressionContainer['expression']} expression
     * @param {SourceCode} sourceCode
     * @returns {boolean}
     */
    function shouldIgnore(expression, sourceCode) {
      if (!ignoreRegEx || !expression) {
        return false
      }

      // For simple identifiers, use the name property directly (optimized)
      if (expression.type === 'Identifier') {
        return ignoreRegEx.test(expression.name)
      }

      // For other expression types (e.g., CallExpression), get the full text
      const expressionText = sourceCode.getText(expression)
      return ignoreRegEx.test(expressionText)
    }

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VDirective} node */
      "VAttribute[directive=true][key.name.name='html']"(node) {
        const sourceCode = context.sourceCode

        if (
          node.value &&
          node.value.expression &&
          sourceCode &&
          shouldIgnore(node.value.expression, sourceCode)
        ) {
          return
        }
        context.report({
          node,
          loc: node.loc,
          messageId: 'unexpected'
        })
      }
    })
  }
}
