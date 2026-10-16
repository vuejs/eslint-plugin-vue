/**
 * @author Yosuke Ota
 */
import { isParenthesized } from '@eslint-community/eslint-utils'
import utils from '../utils/index.js'
import { getStyleVariablesContext } from '../utils/style-variables/index.ts'

// eslint-disable-next-line internal/no-invalid-meta
export default utils.wrapStylisticOrCoreRule('no-extra-parens', {
  skipDynamicArguments: true,
  applyDocument: true,
  create: createForVueSyntax
})

/**
 * Check whether the given token is a left parenthesis.
 */
function isLeftParen(token: Token): boolean {
  return token.type === 'Punctuator' && token.value === '('
}

/**
 * Check whether the given token is a right parenthesis.
 */
function isRightParen(token: Token): boolean {
  return token.type === 'Punctuator' && token.value === ')'
}

/**
 * Check whether the given token is a left brace.
 */
function isLeftBrace(token: Token): boolean {
  return token.type === 'Punctuator' && token.value === '{'
}

/**
 * Check whether the given token is a right brace.
 */
function isRightBrace(token: Token): boolean {
  return token.type === 'Punctuator' && token.value === '}'
}

/**
 * Check whether the given token is a left bracket.
 */
function isLeftBracket(token: Token): boolean {
  return token.type === 'Punctuator' && token.value === '['
}

/**
 * Check whether the given token is a right bracket.
 */
function isRightBracket(token: Token): boolean {
  return token.type === 'Punctuator' && token.value === ']'
}

/**
 * Determines if a given expression node is an IIFE
 */
function isIIFE(
  node: Expression
): node is CallExpression & { callee: FunctionExpression } {
  return (
    node.type === 'CallExpression' && node.callee.type === 'FunctionExpression'
  )
}

function createForVueSyntax(context: RuleContext): TemplateListener {
  const sourceCode = context.sourceCode
  if (!sourceCode.parserServices.getTemplateBodyTokenStore) {
    return {}
  }
  const tokenStore = sourceCode.parserServices.getTemplateBodyTokenStore()

  /**
   * Checks if the given node turns into a filter when unwraped.
   */
  function isUnwrapChangeToFilter(expression: Expression): boolean {
    let parenStack = null
    for (const token of tokenStore.getTokens(expression)) {
      if (parenStack) {
        if (parenStack.isUpToken(token)) {
          parenStack = parenStack.upper
          continue
        }
      } else {
        if (token.value === '|') {
          return true
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
   * Checks if the given node is CSS v-bind() without quote.
   */
  function isStyleVariableWithoutQuote(
    node: VExpressionContainer,
    expression: Expression
  ) {
    const styleVars = getStyleVariablesContext(context)
    if (!styleVars || !styleVars.vBinds.includes(node)) {
      return false
    }

    const vBindToken = tokenStore.getFirstToken(node)
    const tokens = tokenStore.getTokensBetween(vBindToken, expression)

    return tokens.every(isLeftParen)
  }

  function verify(
    node: VExpressionContainer & {
      expression: Expression | VFilterSequenceExpression | null
    }
  ) {
    if (!node.expression) {
      return
    }

    const expression =
      node.expression.type === 'VFilterSequenceExpression'
        ? node.expression.expression
        : node.expression

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
      if (isStyleVariableWithoutQuote(node, expression)) {
        return
      }
    }
    report(expression)
  }

  /**
   * Report the node
   */
  function report(node: Expression) {
    const sourceCode = context.sourceCode
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
    "VAttribute[directive=true][key.name.name='bind'] > VExpressionContainer":
      verify,
    'VElement > VExpressionContainer': verify
  }
}
