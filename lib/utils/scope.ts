import type { Scope } from 'eslint'

/**
 * Gets the scope for the current node
 */
export function getScope(
  context: RuleContext,
  currentNode: ESNode
): Scope.Scope {
  // On Program node, get the outermost scope to avoid return Node.js special function scope or ES modules scope.
  const inner = currentNode.type !== 'Program'
  const scopeManager = context.sourceCode.scopeManager

  let node: ESNode | null = currentNode
  for (; node; node = node.parent as ESNode | null) {
    const scope = scopeManager.acquire(node, inner)

    if (scope) {
      if (scope.type === 'function-expression-name') {
        return scope.childScopes[0]
      }
      return scope
    }
  }

  return scopeManager.scopes[0]
}
