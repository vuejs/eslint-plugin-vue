/**
 * @fileoverview disallow usage of mustache interpolations.
 * @author james2doyle
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow usage of mustache interpolations',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-mustache.html'
    },
    fixable: null,
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    const template =
      context.parserServices.getTemplateBodyTokenStore &&
      context.parserServices.getTemplateBodyTokenStore()

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VLiteral} node */
      VLiteral(node) {
        const openBrace = template.getFirstToken(node)
        const closeBrace = template.getLastToken(node)
        const invalidBrace =
          !openBrace ||
          !closeBrace ||
          openBrace.type !== 'HTMLLiteral' ||
          closeBrace.type !== 'HTMLLiteral'

        if (invalidBrace) {
          return
        }

        context.report({
          loc: {
            start: node.loc.start,
            end: node.loc.end
          },
          message:
            'Expected attribute be a binding but found mustache template.'
        })
      },
      /** @param {VExpressionContainer} node */
      VExpressionContainer(node) {
        const openBrace = template.getFirstToken(node)
        const closeBrace = template.getLastToken(node)

        const invalidBrace =
          !openBrace ||
          !closeBrace ||
          openBrace.type !== 'VExpressionStart' ||
          closeBrace.type !== 'VExpressionEnd'

        if (invalidBrace) {
          return
        }

        context.report({
          loc: {
            start: node.loc.start,
            end: node.loc.end
          },
          message:
            "Expected text content to be in 'v-text' or 'v-html' but found mustache template."
        })
      }
    })
  }
}
