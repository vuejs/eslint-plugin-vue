/**
 * @fileoverview Prop definitions should be detailed
 * @author Armano
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'require type definitions in props',
      category: 'strongly-recommended',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.5.0/docs/rules/require-prop-types.md'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create (context) {
    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    function objectHasType (node) {
      const typeProperty = node.properties
        .find(p =>
          utils.getStaticPropertyName(p.key) === 'type' &&
          (
            p.value.type !== 'ArrayExpression' ||
            p.value.elements.length > 0
          )
        )
      return Boolean(typeProperty)
    }

    function checkProperties (items) {
      for (const cp of items) {
        if (cp.type !== 'Property') {
          return
        }
        let hasType = true
        if (cp.value.type === 'ObjectExpression') { // foo: {
          hasType = objectHasType(cp.value)
        } else if (cp.value.type === 'ArrayExpression') { // foo: [
          hasType = cp.value.elements.length > 0
        } else if (cp.value.type === 'FunctionExpression' || cp.value.type === 'ArrowFunctionExpression') {
          hasType = false
        }
        if (!hasType) {
          context.report({
            node: cp,
            message: 'Prop "{{name}}" should define at least its type.',
            data: {
              name: cp.key.name
            }
          })
        }
      }
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.executeOnVue(context, (obj) => {
      const node = obj.properties
        .find(p =>
          p.type === 'Property' &&
          p.key.type === 'Identifier' &&
          p.key.name === 'props'
        )

      if (!node) return

      if (node.value.type === 'ObjectExpression') {
        checkProperties(node.value.properties)
      }

      if (node.value.type === 'ArrayExpression') {
        context.report({
          node,
          message: 'Props should at least define their types.'
        })
      }
    })
  }
}
