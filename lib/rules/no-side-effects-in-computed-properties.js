/**
 * @fileoverview Don't introduce side effects in computed properties
 * @author Michał Sajnóg
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef {import('vue-eslint-parser').AST.ESLintObjectExpression} ObjectExpression
 * @typedef {import('vue-eslint-parser').AST.ESLintMemberExpression} MemberExpression
 * @typedef {import('../utils').ComponentComputedProperty} ComponentComputedProperty
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow side effects in computed properties',
      categories: ['vue3-essential', 'essential'],
      url:
        'https://eslint.vuejs.org/rules/no-side-effects-in-computed-properties.html'
    },
    fixable: null,
    schema: []
  },

  create(context) {
    /** @type {Map<ObjectExpression, ComponentComputedProperty[]>} */
    const computedPropertiesMap = new Map()
    let scopeStack = { upper: null, body: null }

    function onFunctionEnter(node) {
      scopeStack = { upper: scopeStack, body: node.body }
    }

    function onFunctionExit() {
      scopeStack = scopeStack.upper
    }

    return utils.defineVueVisitor(context, {
      onVueObjectEnter(node) {
        computedPropertiesMap.set(node, utils.getComputedProperties(node))
      },
      ':function': onFunctionEnter,
      ':function:exit': onFunctionExit,

      'MemberExpression > :matches(Identifier, ThisExpression)'(
        node,
        { node: vueNode }
      ) {
        const targetBody = scopeStack.body
        const computedProperty = computedPropertiesMap
          .get(vueNode)
          .find((cp) => {
            return (
              cp.value &&
              node.loc.start.line >= cp.value.loc.start.line &&
              node.loc.end.line <= cp.value.loc.end.line &&
              targetBody === cp.value
            )
          })
        if (!computedProperty) {
          return
        }

        if (!utils.isThis(node, context)) {
          return
        }
        /** @type {MemberExpression} */
        const mem = node.parent
        if (mem.object !== node) {
          return
        }

        const invalid = utils.findMutating(mem)
        if (invalid) {
          context.report({
            node: invalid.node,
            message: 'Unexpected side effect in "{{key}}" computed property.',
            data: { key: computedProperty.key }
          })
        }
      }
    })
  }
}
