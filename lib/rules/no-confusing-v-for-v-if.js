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
 * Check whether the given `v-if` node is using the variable which is defined by the `v-for` directive.
 * @param {ASTNode} vIf The `v-if` attribute node to check.
 * @returns {boolean} `true` if the `v-if` is using the variable which is defined by the `v-for` directive.
 */
function isUsingIterationVar (vIf) {
  const element = vIf.parent.parent
  return vIf.value.references.some(reference =>
        element.variables.some(variable =>
            variable.id.name === reference.id.name &&
            variable.kind === 'v-for'
        )
    )
}

/**
 * Creates AST event handlers for no-confusing-v-for-v-if.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  return utils.defineTemplateBodyVisitor(context, {
    "VAttribute[directive=true][key.name='if']" (node) {
      const element = node.parent.parent

      if (utils.hasDirective(element, 'for') && !isUsingIterationVar(node)) {
        context.report({
          node,
          loc: node.loc,
          message: "This 'v-if' should be moved to the wrapper element."
        })
      }
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
      description: 'disallow confusing `v-for` and `v-if` on the same element',
      category: 'Best Practices',
      recommended: true
    },
    fixable: false,
    schema: []
  }
}
