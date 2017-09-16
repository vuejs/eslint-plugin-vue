/**
 * @fileoverview warn variable definitions of v-for directives or scope attributes if those are not used.
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */
'use strict'

const utils = require('../utils')

/**
 * Creates AST event handlers for require-v-for-key.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  const stack = []
  let unused = []

  return utils.defineTemplateBodyVisitor(context, {
    'VElement:exit' () {
      unused
        .forEach((node) => {
          context.report({
            node,
            loc: node.loc,
            message: `'{{name}}' is defined but never used.`,
            data: {
              name: node.name
            }
          })
        })
      unused = stack.pop()
    },
    VElement (node) {
      stack.push(unused)
      unused = []
      if (node.variables) {
        for (const variable of node.variables) {
          unused.push(variable.id)
        }
      }
    },
    VExpressionContainer (node) {
      if (node.references) {
        for (const reference of node.references) {
          if (reference.mode !== 'w') {
            const name = reference.id.name
            unused = unused.filter((el) => el.name !== name)
            stack.forEach((list, i) => {
              stack[i] = list.filter((el) => el.name !== name)
            })
          }
        }
      }
    }
  })
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create,
  meta: {
    docs: {
      description: 'warn variable definitions of v-for directives or scope attributes if those are not used',
      category: 'Possible Errors',
      recommended: false
    },
    fixable: null,
    schema: []
  }
}
