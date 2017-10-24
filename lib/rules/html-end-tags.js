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
  return utils.defineTemplateBodyVisitor(context, {
    VElement (node) {
      const name = node.name
      const isVoid = utils.isHtmlVoidElementName(name)
      const hasEndTag = node.endTag != null
      const isSelfClosing = node.startTag.selfClosing

      if (isVoid && hasEndTag) {
        context.report({
          node: node.endTag,
          loc: node.endTag.loc,
          message: "'<{{name}}>' should not have end tag.",
          data: { name },
          fix: (fixer) => fixer.remove(node.endTag)
        })
      }
      if (!isVoid && !(hasEndTag || isSelfClosing)) {
        context.report({
          node: node.startTag,
          loc: node.startTag.loc,
          message: "'<{{name}}>' should have end tag.",
          data: { name },
          fix: (fixer) => fixer.insertTextAfter(node, `</${name}>`)
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
      description: 'enforce end tag style',
      category: 'Best Practices',
      recommended: false
    },
    fixable: 'code',
    schema: []
  }
}
