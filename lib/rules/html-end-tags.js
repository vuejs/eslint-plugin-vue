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
 * Creates AST event handlers for html-end-tags.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  let hasInvalidEOF = false

  return utils.defineTemplateBodyVisitor(context, {
    VElement (node) {
      if (hasInvalidEOF) {
        return
      }

      const name = node.name
      const isVoid = utils.isHtmlVoidElementName(name)
      const isSelfClosing = node.startTag.selfClosing
      const hasEndTag = node.endTag != null

      if (!isVoid && !hasEndTag && !isSelfClosing) {
        context.report({
          node: node.startTag,
          loc: node.startTag.loc,
          message: "'<{{name}}>' should have end tag.",
          data: { name },
          fix: (fixer) => fixer.insertTextAfter(node, `</${name}>`)
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
      description: 'enforce end tag style',
      category: 'strongly-recommended'
    },
    fixable: 'code',
    schema: []
  }
}
