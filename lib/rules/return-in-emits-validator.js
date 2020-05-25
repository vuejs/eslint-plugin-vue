/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef {import('vue-eslint-parser').AST.ESLintExpression} Expression
 */

/**
 * Checks if the given node value is falsy.
 * @param {Expression} node The node to check
 * @returns {boolean} If `true`, the given node value is falsy.
 */
function isFalsy(node) {
  if (node.type === 'Literal') {
    if (node.bigint) {
      return node.bigint === '0'
    } else if (!node.value) {
      return true
    }
  } else if (node.type === 'Identifier') {
    if (node.name === 'undefined' || node.name === 'NaN') {
      return true
    }
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
      description:
        'enforce that a return statement is present in emits validator',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/return-in-emits-validator.html'
    },
    fixable: null, // or "code" or "whitespace"
    schema: []
  },

  create(context) {
    const emitsValidators = []

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    let scopeStack = null

    return Object.assign(
      {},
      utils.defineVueVisitor(context, {
        onVueObjectEnter(obj) {
          for (const emits of utils.getComponentEmits(obj)) {
            const emitsValue = emits.value
            if (!emitsValue) {
              continue
            }
            if (
              emitsValue.type !== 'FunctionExpression' &&
              emitsValue.type !== 'ArrowFunctionExpression'
            ) {
              continue
            }
            emitsValidators.push(emits)
          }
        },
        ':function'(node) {
          scopeStack = {
            upper: scopeStack,
            functionNode: node,
            hasReturnValue: false,
            possibleOfReturnTrue: false
          }

          if (node.type === 'ArrowFunctionExpression' && node.expression) {
            scopeStack.hasReturnValue = true

            if (!isFalsy(node.body)) {
              scopeStack.possibleOfReturnTrue = true
            }
          }
        },
        ReturnStatement(node) {
          if (node.argument) {
            scopeStack.hasReturnValue = true

            if (!isFalsy(node.argument)) {
              scopeStack.possibleOfReturnTrue = true
            }
          }
        },
        ':function:exit'(node) {
          if (!scopeStack.possibleOfReturnTrue) {
            const emits = emitsValidators.find((e) => e.value === node)
            if (emits) {
              context.report({
                node,
                message: scopeStack.hasReturnValue
                  ? 'Expected to return a true value in "{{name}}" emits validator.'
                  : 'Expected to return a boolean value in "{{name}}" emits validator.',
                data: {
                  name: emits.emitName
                }
              })
            }
          }

          scopeStack = scopeStack.upper
        }
      })
    )
  }
}
