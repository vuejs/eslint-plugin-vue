/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
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
 * Creates AST event handlers for no-template-key.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {Object} AST event handlers.
 */
function create (context) {
  return utils.defineTemplateBodyVisitor(context, {
    "VElement[name='template']" (node) {
      if (utils.hasAttribute(node, 'key') || utils.hasDirective(node, 'bind', 'key')) {
        context.report({
          node: node,
          loc: node.loc,
          message: "'<template>' cannot be keyed. Place the key on real elements instead."
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
      description: 'disallow `key` attribute on `<template>`',
      category: 'essential'
    },
    fixable: false,
    schema: []
  }
}
