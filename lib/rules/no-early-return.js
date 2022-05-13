/**
 * @author *****your name*****
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow early `returns` in `setup` and `data` functions',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-early-return.html'
    },
    fixable: null,
    schema: [],
    messages: {
      extraReturnStatement:
        'Only one (unconditional) return statement is allowed in {{ functionType }} function.'
    }
  },

  /** @param {RuleContext} context */
  create(context) {
    const returnStatementLocations = []
    return utils.defineVueVisitor(context, {
      ReturnStatement(node) {
        if (context.getScope().type === 'function') {
          return
        }
        returnStatementLocations.push(node.loc)
      },

      onSetupFunctionExit() {
        if (returnStatementLocations.length === 0) {
          return
        }

        for (const loc of returnStatementLocations) {
          context.report({
            loc,
            messageId: 'extraReturnStatement',
            data: { functionType: 'setup' }
          })
        }
      },
      onVueObjectEnter(node) {
        const dataProperty = utils.findProperty(node, 'data')
        if (
          !dataProperty ||
          (dataProperty.value.type !== 'FunctionExpression' &&
            dataProperty.value.type !== 'ArrowFunctionExpression')
        ) {
          return
        }
        if (
          context.getSourceCode().ast.tokens.filter((t) => t.value === 'return')
            .length > 1
        ) {
          context.report({
            node,
            messageId: 'extraReturnStatement',
            data: { functionType: 'data' }
          })
        }
      }
    })
  }
}
