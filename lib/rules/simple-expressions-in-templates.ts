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
        if (node.expression?.type === 'CallExpression') {
          context.report({
            node,
            messageId: 'simpleExpressions'
          })
        }
      }
    })
  }
}
