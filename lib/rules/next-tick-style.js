/**
 * @fileoverview enforce `Vue.nextTick` / `this.$nextTick` style
 * @author Flo Edelmann
 * @copyright 2020 Flo Edelmann. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const { findVariable } = require('eslint-utils/index.js')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * @param {Identifier} identifier
 * @param {RuleContext} context
 * @returns {CallExpression|undefined}
 */
function getVueNextTickCallExpression(identifier, context) {
  // Instance API: this.$nextTick()
  if (
    identifier.name === '$nextTick' &&
    identifier.parent.type === 'MemberExpression' &&
    utils.isThis(identifier.parent.object, context) &&
    identifier.parent.parent.type === 'CallExpression'
  ) {
    return identifier.parent.parent
  }

  // Vue 2 Global API: Vue.nextTick()
  if (
    identifier.name === 'nextTick' &&
    identifier.parent.type === 'MemberExpression' &&
    identifier.parent.object.type === 'Identifier' &&
    identifier.parent.object.name === 'Vue' &&
    identifier.parent.parent.type === 'CallExpression'
  ) {
    return identifier.parent.parent
  }

  // Vue 3 Global API: import { nextTick as nt } from 'vue'; nt()
  if (identifier.parent.type === 'CallExpression') {
    const variable = findVariable(context.getScope(), identifier)

    if (variable != null && variable.defs.length === 1) {
      const def = variable.defs[0]
      if (
        def.type === 'ImportBinding' &&
        def.node.type === 'ImportSpecifier' &&
        def.node.imported.type === 'Identifier' &&
        def.node.imported.name === 'nextTick' &&
        def.node.parent.type === 'ImportDeclaration' &&
        def.node.parent.source.value === 'vue'
      ) {
        return identifier.parent
      }
    }
  }

  return undefined
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce `Vue.nextTick` / `this.$nextTick` style',
      categories: undefined,
      recommended: false,
      url: 'https://eslint.vuejs.org/rules/next-tick-style.html'
    },
    fixable: null,
    schema: [{ enum: ['promise', 'callback'] }]
  },
  /** @param {RuleContext} context */
  create(context) {
    const preferredStyle =
      /** @type {string|undefined} */ (context.options[0]) || 'promise'

    return utils.defineVueVisitor(context, {
      /** @param {Identifier} node */
      Identifier(node) {
        if (!getVueNextTickCallExpression(node, context)) {
          return
        }

        context.report({
          node,
          message:
            'Use the Promise returned by `nextTick` instead of passing a callback function.'
        })
      }
    })
  }
}
