/**
 * @fileoverview Restrict or warn use of v-html to prevent XSS attack
 * @author Nathan Zeplowitz
 */
import utils from '../utils/index.ts'

export default {
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
  create(context: RuleContext) {
    const options = context.options[0]
    const ignoreRegEx = options?.ignorePattern
      ? new RegExp(options.ignorePattern, 'u')
      : undefined

    /**
     * Check if the expression matches the ignore pattern
     */
    function shouldIgnore(
      expression: VExpressionContainer['expression'],
      sourceCode: SourceCode
    ): boolean {
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
      "VAttribute[directive=true][key.name.name='html']"(node: VDirective) {
        const sourceCode = context.sourceCode

        if (
          sourceCode &&
          node.value?.expression &&
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
