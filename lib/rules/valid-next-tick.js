/**
 * @fileoverview enforce valid `nextTick` function calls
 * @author Flo Edelmann
 * @copyright 2021 Flo Edelmann. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const { findVariable } = require('eslint-utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * @param {Identifier} identifier
 * @param {RuleContext} context
 * @returns {ASTNode|undefined}
 */
function getVueNextTickParentNode(identifier, context) {
  // Instance API: this.$nextTick()
  if (
    identifier.name === '$nextTick' &&
    identifier.parent.type === 'MemberExpression' &&
    utils.isThis(identifier.parent.object, context)
  ) {
    return identifier.parent.parent
  }

  // Vue 2 Global API: Vue.nextTick()
  if (
    identifier.name === 'nextTick' &&
    identifier.parent.type === 'MemberExpression' &&
    identifier.parent.object.type === 'Identifier' &&
    identifier.parent.object.name === 'Vue'
  ) {
    return identifier.parent.parent
  }

  // Vue 3 Global API: import { nextTick as nt } from 'vue'; nt()
  const variable = findVariable(context.getScope(), identifier)

  if (variable != null && variable.defs.length === 1) {
    const def = variable.defs[0]
    if (
      def.type === 'ImportBinding' &&
      def.node.type === 'ImportSpecifier' &&
      def.node.imported.type === 'Identifier' &&
      def.node.imported.name === 'nextTick' &&
      def.node.parent.type === 'ImportDeclaration' &&
      def.node.parent.source.value === 'vue'
    ) {
      return identifier.parent
    }
  }

  return undefined
}

/**
 * @param {CallExpression} callExpression
 * @returns {boolean}
 */
function isAwaitedPromise(callExpression) {
  return (
    callExpression.parent.type === 'AwaitExpression' ||
    (callExpression.parent.type === 'MemberExpression' &&
      callExpression.parent.property.type === 'Identifier' &&
      callExpression.parent.property.name === 'then')
  )
}

/**
 * @param {ASTNode} node
 * @returns {FunctionExpression|undefined}
 */
function getClosestFunction(node) {
  while (node.parent !== null) {
    node = /** @type {ASTNode} */ (node.parent)

    if (node.type === 'FunctionExpression') {
      return node
    }
  }

  return undefined
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce valid `nextTick` function calls',
      // categories: ['vue3-essential', 'essential'],
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/valid-next-tick.html'
    },
    fixable: 'code',
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineVueVisitor(context, {
      /** @param {Identifier} node */
      Identifier(node) {
        const parentNode = getVueNextTickParentNode(node, context)
        if (!parentNode) {
          return
        }

        if (parentNode.type !== 'CallExpression') {
          context.report({
            node,
            message: '`nextTick` is a function.',
            fix(fixer) {
              return fixer.insertTextAfter(node, '()')
            }
          })
          return
        }

        if (parentNode.arguments.length === 0) {
          if (!isAwaitedPromise(parentNode)) {
            const closestFunction = getClosestFunction(parentNode)
            const isAsyncFunction = closestFunction
              ? closestFunction.async
              : false

            context.report({
              node,
              message:
                'Await the Promise returned by `nextTick` or pass a callback function.',
              fix: isAsyncFunction
                ? (fixer) => fixer.insertTextBefore(parentNode, 'await ')
                : undefined
            })
          }
          return
        }

        if (parentNode.arguments.length > 1) {
          context.report({
            node,
            message: '`nextTick` expects zero or one parameters.'
          })
          return
        }

        if (isAwaitedPromise(parentNode)) {
          context.report({
            node,
            message:
              'Either await the Promise or pass a callback function to `nextTick`.'
          })
        }
      }
    })
  }
}
