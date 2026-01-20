export const isJSDocComment = (node: Comment): boolean =>
  node.type === 'Block' &&
  node.value.charAt(0) === '*' &&
  node.value.charAt(1) !== '*'

export const isBlockComment = (node: Comment): boolean =>
  node.type === 'Block' &&
  (node.value.charAt(0) !== '*' || node.value.charAt(1) === '*')
