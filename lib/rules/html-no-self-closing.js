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
 * Creates AST event handlers for html-no-self-closing.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  return utils.defineTemplateBodyVisitor(context, {
    'VElement' (node) {
      if (utils.isSvgElementNode(node)) {
        return
      }

      const sourceCode = context.parserServices.getTemplateBodyTokenStore(context)
      const lastToken = sourceCode.getLastToken(node.startTag)
      if (lastToken.type !== 'HTMLSelfClosingTagClose') {
        return
      }

      context.report({
        node: lastToken,
        loc: lastToken.loc,
        message: 'Self-closing should not be used.',
        fix: (fixer) => fixer.removeRange([lastToken.range[0], lastToken.range[0] + 1])
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
      description: 'disallow self-closing elements',
      category: 'Best Practices',
      recommended: false,
      replacedBy: ['html-self-closing']
    },
    deprecated: true,
    fixable: 'code',
    schema: []
  }
}
