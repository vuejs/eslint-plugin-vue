/**
 * @fileoverview warn variable definitions of v-for directives or scope attributes if those are not used.
 * @author 薛定谔的猫<hh_2013@foxmail.com>
 */
'use strict'

const utils = require('../utils')

/**
 * Collect used variables recursively.
 *
 * @param {Node} node - The node to collect.
 * @param {Object} used - The object to restore result.
 * @returns {Object} used variables.
 */
function collectUsed (node, used) {
  if (node.type === 'VExpressionContainer') {
    node.references.forEach(ref => {
      used[ref.id.name] = true
    })
  }

  if (node.type === 'VElement') {
    node.children.forEach(child => collectUsed(child, used))
  }

  return used
}

/**
 * Creates AST event handlers for require-v-for-key.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  utils.registerTemplateBodyVisitor(context, {
    "VAttribute[directive=true][key.name='for']": function (node) {
      const vars = node.value.expression.left
      const used = collectUsed(node.parent.parent, {})

      // report unused.
      vars.filter(v => !used[v.name]).forEach(v => {
        context.report({
          node,
          loc: v.loc,
          message: `'{{name}}' is defined but never used.`,
          data: {
            name: v.name
          }
        })
      })
    },

    "VAttribute[directive=false][key.name='scope']": function (node) {
      const used = collectUsed(node.parent.parent, {})

      if (!used[node.value.value]) {
        context.report({
          node,
          loc: node.value.loc,
          message: `'{{name}}' is defined but never used.`,
          data: {
            name: node.value.value
          }
        })
      }
    }
  })

  return {}
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
