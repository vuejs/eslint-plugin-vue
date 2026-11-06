/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { ReferenceTracker } from '@eslint-community/eslint-utils'
import type { TYPES } from '@eslint-community/eslint-utils'
import utils from '../utils/index.ts'

const LIFECYCLE_HOOKS = [
  'onBeforeMount',
  'onBeforeUnmount',
  'onBeforeUpdate',
  'onErrorCaptured',
  'onMounted',
  'onRenderTracked',
  'onRenderTriggered',
  'onUnmounted',
  'onUpdated',
  'onActivated',
  'onDeactivated'
]

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow asynchronously registered lifecycle hooks',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-lifecycle-after-await.html'
    },
    fixable: null,
    schema: [],
    messages: {
      forbidden: 'Lifecycle hooks are forbidden after an `await` expression.'
    }
  },
  create(context: RuleContext) {
    interface SetupScopeData {
      afterAwait: boolean
      range: [number, number]
    }
    interface ScopeStack {
      upper: ScopeStack | null
      scopeNode:
        FunctionDeclaration | FunctionExpression | ArrowFunctionExpression
    }
    const lifecycleHookCallNodes = new Set<ESNode>()
    const setupScopes = new Map<
      FunctionDeclaration | FunctionExpression | ArrowFunctionExpression,
      SetupScopeData
    >()

    let scopeStack: ScopeStack | null = null

    return utils.compositingVisitors(
      {
        Program(program: Program) {
          const tracker = new ReferenceTracker(utils.getScope(context, program))
          const traceMap: TYPES.TraceMap = {}
          for (const lifecycleHook of LIFECYCLE_HOOKS) {
            traceMap[lifecycleHook] = {
              [ReferenceTracker.CALL]: true
            }
          }

          for (const { node } of utils.iterateReferencesTraceMap(
            tracker,
            traceMap
          )) {
            lifecycleHookCallNodes.add(node)
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
            FunctionExpression | FunctionDeclaration | ArrowFunctionExpression
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
            !setupScope?.afterAwait ||
            !utils.isInRange(setupScope.range, node) ||
            !lifecycleHookCallNodes.has(node) ||
            node.arguments.length >= 2 // Has target instance. e.g. `onMounted(() => {}, instance)`
          ) {
            return
          }
          context.report({
            node,
            messageId: 'forbidden'
          })
        },
        onSetupFunctionExit(node) {
          setupScopes.delete(node)
        }
      })
    )
  }
}
