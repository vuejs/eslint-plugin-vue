/**
 * @fileoverview Check if there are no asynchronous actions inside computed properties.
 * @author Armano
 */
'use strict'

const utils = require('../utils')

const PROMISE_FUNCTIONS = ['then', 'catch', 'finally']

const PROMISE_METHODS = ['all', 'race', 'reject', 'resolve']

const TIMED_FUNCTIONS = [
  'setTimeout',
  'setInterval',
  'setImmediate',
  'requestAnimationFrame'
]

function isTimedFunction(node) {
  return (
    ((node.type === 'CallExpression' &&
      node.callee.type === 'Identifier' &&
      TIMED_FUNCTIONS.indexOf(node.callee.name) !== -1) ||
      (node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        node.callee.object.type === 'Identifier' &&
        node.callee.object.name === 'window' &&
        TIMED_FUNCTIONS.indexOf(node.callee.property.name) !== -1)) &&
    node.arguments.length
  )
}

function isPromise(node) {
  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression'
  ) {
    return (
      // hello.PROMISE_FUNCTION()
      (node.callee.property.type === 'Identifier' &&
        PROMISE_FUNCTIONS.indexOf(node.callee.property.name) !== -1) || // Promise.PROMISE_METHOD()
      (node.callee.object.type === 'Identifier' &&
        node.callee.object.name === 'Promise' &&
        PROMISE_METHODS.indexOf(node.callee.property.name) !== -1)
    )
  }
  return false
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow asynchronous actions in computed properties',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-async-in-computed-properties.html'
    },
    fixable: null,
    schema: []
  },

  create(context) {
    const computedPropertiesMap = new Map()
    let scopeStack = { upper: null, body: null }

    const expressionTypes = {
      promise: 'asynchronous action',
      await: 'await operator',
      async: 'async function declaration',
      new: 'Promise object',
      timed: 'timed function'
    }

    function onFunctionEnter(node, { node: vueNode }) {
      if (node.async) {
        verify(node, node.body, 'async', computedPropertiesMap.get(vueNode))
      }

      scopeStack = { upper: scopeStack, body: node.body }
    }

    function onFunctionExit() {
      scopeStack = scopeStack.upper
    }

    function verify(node, targetBody, type, computedProperties) {
      computedProperties.forEach((cp) => {
        if (
          cp.value &&
          node.loc.start.line >= cp.value.loc.start.line &&
          node.loc.end.line <= cp.value.loc.end.line &&
          targetBody === cp.value
        ) {
          context.report({
            node,
            message:
              'Unexpected {{expressionName}} in "{{propertyName}}" computed property.',
            data: {
              expressionName: expressionTypes[type],
              propertyName: cp.key
            }
          })
        }
      })
    }
    return utils.defineVueVisitor(context, {
      onVueObjectEnter(node) {
        computedPropertiesMap.set(node, utils.getComputedProperties(node))
      },
      ':function': onFunctionEnter,
      ':function:exit': onFunctionExit,

      NewExpression(node, { node: vueNode }) {
        if (node.callee.name === 'Promise') {
          verify(
            node,
            scopeStack.body,
            'new',
            computedPropertiesMap.get(vueNode)
          )
        }
      },

      CallExpression(node, { node: vueNode }) {
        if (isPromise(node)) {
          verify(
            node,
            scopeStack.body,
            'promise',
            computedPropertiesMap.get(vueNode)
          )
        } else if (isTimedFunction(node)) {
          verify(
            node,
            scopeStack.body,
            'timed',
            computedPropertiesMap.get(vueNode)
          )
        }
      },

      AwaitExpression(node, { node: vueNode }) {
        verify(
          node,
          scopeStack.body,
          'await',
          computedPropertiesMap.get(vueNode)
        )
      }
    })
  }
}
