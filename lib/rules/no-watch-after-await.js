/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
const { ReferenceTracker } = require('eslint-utils')
const utils = require('../utils')

/**
 * @param {CallExpression | ChainExpression} node
 * @returns {boolean}
 */
function isMaybeUsedStopHandle(node) {
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

module.exports = {
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
      forbidden: 'The `watch` after `await` expression are forbidden.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const watchCallNodes = new Set()
    /**
     * @typedef {object} SetupScopeData
     * @property {boolean} afterAwait
     * @property {[number,number]} range
     */
    /** @type {Map<FunctionExpression | ArrowFunctionExpression | FunctionDeclaration | Program, SetupScopeData>} */
    const setupScopes = new Map()

    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {FunctionExpression | ArrowFunctionExpression | FunctionDeclaration | Program} scopeNode
     */
    /** @type {ScopeStack | null} */
    let scopeStack = null

    return utils.compositingVisitors(
      {
        /** @param {Program} node */
        Program(node) {
          scopeStack = {
            upper: scopeStack,
            scopeNode: node
          }

          const tracker = new ReferenceTracker(context.getScope())
          const traceMap = {
            vue: {
              [ReferenceTracker.ESM]: true,
              watch: {
                [ReferenceTracker.CALL]: true
              },
              watchEffect: {
                [ReferenceTracker.CALL]: true
              }
            }
          }

          for (const { node } of tracker.iterateEsmReferences(traceMap)) {
            watchCallNodes.add(node)
          }
        },
        /** @param {FunctionExpression | ArrowFunctionExpression | FunctionDeclaration} node */
        ':function'(node) {
          scopeStack = {
            upper: scopeStack,
            scopeNode: node
          }
        },
        ':function:exit'() {
          scopeStack = scopeStack && scopeStack.upper
        },
        /** @param {AwaitExpression} node */
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
        /** @param {CallExpression} node */
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
        }
      },
      (() => {
        const scriptSetup = utils.getScriptSetupElement(context)
        if (!scriptSetup) {
          return {}
        }
        return {
          /**
           * @param {Program} node
           */
          Program(node) {
            setupScopes.set(node, {
              afterAwait: false,
              range: scriptSetup.range
            })
          }
        }
      })(),
      utils.defineVueVisitor(context, {
        onSetupFunctionEnter(node) {
          setupScopes.set(node, {
            afterAwait: false,
            range: node.range
          })
        },
        onSetupFunctionExit(node) {
          setupScopes.delete(node)
        }
      })
    )
  }
}
