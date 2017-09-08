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
 * Creates AST event handlers for no-invalid-v-if.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  return utils.defineTemplateBodyVisitor(context, {
    "VAttribute[directive=true][key.name='if']" (node) {
      const element = node.parent.parent

      if (utils.hasDirective(element, 'else')) {
        context.report({
          node,
          loc: node.loc,
          message: "'v-if' and 'v-else' directives can't exist on the same element. You may want 'v-else-if' directives."
        })
      }
      if (utils.hasDirective(element, 'else-if')) {
        context.report({
          node,
          loc: node.loc,
          message: "'v-if' and 'v-else-if' directives can't exist on the same element."
        })
      }
      if (node.key.argument) {
        context.report({
          node,
          loc: node.loc,
          message: "'v-if' directives require no argument."
        })
      }
      if (node.key.modifiers.length > 0) {
        context.report({
          node,
          loc: node.loc,
          message: "'v-if' directives require no modifier."
        })
      }
      if (!utils.hasAttributeValue(node)) {
        context.report({
          node,
          loc: node.loc,
          message: "'v-if' directives require that attribute value."
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
      description: 'disallow invalid `v-if` directives',
      category: 'Possible Errors',
      recommended: false,
      replacedBy: ['valid-v-if']
    },
    deprecated: true,
    fixable: false,
    schema: []
  }
}
