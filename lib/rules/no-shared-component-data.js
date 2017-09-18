/**
 * @fileoverview Enforces component's data property to be a function.
 * @author Armano
 */
'use strict'

const utils = require('../utils')

function create (context) {
  // ----------------------------------------------------------------------
  // Public
  // ----------------------------------------------------------------------

  return utils.executeOnVueComponent(context, (obj) => {
    obj.properties
      .filter(p =>
        p.type === 'Property' &&
        p.key.type === 'Identifier' &&
        p.key.name === 'data' &&
        p.value.type !== 'FunctionExpression' &&
        p.value.type !== 'ArrowFunctionExpression' &&
        p.value.type !== 'Identifier'
      )
      .forEach(cp => {
        context.report({
          node: cp.value,
          message: '`data` property in component must be a function'
        })
      })
  })
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "enforce component's data property to be a function",
      category: 'Possible Errors',
      recommended: false
    },
    fixable: null,  // or "code" or "whitespace"
    schema: []
  },

  create
}
