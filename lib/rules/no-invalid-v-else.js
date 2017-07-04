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
 * Creates AST event handlers for no-invalid-v-else.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create (context) {
  utils.registerTemplateBodyVisitor(context, {
    "VAttribute[directive=true][key.name='else']" (node) {
      if (!utils.prevElementHasIf(node.parent.parent)) {
        context.report({
          node,
          loc: node.loc,
          message: "'v-else' directives require being preceded by the element which has a 'v-if' or 'v-else' directive."
        })
      }
      if (utils.hasDirective(node.parent, 'if')) {
        context.report({
          node,
          loc: node.loc,
          message: "'v-else' and 'v-if' directives can't exist on the same element. You may want 'v-else-if' directives."
        })
      }
      if (utils.hasDirective(node.parent, 'else-if')) {
        context.report({
          node,
          loc: node.loc,
          message: "'v-else' and 'v-else-if' directives can't exist on the same element."
        })
      }
      if (node.key.argument) {
        context.report({
          node,
          loc: node.loc,
          message: "'v-else' directives require no argument."
        })
      }
      if (node.key.modifiers.length > 0) {
        context.report({
          node,
          loc: node.loc,
          message: "'v-else' directives require no modifier."
        })
      }
      if (utils.hasAttributeValue(node)) {
        context.report({
          node,
          loc: node.loc,
          message: "'v-else' directives require no attribute value."
        })
      }
    }
  })

  return {}
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create,
  meta: {
    docs: {
      description: 'disallow invalid `v-else` directives.',
      category: 'Possible Errors',
      recommended: true
    },
    fixable: false,
    schema: []
  }
}
