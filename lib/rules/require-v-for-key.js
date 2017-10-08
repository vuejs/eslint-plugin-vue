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
  if (element.name === 'template' || element.name === 'slot') {
    for (const child of element.children) {
      if (child.type === 'VElement') {
        checkKey(context, child)
      }
    }
  } else if (!utils.isCustomComponent(element) && !utils.hasDirective(element, 'bind', 'key')) {
    context.report({
      node: element.startTag,
      loc: element.startTag.loc,
      message: "Elements in iteration expect to have 'v-bind:key' directives."
    })
  }
}

/**
 * Creates AST event handlers for require-v-for-key.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  return utils.defineTemplateBodyVisitor(context, {
    "VAttribute[directive=true][key.name='for']" (node) {
      checkKey(context, node.parent.parent)
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
      description: 'require `v-bind:key` with `v-for` directives',
      category: 'essential'
    },
    fixable: false,
    schema: []
  }
}
