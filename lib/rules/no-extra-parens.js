/**
 * @author Yosuke Ota
 */
'use strict'

const { isParenthesized } = require('eslint-utils')
const { wrapCoreRule } = require('../utils')

// eslint-disable-next-line no-invalid-meta, no-invalid-meta-docs-categories
module.exports = wrapCoreRule(require('eslint/lib/rules/no-extra-parens'), {
  skipDynamicArguments: true,
  create: createForVueSyntax
})

/**
 * @typedef {import('vue-eslint-parser').AST.Token} Token
 * @typedef {import('vue-eslint-parser').AST.ESLintExpression} Expression
 * @typedef {import('vue-eslint-parser').AST.VExpressionContainer} VExpressionContainer
 * @typedef {import('vue-eslint-parser').AST.VFilterSequenceExpression} VFilterSequenceExpression
 */

/**
 * Check whether the given token is a left parenthesis.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left parenthesis.
 */
function isLeftParen(token) {
  return token.type === 'Punctuator' && token.value === '('
}

/**
 * Check whether the given token is a right parenthesis.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right parenthesis.
 */
function isRightParen(token) {
  return token.type === 'Punctuator' && token.value === ')'
}

/**
 * Check whether the given token is a left brace.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left brace.
 */
function isLeftBrace(token) {
  return token.type === 'Punctuator' && token.value === '{'
}

/**
 * Check whether the given token is a right brace.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right brace.
 */
function isRightBrace(token) {
  return token.type === 'Punctuator' && token.value === '}'
}

/**
 * Check whether the given token is a left bracket.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left bracket.
 */
function isLeftBracket(token) {
  return token.type === 'Punctuator' && token.value === '['
}

/**
 * Check whether the given token is a right bracket.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a right bracket.
 */
function isRightBracket(token) {
  return token.type === 'Punctuator' && token.value === ']'
}

/**
 * Determines if a given expression node is an IIFE
 * @param {ASTNode} node The node to check
 * @returns {boolean} `true` if the given node is an IIFE
 */
function isIIFE(node) {
  return (
    node.type === 'CallExpression' && node.callee.type === 'FunctionExpression'
  )
}

function createForVueSyntax(context) {
  const tokenStore =
    context.parserServices.getTemplateBodyTokenStore &&
    context.parserServices.getTemplateBodyTokenStore()

  /**
   * Checks if the given node turns into a filter when unwraped.
   * @param {Expression} node node to evaluate
   * @returns {boolean} `true` if the given node turns into a filter when unwraped.
   */
  function isUnwrapChangeToFilter(expression) {
    let parenStack = null
    for (const token of tokenStore.getTokens(expression)) {
      if (!parenStack) {
        if (token.value === '|') {
          return true
        }
      } else {
        if (parenStack.isUpToken(token)) {
          parenStack = parenStack.upper
          continue
        }
      }
      if (isLeftParen(token)) {
        parenStack = { isUpToken: isRightParen, upper: parenStack }
      } else if (isLeftBracket(token)) {
        parenStack = { isUpToken: isRightBracket, upper: parenStack }
      } else if (isLeftBrace(token)) {
        parenStack = { isUpToken: isRightBrace, upper: parenStack }
      }
    }
    return false
  }
  /**
   * @param {VExpressionContainer} node
   */
  function verify(node) {
    let expression = node.expression
    if (!expression) {
      return
    }

    if (expression.type === 'VFilterSequenceExpression') {
      expression = expression.expression
    }

    if (!isParenthesized(expression, tokenStore)) {
      return
    }

    if (!isParenthesized(2, expression, tokenStore)) {
      if (
        isIIFE(expression) &&
        !isParenthesized(expression.callee, tokenStore)
      ) {
        return
      }
      if (isUnwrapChangeToFilter(expression)) {
        return
      }
    }
    report(expression)
  }

  /**
   * Report the node
   * @param {Expression} node node to evaluate
   * @returns {void}
   * @private
   */
  function report(node) {
    const sourceCode = context.getSourceCode()
    const leftParenToken = tokenStore.getTokenBefore(node)
    const rightParenToken = tokenStore.getTokenAfter(node)

    context.report({
      node,
      loc: leftParenToken.loc,
      messageId: 'unexpected',
      fix(fixer) {
        const parenthesizedSource = sourceCode.text.slice(
          leftParenToken.range[1],
          rightParenToken.range[0]
        )

        return fixer.replaceTextRange(
          [leftParenToken.range[0], rightParenToken.range[1]],
          parenthesizedSource
        )
      }
    })
  }

  return {
    "VAttribute[directive=true][key.name.name='bind'] > VExpressionContainer": verify,
    'VElement > VExpressionContainer': verify
  }
}
