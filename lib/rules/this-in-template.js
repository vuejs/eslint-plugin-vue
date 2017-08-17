/**
 * @fileoverview enforce usage of `this` in template.
 * @author Armano
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
    docs: {
      description: 'enforce usage of `this` in template.',
      category: 'Best Practices',
      recommended: false
    },
    fixable: null,
    schema: [
      {
        enum: ['always', 'never']
      }
    ]
  },

  /**
   * Creates AST event handlers for this-in-template.
   *
   * @param {RuleContext} context - The rule context.
   * @returns {Object} AST event handlers.
   */
  create (context) {
    const options = context.options[0] !== 'always' ? 'never' : 'always'
    let scope = {
      parent: null,
      nodes: []
    }

    function validateNever () {
      return {
        'VExpressionContainer ThisExpression' (node) {
          if (options === 'never') {
            context.report({
              node,
              loc: node.loc,
              message: "Unexpected usage of 'this'."
            })
          }
        }
      }
    }

    function validateAlways () {
      return {
        'VExpressionContainer' (node) {
          if (node.references && options === 'always') {
            for (const reference of node.references) {
              if (!scope.nodes.some(node => node.name === reference.id.name)) {
                context.report({
                  node: reference.id,
                  loc: reference.id.loc,
                  message: "Expected 'this'."
                })
              }
            }
          }
        },
        VElement (node) {
          scope = {
            parent: scope,
            nodes: scope.nodes.slice() // make copy
          }
          if (node.variables) {
            for (const variable of node.variables) {
              const varNode = variable.id
              const name = varNode.name
              if (!scope.nodes.some(node => node.name === name)) { // Prevent adding duplicates
                scope.nodes.push(varNode)
              }
            }
          }
        },
        'VElement:exit' (node) {
          scope = scope.parent
        }
      }
    }

    utils.registerTemplateBodyVisitor(context, options === 'never' ? validateNever() : validateAlways())

    return {}
  }
}
