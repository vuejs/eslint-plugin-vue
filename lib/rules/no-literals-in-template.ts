/**
 * @author rzzf
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import { toRegExpGroupMatcher } from '../utils/regexp.ts'

const EXPRESSION_TYPES = {
  ObjectExpression: 'object',
  ArrayExpression: 'array',
  FunctionExpression: 'function',
  ArrowFunctionExpression: 'arrow function'
} as const

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow object, array, and function literals in template',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-literals-in-template.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignores: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpected: 'Unexpected {{type}} literal in template.'
    }
  },
  create(context: RuleContext) {
    const options = context.options[0] || {}
    const isIgnored = toRegExpGroupMatcher(options.ignores)

    const upperElements = new Set<VElement>()

    /**
     * Checks whether the given node refers to a variable of the element.
     */
    function hasReferenceUpperElementVariable(
      node:
        | Expression
        | VForExpression
        | VOnExpression
        | VSlotScopeExpression
        | VFilterSequenceExpression
    ) {
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
      VElement(node: VElement) {
        upperElements.add(node)
      },
      'VElement:exit'(node: VElement) {
        upperElements.delete(node)
      },
      "VAttribute[directive=true][key.name.name='bind']"(node: VDirective) {
        const expression = node.value?.expression
        const argumentName =
          node.key.argument?.type === 'VIdentifier'
            ? node.key.argument.name
            : null
        if (
          !expression ||
          argumentName === 'class' ||
          argumentName === 'style' ||
          (argumentName != null && isIgnored(argumentName))
        ) {
          return
        }

        const type =
          EXPRESSION_TYPES[expression.type as keyof typeof EXPRESSION_TYPES]
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
