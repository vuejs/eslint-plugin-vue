/**
 * Check whether the given token is a wildcard.
 */
export function isWildcard(
  token: Token | undefined | null
): token is Token & { value: '*' } {
  return token != null && token.type === 'Punctuator' && token.value === '*'
}

/**
 * Check whether the given token is a question.
 */
export function isQuestion(
  token: Token | undefined | null
): token is Token & { value: '?' } {
  return token != null && token.type === 'Punctuator' && token.value === '?'
}

/**
 * Check whether the given token is an extends keyword.
 */
export function isExtendsKeyword(
  token: Token | undefined | null
): token is Token & { value: 'extends' } {
  return token != null && token.type === 'Keyword' && token.value === 'extends'
}

/**
 * Check whether the given token is a whitespace.
 */
export function isNotWhitespace(
  token: Token | undefined | null
): token is Token {
  return (
    token != null &&
    token.type !== 'HTMLWhitespace' &&
    (token.type !== 'JSXText' || !!token.value.trim())
  )
}

/**
 * Check whether the given token is a comment.
 */
export function isComment(token: Token | undefined | null): boolean {
  return (
    token != null &&
    (token.type === 'Block' ||
      token.type === 'Line' ||
      token.type === 'Shebang' ||
      (typeof token.type ===
        'string' /* Although acorn supports new tokens, espree may not yet support new tokens.*/ &&
        token.type.endsWith('Comment')))
  )
}

/**
 * Check whether the given token is a comment.
 */
export function isNotComment(
  token: Token | undefined | null
): token is Exclude<Token, Comment> {
  return (
    token != null &&
    token.type !== 'Block' &&
    token.type !== 'Line' &&
    token.type !== 'Shebang' &&
    !(
      typeof token.type ===
        'string' /* Although acorn supports new tokens, espree may not yet support new tokens.*/ &&
      token.type.endsWith('Comment')
    )
  )
}

/**
 * Check whether the given node is not an empty text node.
 */
export function isNotEmptyTextNode(node: ASTNode): node is VText {
  return !(node.type === 'VText' && node.value.trim() === '')
}

/**
 * Check whether the given token is a pipe operator.
 */
export function isPipeOperator(
  token: Token | undefined | null
): token is Token & { value: '|' } {
  return token != null && token.type === 'Punctuator' && token.value === '|'
}

/**
 * Get the last element.
 */
export function last<T>(xs: T[]): T | undefined {
  return xs.length === 0 ? undefined : xs.at(-1)
}
