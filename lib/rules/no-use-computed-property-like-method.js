/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const { defineVueVisitor, getComputedProperties } = require('../utils')

/**
 * @typedef {import('../utils').ComponentComputedProperty} ComponentComputedProperty
 * @typedef {import('../utils').ComponentObjectProp} ComponentObjectProp
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce',
      categories: undefined,
      url:
        'https://eslint.vuejs.org/rules/no-use-computed-property-like-method.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Does not allow to use computed with this expression.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {BlockStatement | Expression} body
     */
    /** @type {Map<ObjectExpression, ComponentComputedProperty[]>} */
    const computedPropertiesMap = new Map()

    return defineVueVisitor(context, {
      onVueObjectEnter(node) {
        computedPropertiesMap.set(node, getComputedProperties(node))
      },

      /** @param {MemberExpression} node */
      'MemberExpression[object.type="ThisExpression"]'(
        node,
        { node: vueNode }
      ) {
        if (node.property.type !== 'Identifier') return
        if (node.parent.type !== 'CallExpression') return

        const computedProperties = computedPropertiesMap
          .get(vueNode)
          .map((item) => item.key)

        if (!computedProperties.includes(node.property.name)) return

        context.report({
          node: node.property,
          loc: node.property.loc,
          messageId: 'unexpected'
        })
      }
    })
  }
}
