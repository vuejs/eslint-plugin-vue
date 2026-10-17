module.exports = {
  getScope
}

/**
 * Gets the scope for the current node
 * @param {RuleContext} context The rule context
 * @param {ESNode} currentNode The node to get the scope of
 * @returns { import('eslint').Scope.Scope } The scope information for this node
 */
function getScope(context, currentNode) {
  // On Program node, get the outermost scope to avoid return Node.js special function scope or ES modules scope.
  const isInner = currentNode.type !== 'Program'
  const scopeManager = context.sourceCode.scopeManager

  /** @type {ESNode | null} */
  let node = currentNode
  for (; node; node = /** @type {ESNode | null} */ (node.parent)) {
    const scope = scopeManager.acquire(node, isInner)

    if (scope) {
      return scope.type === 'function-expression-name'
        ? scope.childScopes[0]
        : scope
    }
  }

  return scopeManager.scopes[0]
}
