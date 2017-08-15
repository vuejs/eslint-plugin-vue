/**
 * @fileoverview Disallow usage of `this` in template.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Disallow usage of `this` in template.',
      category: 'Best Practices',
      recommended: false
    },
    fixable: null,
    schema: []
  },

  /**
   * Creates AST event handlers for no-this-in-template.
   *
   * @param {RuleContext} context - The rule context.
   * @returns {Object} AST event handlers.
   */
  create (context) {
    utils.registerTemplateBodyVisitor(context, {
      'VExpressionContainer ThisExpression' (node) {
        context.report({
          node,
          loc: node.loc,
          message: "Unexpected usage of 'this'."
        })
      }
    })

    return {}
  }
}
