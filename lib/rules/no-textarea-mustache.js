/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Creates AST event handlers for no-textarea-mustache.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  return utils.defineTemplateBodyVisitor(context, {
    "VElement[name='textarea'] VExpressionContainer" (node) {
      if (node.parent.type !== 'VElement') {
        return
      }

      context.report({
        node,
        loc: node.loc,
        message: "Unexpected mustache. Use 'v-model' instead."
      })
    }
  })
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create,
  meta: {
    docs: {
      description: 'disallow mustaches in `<textarea>`',
      category: 'Best Practices',
      recommended: true
    },
    fixable: false,
    schema: []
  }
}
