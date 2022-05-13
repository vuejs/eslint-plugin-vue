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
      description: 'disallow early returns in setup and data functions',
      categories: undefined,
      url: ''
    },
    fixable: null,
    schema: []
  },

  /** @param {RuleContext} context */
  create(context) {
    const rStatementLocs = []
    return utils.compositingVisitors(
      utils.defineVueVisitor(context, {
        ReturnStatement (node) {
          if (context.getScope().type === 'function') {
            return
          }
          rStatementLocs.push(node.loc)
        },

        onSetupFunctionExit() {
          if (!rStatementLocs.length) {
            return
          }

          for (const loc of rStatementLocs) {
            context.report({
              loc,
              message: 'Extra return statement in setup function.'
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
          if (context.getSourceCode().ast.tokens.filter(t => t.value === 'return').length > 1) {
            context.report({
                node,
                message: 'Extra return statement in data function.'
            })
          }
        },
      })
    )
  }
}
