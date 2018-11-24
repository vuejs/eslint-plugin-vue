/**
 * @fileoverview enforce valid `slot-scope` attributes
 * @author Yosuke Ota
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
 * Check whether the given token is a quote.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a quote.
 */
function isQuote (token) {
  return token != null && token.type === 'Punctuator' && (token.value === '"' || token.value === "'")
}

/**
 * Check whether the value of the given slot-scope node is a syntax error.
 * @param {ASTNode} node The slot-scope node to check.
 * @param {TokenStore} tokenStore The TokenStore.
 * @returns {boolean} `true` if the value is a syntax error
 */
function isSyntaxError (node, tokenStore) {
  if (node.value == null) {
    // does not have value.
    return false
  }
  if (node.value.expression != null) {
    return false
  }
  const tokens = tokenStore.getTokens(node.value)
  if (!tokens.length) {
    // empty value
    return false
  }
  if (tokens.length === 2 && tokens.every(isQuote)) {
    // empty value e.g `""` / `''`
    return false
  }
  return true
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'enforce valid `slot-scope` attributes',
      category: undefined,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.5/docs/rules/valid-slot-scope.md'
    },
    fixable: null,
    schema: [],
    messages: {
      expectedValue: "'{{attrName}}' attributes require a value."
    }
  },

  create (context) {
    const tokenStore =
      context.parserServices.getTemplateBodyTokenStore &&
      context.parserServices.getTemplateBodyTokenStore()
    return utils.defineTemplateBodyVisitor(context, {
      'VAttribute[directive=true][key.name=/^(slot-)?scope$/]' (node) {
        if (!utils.hasAttributeValue(node)) {
          if (isSyntaxError(node, tokenStore)) {
            // syntax error
            return
          }
          context.report({
            node,
            loc: node.loc,
            messageId: 'expectedValue',
            data: { attrName: node.key.name }
          })
        }
      }
    })
  }
}
