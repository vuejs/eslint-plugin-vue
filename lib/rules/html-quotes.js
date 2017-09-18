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
 * Creates AST event handlers for html-quotes.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  const sourceCode = context.getSourceCode()
  const double = context.options[0] !== 'single'
  const quoteChar = double ? '"' : "'"
  const quoteName = double ? 'double quotes' : 'single quotes'

  return utils.defineTemplateBodyVisitor(context, {
    'VAttribute[value!=null]' (node) {
      const text = sourceCode.getText(node.value)
      const firstChar = text[0]
      if (firstChar !== quoteChar) {
        context.report({
          node: node.value,
          loc: node.value.loc,
          message: 'Expected to be enclosed by {{kind}}.',
          data: { kind: quoteName }
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
      description: 'enforce quotes style of HTML attributes',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: false,
    schema: [
            { enum: ['double', 'single'] }
    ]
  }
}
