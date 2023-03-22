/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
const { findVariable } = require('@eslint-community/eslint-utils')
const utils = require('../utils')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow destructuring of `props` passed to `setup`',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-setup-props-destructure.html'
    },
    fixable: null,
    schema: [],
    messages: {
      destructuring:
        'Destructuring the `props` will cause the value to lose reactivity.',
      getProperty:
        'Getting a value from the `props` in root scope of `{{scopeName}}` will cause the value to lose reactivity.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * @typedef {object} ScopePropsReferences
     * @property {Set<Identifier>} refs
     * @property {string} scopeName
     */
    /** @type {Map<FunctionDeclaration | FunctionExpression | ArrowFunctionExpression | Program, ScopePropsReferences>} */
    const setupScopePropsReferenceIds = new Map()

    /**
     * @param {ESNode} node
     * @param {string} messageId
     * @param {string} scopeName
     */
    function report(node, messageId, scopeName) {
      context.report({
        node,
        messageId,
        data: {
          scopeName
        }
      })
    }

    /**
     * @param {Pattern} left
     * @param {Expression | null} right
     * @param {ScopePropsReferences} propsReferences
     */
    function verify(left, right, propsReferences) {
      if (!right) {
        return
      }

      const rightNode = utils.skipChainExpression(right)
      if (
        left.type !== 'ArrayPattern' &&
        left.type !== 'ObjectPattern' &&
        rightNode.type !== 'MemberExpression'
      ) {
        return
      }
      /** @type {Expression | Super} */
      let rightId = rightNode
      while (rightId.type === 'MemberExpression') {
        rightId = utils.skipChainExpression(rightId.object)
      }
      if (rightId.type === 'Identifier' && propsReferences.refs.has(rightId)) {
        report(left, 'getProperty', propsReferences.scopeName)
      }
    }
    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression | Program} scopeNode
     */
    /**
     * @type {ScopeStack | null}
     */
    let scopeStack = null

    /**
     * @param {Pattern | null} node
     * @param {FunctionDeclaration | FunctionExpression | ArrowFunctionExpression | Program} scopeNode
     * @param {string} scopeName
     */
    function processPattern(node, scopeNode, scopeName) {
      if (!node) {
        // no arguments
        return
      }
      if (
        node.type === 'RestElement' ||
        node.type === 'AssignmentPattern' ||
        node.type === 'MemberExpression'
      ) {
        // cannot check
        return
      }
      if (node.type === 'ArrayPattern' || node.type === 'ObjectPattern') {
        report(node, 'destructuring', scopeName)
        return
      }

      const variable = findVariable(context.getScope(), node)
      if (!variable) {
        return
      }
      const propsReferenceIds = new Set()
      for (const reference of variable.references) {
        if (!reference.isRead()) {
          continue
        }

        propsReferenceIds.add(reference.identifier)
      }
      setupScopePropsReferenceIds.set(scopeNode, {
        refs: propsReferenceIds,
        scopeName
      })
    }
    return utils.compositingVisitors(
      {
        /**
         * @param {FunctionExpression | FunctionDeclaration | ArrowFunctionExpression | Program} node
         */
        'Program, :function'(node) {
          scopeStack = {
            upper: scopeStack,
            scopeNode: node
          }
        },
        /**
         * @param {FunctionExpression | FunctionDeclaration | ArrowFunctionExpression | Program} node
         */
        'Program, :function:exit'(node) {
          scopeStack = scopeStack && scopeStack.upper

          setupScopePropsReferenceIds.delete(node)
        },
        /**
         * @param {VariableDeclarator} node
         */
        VariableDeclarator(node) {
          if (!scopeStack) {
            return
          }
          const propsReferenceIds = setupScopePropsReferenceIds.get(
            scopeStack.scopeNode
          )
          if (!propsReferenceIds) {
            return
          }
          verify(node.id, node.init, propsReferenceIds)
        },
        /**
         * @param {AssignmentExpression} node
         */
        AssignmentExpression(node) {
          if (!scopeStack) {
            return
          }
          const propsReferenceIds = setupScopePropsReferenceIds.get(
            scopeStack.scopeNode
          )
          if (!propsReferenceIds) {
            return
          }
          verify(node.left, node.right, propsReferenceIds)
        }
      },
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node) {
          let target = node
          if (
            target.parent &&
            target.parent.type === 'CallExpression' &&
            target.parent.arguments[0] === target &&
            target.parent.callee.type === 'Identifier' &&
            target.parent.callee.name === 'withDefaults'
          ) {
            target = target.parent
          }
          if (!target.parent) {
            return
          }

          /** @type {Pattern|null} */
          let id = null
          if (target.parent.type === 'VariableDeclarator') {
            id = target.parent.init === target ? target.parent.id : null
          } else if (target.parent.type === 'AssignmentExpression') {
            id = target.parent.right === target ? target.parent.left : null
          }
          processPattern(id, context.getSourceCode().ast, '<script setup>')
        }
      }),
      utils.defineVueVisitor(context, {
        onSetupFunctionEnter(node) {
          const propsParam = utils.skipDefaultParamValue(node.params[0])
          processPattern(propsParam, node, 'setup()')
        }
      })
    )
  }
}
