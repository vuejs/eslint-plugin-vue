/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
const { ReferenceTracker } = require('eslint-utils')
const utils = require('../utils')

const LIFECYCLE_HOOKS = ['onBeforeMount', 'onBeforeUnmount', 'onBeforeUpdate', 'onErrorCaptured', 'onMounted', 'onRenderTracked', 'onRenderTriggered', 'onUnmounted', 'onUpdated', 'onActivated', 'onDeactivated']

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
  create (context) {
    const lifecycleHookCallNodes = new Set()
    const setupFunctions = new Map()
    const forbiddenNodes = new Map()

    function addForbiddenNode (property, node) {
      let list = forbiddenNodes.get(property)
      if (!list) {
        list = []
        forbiddenNodes.set(property, list)
      }
      list.push(node)
    }

    let scopeStack = { upper: null, functionNode: null }

    return Object.assign(
      {
        'Program' () {
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
        },
        'Property[value.type=/^(Arrow)?FunctionExpression$/]' (node) {
          if (utils.getStaticPropertyName(node) !== 'setup') {
            return
          }

          setupFunctions.set(node.value, {
            setupProperty: node,
            afterAwait: false
          })
        },
        ':function' (node) {
          scopeStack = { upper: scopeStack, functionNode: node }
        },
        'AwaitExpression' () {
          const setupFunctionData = setupFunctions.get(scopeStack.functionNode)
          if (!setupFunctionData) {
            return
          }
          setupFunctionData.afterAwait = true
        },
        'CallExpression' (node) {
          const setupFunctionData = setupFunctions.get(scopeStack.functionNode)
          if (!setupFunctionData || !setupFunctionData.afterAwait) {
            return
          }

          if (lifecycleHookCallNodes.has(node)) {
            addForbiddenNode(setupFunctionData.setupProperty, node)
          }
        },
        ':function:exit' (node) {
          scopeStack = scopeStack.upper

          setupFunctions.delete(node)
        }
      },
      utils.executeOnVue(context, obj => {
        const reportsList = obj.properties
          .map(item => forbiddenNodes.get(item))
          .filter(reports => !!reports)
        for (const reports of reportsList) {
          for (const node of reports) {
            context.report({
              node,
              messageId: 'forbidden'
            })
          }
        }
      })
    )
  }
}
