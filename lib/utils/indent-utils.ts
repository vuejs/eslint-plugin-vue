/**
 * Check whether the given token is a wildcard.
 * @param token The token to check.
 * @returns `true` if the token is a wildcard.
 */
export function isWildcard(token: Token | undefined | null): boolean {
  return token != null && token.type === 'Punctuator' && token.value === '*'
}

/**
 * Check whether the given token is a question.
 * @param token The token to check.
 * @returns `true` if the token is a question.
 */
export function isQuestion(token: Token | undefined | null): boolean {
  return token != null && token.type === 'Punctuator' && token.value === '?'
}

/**
 * Check whether the given token is an extends keyword.
 * @param token The token to check.
 * @returns `true` if the token is an extends keywordn.
 */
export function isExtendsKeyword(token: Token | undefined | null): boolean {
  return token != null && token.type === 'Keyword' && token.value === 'extends'
}

/**
 * Check whether the given token is a whitespace.
 * @param token The token to check.
 * @returns `true` if the token is a whitespace.
 */
export function isNotWhitespace(token: Token | undefined | null): boolean {
  return (
    token != null &&
    token.type !== 'HTMLWhitespace' &&
    (token.type !== 'JSXText' || !!token.value.trim())
  )
}

/**
 * Check whether the given token is a comment.
 * @param token The token to check.
 * @returns `true` if the token is a comment.
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
 * @param token The token to check.
 * @returns `false` if the token is a comment.
 */
export function isNotComment(token: Token | undefined | null): boolean {
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
 * @param node The node to check.
 * @returns `false` if the token is empty text node.
 */
export function isNotEmptyTextNode(node: ASTNode): boolean {
  return !(node.type === 'VText' && node.value.trim() === '')
}

/**
 * Check whether the given token is a pipe operator.
 * @param token The token to check.
 * @returns `true` if the token is a pipe operator.
 */
export function isPipeOperator(token: Token | undefined | null): boolean {
  return token != null && token.type === 'Punctuator' && token.value === '|'
}

/**
 * @deprecated TODO: use Node.js Native api
 *
 * Get the last element.
 * @param xs The array to get the last element.
 * @returns The last element or undefined.
 */
export function last<T>(xs: T[]): T | undefined {
  return xs.length === 0 ? undefined : xs[xs.length - 1]
}
