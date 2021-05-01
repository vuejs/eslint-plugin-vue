/**
 * @fileoverview Check if there are no asynchronous actions inside computed properties.
 * @author Armano
 */
'use strict'
const { ReferenceTracker } = require('eslint-utils')
const utils = require('../utils')

/**
 * @typedef {import('../utils').VueObjectData} VueObjectData
 * @typedef {import('../utils').ComponentComputedProperty} ComponentComputedProperty
 */

const PROMISE_FUNCTIONS = new Set(['then', 'catch', 'finally'])

const PROMISE_METHODS = new Set(['all', 'race', 'reject', 'resolve'])

const TIMED_FUNCTIONS = new Set([
  'setTimeout',
  'setInterval',
  'setImmediate',
  'requestAnimationFrame'
])

/**
 * @param {CallExpression} node
 */
function isTimedFunction(node) {
  const callee = utils.skipChainExpression(node.callee)
  return (
    ((callee.type === 'Identifier' && TIMED_FUNCTIONS.has(callee.name)) ||
      (callee.type === 'MemberExpression' &&
        callee.object.type === 'Identifier' &&
        callee.object.name === 'window' &&
        TIMED_FUNCTIONS.has(utils.getStaticPropertyName(callee) || ''))) &&
    node.arguments.length > 0
  )
}

/**
 * @param {CallExpression} node
 */
function isPromise(node) {
  const callee = utils.skipChainExpression(node.callee)
  if (callee.type === 'MemberExpression') {
    const name = utils.getStaticPropertyName(callee)
    return (
      name &&
      // hello.PROMISE_FUNCTION()
      (PROMISE_FUNCTIONS.has(name) ||
        // Promise.PROMISE_METHOD()
        (callee.object.type === 'Identifier' &&
          callee.object.name === 'Promise' &&
          PROMISE_METHODS.has(name)))
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
  /** @param {RuleContext} context */
  create(context) {
    /** @type {Map<ObjectExpression, ComponentComputedProperty[]>} */
    const computedPropertiesMap = new Map()
    /** @type {(FunctionExpression | ArrowFunctionExpression)[]} */
    const computedFunctionNodes = []

    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {BlockStatement | Expression} body
     */
    /** @type {ScopeStack | null} */
    let scopeStack = null

    const expressionTypes = {
      promise: 'asynchronous action',
      await: 'await operator',
      async: 'async function declaration',
      new: 'Promise object',
      timed: 'timed function'
    }

    /**
     * @param {FunctionExpression | FunctionDeclaration | ArrowFunctionExpression} node
     * @param {VueObjectData} data
     */
    function onFunctionEnter(node, { node: vueNode }) {
      if (node.async) {
        verify(node, node.body, 'async', computedPropertiesMap.get(vueNode))
      }

      scopeStack = {
        upper: scopeStack,
        body: node.body
      }
    }

    function onFunctionExit() {
      scopeStack = scopeStack && scopeStack.upper
    }

    /**
     * @param {ESNode} node
     * @param {BlockStatement | Expression} targetBody
     * @param {keyof expressionTypes} type
     * @param {ComponentComputedProperty[]} computedProperties
     */
    function verify(node, targetBody, type, computedProperties = []) {
      for (const cp of computedProperties) {
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
              propertyName: cp.key || 'unknown'
            }
          })
          return
        }
      }

      for (const cf of computedFunctionNodes) {
        if (
          node.loc.start.line >= cf.body.loc.start.line &&
          node.loc.end.line <= cf.body.loc.end.line &&
          targetBody === cf.body
        ) {
          context.report({
            node,
            message: 'Unexpected {{expressionName}} in computed function.',
            data: {
              expressionName: expressionTypes[type]
            }
          })
          return
        }
      }
    }
    return Object.assign(
      {
        Program() {
          const tracker = new ReferenceTracker(context.getScope())
          const traceMap = utils.createCompositionApiTraceMap({
            [ReferenceTracker.ESM]: true,
            computed: {
              [ReferenceTracker.CALL]: true
            }
          })

          for (const { node } of tracker.iterateEsmReferences(traceMap)) {
            if (node.type !== 'CallExpression') {
              continue
            }

            const getter = utils.getGetterBodyFromComputedFunction(node)
            if (getter) {
              computedFunctionNodes.push(getter)
            }
          }
        }
      },
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          computedPropertiesMap.set(node, utils.getComputedProperties(node))
        },
        ':function': onFunctionEnter,
        ':function:exit': onFunctionExit,

        NewExpression(node, { node: vueNode }) {
          if (!scopeStack) {
            return
          }
          if (
            node.callee.type === 'Identifier' &&
            node.callee.name === 'Promise'
          ) {
            verify(
              node,
              scopeStack.body,
              'new',
              computedPropertiesMap.get(vueNode)
            )
          }
        },

        CallExpression(node, { node: vueNode }) {
          if (!scopeStack) {
            return
          }
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
          if (!scopeStack) {
            return
          }
          verify(
            node,
            scopeStack.body,
            'await',
            computedPropertiesMap.get(vueNode)
          )
        }
      })
    )
  }
}
