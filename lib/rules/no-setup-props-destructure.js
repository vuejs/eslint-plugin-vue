/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
const { findVariable } = require('eslint-utils')
const utils = require('../utils')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow destructuring of `props` passed to `setup`',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-setup-props-destructure.html'
    },
    fixable: null,
    schema: [],
    messages: {
      destructuring:
        'Destructuring the `props` will cause the value to lose reactivity.',
      getProperty:
        'Getting a value from the `props` in root scope of `setup()` will cause the value to lose reactivity.'
    }
  },
  create(context) {
    const setupScopePropsReferenceIds = new Map()

    function report(node, messageId) {
      context.report({
        node,
        messageId
      })
    }

    function verify(left, right, propsReferenceIds) {
      if (!right) {
        return
      }

      if (
        left.type !== 'ArrayPattern' &&
        left.type !== 'ObjectPattern' &&
        right.type !== 'MemberExpression'
      ) {
        return
      }

      let rightId = right
      while (rightId.type === 'MemberExpression') {
        rightId = rightId.object
      }
      if (propsReferenceIds.has(rightId)) {
        report(left, 'getProperty')
      }
    }

    let scopeStack = null

    return utils.defineVueVisitor(context, {
      ':function'(node) {
        scopeStack = { upper: scopeStack, functionNode: node }
      },
      onSetupFunctionEnter(node) {
        const propsParam = node.params[0]
        if (!propsParam) {
          // no arguments
          return
        }
        if (propsParam.type === 'RestElement') {
          // cannot check
          return
        }
        if (
          propsParam.type === 'ArrayPattern' ||
          propsParam.type === 'ObjectPattern'
        ) {
          report(propsParam, 'destructuring')
          return
        }

        const variable = findVariable(context.getScope(), propsParam)
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
        setupScopePropsReferenceIds.set(node, propsReferenceIds)
      },
      VariableDeclarator(node) {
        const propsReferenceIds = setupScopePropsReferenceIds.get(
          scopeStack.functionNode
        )
        if (!propsReferenceIds) {
          return
        }
        verify(node.id, node.init, propsReferenceIds)
      },
      AssignmentExpression(node) {
        const propsReferenceIds = setupScopePropsReferenceIds.get(
          scopeStack.functionNode
        )
        if (!propsReferenceIds) {
          return
        }
        verify(node.left, node.right, propsReferenceIds)
      },
      ':function:exit'(node) {
        scopeStack = scopeStack.upper

        setupScopePropsReferenceIds.delete(node)
      }
    })
  }
}
