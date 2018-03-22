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
    docs: {
      description: 'enforce render function to always return value',
      category: 'essential',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.4.0/docs/rules/require-render-return.md'
    },
    fixable: null, // or "code" or "whitespace"
    schema: []
  },

  create (context) {
    const forbiddenNodes = []

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return Object.assign({},
      utils.executeOnFunctionsWithoutReturn(true, node => {
        forbiddenNodes.push(node)
      }),
      utils.executeOnVue(context, obj => {
        const node = obj.properties.find(item => item.type === 'Property' &&
          utils.getStaticPropertyName(item) === 'render' &&
          (item.value.type === 'ArrowFunctionExpression' || item.value.type === 'FunctionExpression')
        )
        if (!node) return

        forbiddenNodes.forEach(el => {
          if (node.value === el) {
            context.report({
              node: node.key,
              message: 'Expected to return a value in render function.'
            })
          }
        })
      })
    )
  }
}
