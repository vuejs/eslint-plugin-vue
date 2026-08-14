/**
 * @author Piet Maier
 */

'use strict'

import utils from '../utils/index.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow complex template expressions',
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/simple-expressions-in-templates.html'
    },
    fixable: null,
    schema: [],
    messages: {
      simpleExpressions:
        'Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods.'
    }
  },
  create(context: RuleContext) {
    return utils.defineTemplateBodyVisitor(context, {
      // This pattern matches "mustache" interpolation expressions but not directive expressions.
      'VElement > VExpressionContainer'(node: VExpressionContainer) {
        const { expression } = node

        if (!expression) return

        if (expressionComplexity(context.sourceCode, expression)) {
          context.report({
            node: expression,
            messageId: 'simpleExpressions'
          })
        }
      }
    })
  }
}

/**
 * This function calculates the complexity of an expression and returns `true` if the complexity exceeds the given limit.
 */
function expressionComplexity(
  sourceCode: SourceCode,
  node: ASTNode,
  complexity = 1
) {
  if (complexity < 0) return true

  let number = 0

  function traverse(node: ASTNode) {
    // Early Return: Return `true` if `complexity` has been exceeded.
    if (node.type === 'CallExpression' && ++number > complexity) return true

    // If the node type is unknown, its children are ignored.
    const list =
      (sourceCode.visitorKeys[node.type] as (keyof typeof node)[]) ?? []

    // Recursive Step: Recursively traverse all children of the current node.
    for (const key of list) {
      const value = node[key] as ASTNode | ASTNode[]

      if (Array.isArray(value)) {
        for (const item of value) {
          if (traverse(item)) return true
        }
      } else if (value && traverse(value)) return true
    }

    // Base Case: Return `false` if there are no more children to traverse.
    return false
  }

  return traverse(node)
}
