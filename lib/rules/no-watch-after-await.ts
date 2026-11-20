/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { ReferenceTracker } from '@eslint-community/eslint-utils'
import utils from '../utils/index.ts'

function isMaybeUsedStopHandle(
  node: CallExpression | ChainExpression
): boolean {
  const parent = node.parent
  if (parent) {
    switch (parent.type) {
      case 'VariableDeclarator': {
        // var foo = watch()
        return true
      }
      case 'AssignmentExpression': {
        // foo = watch()
        return true
      }
      case 'CallExpression': {
        // foo(watch())
        return true
      }
      case 'Property': {
        // {foo: watch()}
        return true
      }
      case 'ArrayExpression': {
        // [watch()]
        return true
      }
      case 'ChainExpression': {
        return isMaybeUsedStopHandle(parent)
      }
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
      range: [number, number]
    }
    const setupScopes = new Map<
      FunctionExpression | ArrowFunctionExpression | FunctionDeclaration,
      SetupScopeData
    >()

    interface ScopeStack {
      upper: ScopeStack | null
      scopeNode:
        FunctionExpression | ArrowFunctionExpression | FunctionDeclaration
    }
    let scopeStack: ScopeStack | null = null

    return utils.compositingVisitors(
      {
        Program(program: Program) {
          const tracker = new ReferenceTracker(utils.getScope(context, program))

          const watchRefs = utils.iterateReferencesTraceMap(tracker, {
            watch: {
              [ReferenceTracker.CALL]: true
            },
            watchEffect: {
              [ReferenceTracker.CALL]: true
            }
          })
          for (const { node } of watchRefs) {
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
            FunctionExpression | ArrowFunctionExpression | FunctionDeclaration
        ) {
          scopeStack = {
            upper: scopeStack,
            scopeNode: node
          }
        },
        ':function:exit'() {
          scopeStack &&= scopeStack.upper
        },
        AwaitExpression(node: AwaitExpression) {
          if (!scopeStack) {
            return
          }
          const setupScope = setupScopes.get(scopeStack.scopeNode)
          if (!setupScope || !utils.isInRange(setupScope.range, node)) {
            return
          }
          setupScope.afterAwait = true
        },
        CallExpression(node: CallExpression) {
          if (!scopeStack) {
            return
          }
          const setupScope = setupScopes.get(scopeStack.scopeNode)
          if (
            !setupScope ||
            !setupScope.afterAwait ||
            !utils.isInRange(setupScope.range, node)
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
