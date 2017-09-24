/**
 * @fileoverview warn variable definitions of v-for directives or scope attributes if those are not used.
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */
'use strict'

const utils = require('../utils')

/**
 * Creates AST event handlers for require-v-for-key.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  return utils.defineTemplateBodyVisitor(context, {
    VElement (node) {
      for (const variable of node.variables) {
        if (variable.references.length === 0) {
          context.report({
            node: variable.id,
            loc: variable.id.loc,
            message: `'{{name}}' is defined but never used.`,
            data: variable.id
          })
        }
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
      description: 'warn variable definitions of v-for directives or scope attributes if those are not used',
      category: 'Possible Errors',
      recommended: false
    },
    fixable: null,
    schema: []
  }
}
