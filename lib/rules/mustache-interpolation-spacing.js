/**
 * @fileoverview enforce unified spacing in mustache interpolations.
 * @author Armano
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
    docs: {
      description: 'enforce unified spacing in mustache interpolations',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'whitespace',
    schema: [
      {
        enum: ['always', 'never']
      }
    ]
  },

  create (context) {
    const options = context.options[0]
    const optSpaces = options !== 'never'
    const template = context.parserServices.getTemplateBodyTokenStore && context.parserServices.getTemplateBodyTokenStore()

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    function checkTokens (leftToken, rightToken) {
      if (leftToken.loc.end.line === rightToken.loc.start.line) {
        const spaces = rightToken.loc.start.column - leftToken.loc.end.column
        const noSpacesFound = spaces === 0

        if (optSpaces === noSpacesFound) {
          context.report({
            node: rightToken,
            loc: {
              start: leftToken.loc.end,
              end: rightToken.loc.start
            },
            message: 'Found {{spaces}} whitespaces, {{type}} expected.',
            data: {
              spaces: spaces === 0 ? 'none' : spaces,
              type: optSpaces ? '1' : 'none'
            },
            fix: (fixer) => fixer.replaceTextRange([leftToken.range[1], rightToken.range[0]], optSpaces ? ' ' : '')
          })
        }
      }
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.defineTemplateBodyVisitor(context, {
      'VExpressionContainer[expression!=null]' (node) {
        const tokens = template.getTokens(node, {
          includeComments: true,
          filter: token => token.type !== 'HTMLWhitespace' // When there is only whitespace between ignore it
        })

        const startToken = tokens.shift()
        if (!startToken || startToken.type !== 'VExpressionStart') return
        const endToken = tokens.pop()
        if (!endToken || endToken.type !== 'VExpressionEnd') return

        if (tokens.length > 0) {
          checkTokens(startToken, tokens[0])
          checkTokens(tokens[tokens.length - 1], endToken)
        } else {
          checkTokens(startToken, endToken)
        }
      }
    })
  }
}
