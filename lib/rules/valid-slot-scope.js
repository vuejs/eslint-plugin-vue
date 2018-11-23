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
 * Check whether the given token is a comma.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a comma.
 */
function isComma (token) {
  return token != null && token.type === 'Punctuator' && token.value === ','
}

/**
 * Check whether the given token is a quote.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a quote.
 */
function isQuote (token) {
  return token != null && token.type === 'Punctuator' && (token.value === '"' || token.value === "'")
}

/**
 * Gets the extra access parameter tokens of the given slot-scope node.
 * @param {ASTNode} node The slot-scope node to check.
 * @param {TokenStore} tokenStore The TokenStore.
 * @returns {Array} the extra tokens.
 */
function getExtraAccessParameterTokens (node, tokenStore) {
  const valueNode = node.value
  const result = []
  const valueFirstToken = tokenStore.getFirstToken(valueNode)
  const valueLastToken = tokenStore.getLastToken(valueNode)
  const exprLastToken = isQuote(valueFirstToken) && isQuote(valueLastToken) && valueFirstToken.value === valueLastToken.value
    ? tokenStore.getTokenBefore(valueLastToken)
    : valueLastToken
  const idLastToken = tokenStore.getLastToken(valueNode.expression.id)
  if (idLastToken !== exprLastToken) {
    // e.g. `<div slot-scope="a, b">`
    //                         ^^^ Invalid
    result.push(...tokenStore.getTokensBetween(idLastToken, exprLastToken))
    result.push(exprLastToken)
  }

  return result
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
      expectedValue: "'{{attrName}}' attributes require a value.",
      unexpectedRestParameter: 'The top level rest parameter is useless.',
      unexpectedExtraAccessParams: 'Unexpected extra access parameters `{{value}}`.',
      unexpectedTrailingComma: 'Unexpected trailing comma.'
    }
  },

  create (context) {
    const tokenStore =
      context.parserServices.getTemplateBodyTokenStore &&
      context.parserServices.getTemplateBodyTokenStore()
    return utils.defineTemplateBodyVisitor(context, {
      'VAttribute[directive=true][key.name=/^(slot-)?scope$/]' (node) {
        if (!utils.hasAttributeValue(node)) {
          context.report({
            node,
            loc: node.loc,
            messageId: 'expectedValue',
            data: { attrName: node.key.name }
          })
          return
        }

        const idNode = node.value.expression.id
        if (idNode.type === 'RestElement') {
          // e.g. `<div slot-scope="...a">`
          context.report({
            node: idNode,
            loc: idNode.loc,
            messageId: 'unexpectedRestParameter'
          })
        }

        const extraAccessParameterTokens = getExtraAccessParameterTokens(node, tokenStore)
        if (extraAccessParameterTokens.length) {
          const startToken = extraAccessParameterTokens[0]
          if (extraAccessParameterTokens.length === 1 && isComma(startToken)) {
            context.report({
              node: startToken,
              loc: startToken.loc,
              messageId: 'unexpectedTrailingComma'
            })
          } else {
            const endToken = extraAccessParameterTokens[extraAccessParameterTokens.length - 1]
            const value = context.getSourceCode().text.slice(
              extraAccessParameterTokens.length > 1 && isComma(startToken)
                ? extraAccessParameterTokens[1].range[0]
                : startToken.range[0],
              endToken.range[1]
            )
            context.report({
              loc: {
                start: startToken.loc.start,
                end: endToken.loc.end
              },
              messageId: 'unexpectedExtraAccessParams',
              data: { value }
            })
          }
        }
      }
    })
  }
}
