/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { findVariable } = require('eslint-utils')
const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Get the callee member node from the given CallExpression
 * @param {CallExpression} node CallExpression
 */
function getCalleeMemberNode(node) {
  const callee = utils.skipChainExpression(node.callee)

  if (callee.type === 'MemberExpression') {
    const name = utils.getStaticPropertyName(callee)
    if (name) {
      return { name, member: callee }
    }
  }
  return null
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow asynchronously registered `expose`',
      categories: undefined,
      // categories: ['vue3-essential'], TODO Change with the major version
      url: 'https://eslint.vuejs.org/rules/no-expose-after-await.html'
    },
    fixable: null,
    schema: [],
    messages: {
      forbidden: 'The `expose` after `await` expression are forbidden.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * @typedef {object} SetupScopeData
     * @property {boolean} afterAwait
     * @property {[number,number]} range
     * @property {Set<Identifier>} exposeReferenceIds
     * @property {Set<Identifier>} contextReferenceIds
     */
    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression} scopeNode
     */
    /** @type {Map<FunctionDeclaration | FunctionExpression | ArrowFunctionExpression, SetupScopeData>} */
    const setupScopes = new Map()

    /** @type {ScopeStack | null} */
    let scopeStack = null

    return utils.defineVueVisitor(context, {
      onSetupFunctionEnter(node) {
        const contextParam = node.params[1]
        if (!contextParam) {
          // no arguments
          return
        }
        if (contextParam.type === 'RestElement') {
          // cannot check
          return
        }
        if (contextParam.type === 'ArrayPattern') {
          // cannot check
          return
        }
        /** @type {Set<Identifier>} */
        const contextReferenceIds = new Set()
        /** @type {Set<Identifier>} */
        const exposeReferenceIds = new Set()
        if (contextParam.type === 'ObjectPattern') {
          const exposeProperty = utils.findAssignmentProperty(
            contextParam,
            'expose'
          )
          if (!exposeProperty) {
            return
          }
          const exposeParam = exposeProperty.value
          // `setup(props, {emit})`
          const variable =
            exposeParam.type === 'Identifier'
              ? findVariable(context.getScope(), exposeParam)
              : null
          if (!variable) {
            return
          }
          for (const reference of variable.references) {
            if (!reference.isRead()) {
              continue
            }
            exposeReferenceIds.add(reference.identifier)
          }
        } else if (contextParam.type === 'Identifier') {
          // `setup(props, context)`
          const variable = findVariable(context.getScope(), contextParam)
          if (!variable) {
            return
          }
          for (const reference of variable.references) {
            if (!reference.isRead()) {
              continue
            }
            contextReferenceIds.add(reference.identifier)
          }
        }
        setupScopes.set(node, {
          afterAwait: false,
          range: node.range,
          exposeReferenceIds,
          contextReferenceIds
        })
      },
      /**
       * @param {FunctionExpression | FunctionDeclaration | ArrowFunctionExpression} node
       */
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
        const { contextReferenceIds, exposeReferenceIds } = setupScope
        if (
          node.callee.type === 'Identifier' &&
          exposeReferenceIds.has(node.callee)
        ) {
          // setup(props,{expose}) {expose()}
          context.report({
            node,
            messageId: 'forbidden'
          })
        } else {
          const expose = getCalleeMemberNode(node)
          if (
            expose &&
            expose.name === 'expose' &&
            expose.member.object.type === 'Identifier' &&
            contextReferenceIds.has(expose.member.object)
          ) {
            // setup(props,context) {context.emit()}
            context.report({
              node,
              messageId: 'forbidden'
            })
          }
        }
      },
      onSetupFunctionExit(node) {
        setupScopes.delete(node)
      }
    })
  }
}
