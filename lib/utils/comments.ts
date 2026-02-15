export const isJSDocComment = (node: Comment): node is BlockComment =>
  node.type === 'Block' &&
  node.value.charAt(0) === '*' &&
  node.value.charAt(1) !== '*'

export const isBlockComment = (node: Comment): node is BlockComment =>
  node.type === 'Block' &&
  (node.value.charAt(0) !== '*' || node.value.charAt(1) === '*')
