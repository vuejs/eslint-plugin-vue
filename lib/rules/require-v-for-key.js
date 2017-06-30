/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Check the given element about `v-bind:key` attributes.
 * @param {RuleContext} context The rule context to report.
 * @param {ASTNode} element The element node to check.
 */
function checkKey (context, element) {
  const startTag = element.startTag

  if (startTag.id.name !== 'template' && !utils.isCustomComponent(startTag) && !utils.hasDirective(startTag, 'bind', 'key')) {
    context.report({
      node: startTag,
      loc: startTag.loc,
      message: "Elements in iteration expect to have 'v-bind:key' directives."
    })
  }
}

/**
 * Creates AST event handlers for require-v-for-key.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create (context) {
  utils.registerTemplateBodyVisitor(context, {
    "VAttribute[directive=true][key.name='for']" (node) {
      const element = node.parent.parent

      checkKey(context, element)
      if (element.startTag.id.name === 'template') {
        for (const child of element.children) {
          if (child.type === 'VElement') {
            checkKey(context, child)
          }
        }
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
      description: 'require `v-bind:key` with `v-for` directives.',
      category: 'Best Practices',
      recommended: true
    },
    fixable: false,
    schema: []
  }
}
