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
 * Creates AST event handlers for v-on-style.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create (context) {
  const shorthand = context.options[0] !== 'longform'

  utils.registerTemplateBodyVisitor(context, {
    "VAttribute[directive=true][key.name='on'][key.argument!=null]" (node) {
      if (node.key.shorthand === shorthand) {
        return
      }

      const pos = node.range[0]
      context.report({
        node,
        loc: node.loc,
        message: shorthand
                    ? "Expected '@' instead of 'v-on:'."
                    : "Expected 'v-on:' instead of '@'.",
        fix: (fixer) => shorthand
                    ? fixer.replaceTextRange([pos, pos + 5], '@')
                    : fixer.replaceTextRange([pos, pos + 1], 'v-on:')
      })
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
      description: 'enforce `v-on` directive style.',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',
    schema: [
            { enum: ['shorthand', 'longform'] }
    ]
  }
}
