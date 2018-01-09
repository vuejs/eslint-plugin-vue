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
  const quotePattern = double ? /"/g : /'/g
  const quoteEscaped = double ? '&quot;' : '&apos;'
  let hasInvalidEOF

  return utils.defineTemplateBodyVisitor(context, {
    'VAttribute[value!=null]' (node) {
      if (hasInvalidEOF) {
        return
      }

      const text = sourceCode.getText(node.value)
      const firstChar = text[0]

      if (firstChar !== quoteChar) {
        context.report({
          node: node.value,
          loc: node.value.loc,
          message: 'Expected to be enclosed by {{kind}}.',
          data: { kind: quoteName },
          fix (fixer) {
            const contentText = (firstChar === "'" || firstChar === '"') ? text.slice(1, -1) : text
            const replacement = quoteChar + contentText.replace(quotePattern, quoteEscaped) + quoteChar

            return fixer.replaceText(node.value, replacement)
          }
        })
      }
    }
  }, {
    Program (node) {
      hasInvalidEOF = utils.hasInvalidEOF(node)
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
      category: 'recommended',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/master/docs/rules/html-quotes.md'
    },
    fixable: 'code',
    schema: [
      { enum: ['double', 'single'] }
    ]
  }
}
