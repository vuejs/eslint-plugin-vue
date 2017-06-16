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
 * Creates AST event handlers for require-v-for-key.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create (context) {
  utils.registerTemplateBodyVisitor(context, {
    "VAttribute[directive=true][key.name='for']" (node) {
      if (!utils.hasDirective(node.parent, 'bind', 'key') && !utils.isCustomComponent(node.parent)) {
        context.report({
          node: node.parent,
          loc: node.parent.loc,
          message: "'v-for' directives require 'v-bind:key' directives."
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
      description: 'require `v-bind:key` with `v-for` directives.',
      category: 'Best Practices',
      recommended: true
    },
    fixable: false,
    schema: []
  }
}
