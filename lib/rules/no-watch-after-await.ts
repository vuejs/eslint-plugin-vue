/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { ReferenceTracker } from '@eslint-community/eslint-utils'
import utils from '../utils/index.js'
import { getScope } from '../utils/scope.ts'

function isMaybeUsedStopHandle(
  node: CallExpression | ChainExpression
): boolean {
  const parent = node.parent
  if (parent) {
    if (parent.type === 'VariableDeclarator') {
      // var foo = watch()
      return true
    }
    if (parent.type === 'AssignmentExpression') {
      // foo = watch()
      return true
    }
    if (parent.type === 'CallExpression') {
      // foo(watch())
      return true
    }
    if (parent.type === 'Property') {
      // {foo: watch()}
      return true
    }
    if (parent.type === 'ArrayExpression') {
      // [watch()]
      return true
    }
    if (parent.type === 'ChainExpression') {
      return isMaybeUsedStopHandle(parent)
    }
  }
  return false
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow asynchronously registered `watch`',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-watch-after-await.html'
    },
    fixable: null,
    schema: [],
    messages: {
      forbidden: '`watch` is forbidden after an `await` expression.'
    }
  },
  create(context: RuleContext) {
    const watchCallNodes = new Set()
    interface SetupScopeData {
      afterAwait: boolean
      range: Range
    }

    const setupScopes = new Map<
      FunctionExpression | ArrowFunctionExpression | FunctionDeclaration,
      SetupScopeData
    >()

    interface ScopeStack {
      upper: ScopeStack | null
      scopeNode:
        | FunctionExpression
        | ArrowFunctionExpression
        | FunctionDeclaration
    }

    let scopeStack: ScopeStack | null = null

    return utils.compositingVisitors(
      {
        Program(program: Program) {
          const tracker = new ReferenceTracker(getScope(context, program))

          for (const { node } of utils.iterateReferencesTraceMap(tracker, {
            watch: {
              [ReferenceTracker.CALL]: true
            },
            watchEffect: {
              [ReferenceTracker.CALL]: true
            }
          })) {
            watchCallNodes.add(node)
          }
        }
      },
      utils.defineVueVisitor(context, {
        onSetupFunctionEnter(node) {
          setupScopes.set(node, {
            afterAwait: false,
            range: node.range
          })
        },
        ':function'(
          node:
            | FunctionExpression
            | ArrowFunctionExpression
            | FunctionDeclaration
        ) {
          scopeStack = {
            upper: scopeStack,
            scopeNode: node
          }
        },
        ':function:exit'() {
          scopeStack = scopeStack && scopeStack.upper
        },
        AwaitExpression(node) {
          if (!scopeStack) {
            return
          }
          const setupScope = setupScopes.get(scopeStack.scopeNode)
          if (!setupScope || !utils.inRange(setupScope.range, node)) {
            return
          }
          setupScope.afterAwait = true
        },
        CallExpression(node) {
          if (!scopeStack) {
            return
          }
          const setupScope = setupScopes.get(scopeStack.scopeNode)
          if (
            !setupScope ||
            !setupScope.afterAwait ||
            !utils.inRange(setupScope.range, node)
          ) {
            return
          }

          if (watchCallNodes.has(node) && !isMaybeUsedStopHandle(node)) {
            context.report({
              node,
              messageId: 'forbidden'
            })
          }
        },
        onSetupFunctionExit(node) {
          setupScopes.delete(node)
        }
      })
    )
  }
}
