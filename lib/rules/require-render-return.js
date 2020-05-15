/**
 * @fileoverview Enforces render function to always return value.
 * @author Armano
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce render function to always return value',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/require-render-return.html'
    },
    fixable: null, // or "code" or "whitespace"
    schema: []
  },

  create (context) {
    const renderFunctions = new Map()

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return Object.assign({},
      utils.defineVueVisitor(context,
        {
          ObjectExpression (obj, { node: vueNode }) {
            if (obj !== vueNode) {
              return
            }
            const node = obj.properties.find(item => item.type === 'Property' &&
              utils.getStaticPropertyName(item) === 'render' &&
              (item.value.type === 'ArrowFunctionExpression' || item.value.type === 'FunctionExpression')
            )
            if (!node) return
            renderFunctions.set(node.value, node.key)
          }
        }
      ),
      utils.executeOnFunctionsWithoutReturn(true, node => {
        if (renderFunctions.has(node)) {
          context.report({
            node: renderFunctions.get(node),
            message: 'Expected to return a value in render function.'
          })
        }
      }),
    )
  }
}
