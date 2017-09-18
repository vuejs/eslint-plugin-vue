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
 * Creates AST event handlers for v-bind-style.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  const shorthand = context.options[0] !== 'longform'

  return utils.defineTemplateBodyVisitor(context, {
    "VAttribute[directive=true][key.name='bind'][key.argument!=null]" (node) {
      if (node.key.shorthand === shorthand) {
        return
      }

      context.report({
        node,
        loc: node.loc,
        message: shorthand
                    ? "Unexpected 'v-bind' before ':'."
                    : "Expected 'v-bind' before ':'.",
        fix: (fixer) => shorthand
                    ? fixer.removeRange([node.range[0], node.range[0] + 6])
                    : fixer.insertTextBefore(node, 'v-bind')
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
      description: 'enforce `v-bind` directive style',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',
    schema: [
            { enum: ['shorthand', 'longform'] }
    ]
  }
}
