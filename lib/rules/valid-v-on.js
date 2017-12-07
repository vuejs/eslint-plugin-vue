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

const VALID_MODIFIERS = new Set([
  'stop', 'prevent', 'capture', 'self', 'ctrl', 'shift', 'alt', 'meta',
  'native', 'once', 'left', 'right', 'middle', 'passive', 'esc', 'tab',
  'enter', 'space', 'up', 'left', 'right', 'down', 'delete', 'exact'
])
const VERB_MODIFIERS = new Set([
  'stop', 'prevent'
])

/**
 * Creates AST event handlers for valid-v-on.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  return utils.defineTemplateBodyVisitor(context, {
    "VAttribute[directive=true][key.name='on']" (node) {
      for (const modifier of node.key.modifiers) {
        if (!VALID_MODIFIERS.has(modifier) && !Number.isInteger(parseInt(modifier, 10))) {
          context.report({
            node,
            loc: node.loc,
            message: "'v-on' directives don't support the modifier '{{modifier}}'.",
            data: { modifier }
          })
        }
      }
      if (!utils.hasAttributeValue(node) && !node.key.modifiers.some(VERB_MODIFIERS.has, VERB_MODIFIERS)) {
        context.report({
          node,
          loc: node.loc,
          message: "'v-on' directives require that attribute value or verb modifiers."
        })
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
      description: 'enforce valid `v-on` directives',
      category: 'essential'
    },
    fixable: false,
    schema: []
  }
}
