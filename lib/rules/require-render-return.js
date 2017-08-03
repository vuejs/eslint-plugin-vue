/**
 * @fileoverview Enforces render function to always return value.
 * @author Armano
 */
'use strict'

const utils = require('../utils')

function create (context) {
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
        (item.value.type === 'ArrowFunctionExpression' || item.value.type === 'FunctionExpression') &&
        !item.value.expression // render: () => test
      )
      if (!node) return

      forbiddenNodes.forEach(el => {
        if (
          el.loc.start.line >= node.value.loc.start.line &&
          el.loc.end.line <= node.value.loc.end.line
        ) {
          context.report({
            node: node.key,
            message: 'Expected to return a value in render function.'
          })
        }
      })
    })
  )
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Enforces render function to always return value.',
      category: 'Possible Errors',
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: []
  },

  create
}
