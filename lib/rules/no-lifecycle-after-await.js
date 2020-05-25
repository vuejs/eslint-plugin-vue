/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
const { ReferenceTracker } = require('eslint-utils')
const utils = require('../utils')

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

module.exports = {
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
      forbidden: 'The lifecycle hooks after `await` expression are forbidden.'
    }
  },
  create(context) {
    const lifecycleHookCallNodes = new Set()
    const setupFunctions = new Map()

    let scopeStack = { upper: null, functionNode: null }

    return Object.assign(
      {
        Program() {
          const tracker = new ReferenceTracker(context.getScope())
          const traceMap = {
            vue: {
              [ReferenceTracker.ESM]: true
            }
          }
          for (const lifecycleHook of LIFECYCLE_HOOKS) {
            traceMap.vue[lifecycleHook] = {
              [ReferenceTracker.CALL]: true
            }
          }

          for (const { node } of tracker.iterateEsmReferences(traceMap)) {
            lifecycleHookCallNodes.add(node)
          }
        }
      },
      utils.defineVueVisitor(context, {
        ':function'(node) {
          scopeStack = { upper: scopeStack, functionNode: node }
        },
        onSetupFunctionEnter(node) {
          setupFunctions.set(node, {
            setupProperty: node.parent,
            afterAwait: false
          })
        },
        AwaitExpression() {
          const setupFunctionData = setupFunctions.get(scopeStack.functionNode)
          if (!setupFunctionData) {
            return
          }
          setupFunctionData.afterAwait = true
        },
        CallExpression(node) {
          const setupFunctionData = setupFunctions.get(scopeStack.functionNode)
          if (!setupFunctionData || !setupFunctionData.afterAwait) {
            return
          }

          if (lifecycleHookCallNodes.has(node)) {
            if (node.arguments.length >= 2) {
              // Has target instance. e.g. `onMounted(() => {}, instance)`
              return
            }
            context.report({
              node,
              messageId: 'forbidden'
            })
          }
        },
        ':function:exit'(node) {
          scopeStack = scopeStack.upper

          setupFunctions.delete(node)
        }
      })
    )
  }
}
