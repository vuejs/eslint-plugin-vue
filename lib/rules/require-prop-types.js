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
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.3/docs/rules/require-prop-types.md'
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
      const validatorProperty = node.properties
        .find(p => utils.getStaticPropertyName(p.key) === 'validator')
      return Boolean(typeProperty || validatorProperty)
    }

    function checkProperties (items) {
      for (const cp of items) {
        if (cp.type !== 'Property') {
          return
        }
        let hasType = true
        const cpValue = utils.unwrapTypes(cp.value)

        if (cpValue.type === 'ObjectExpression') { // foo: {
          hasType = objectHasType(cpValue)
        } else if (cpValue.type === 'ArrayExpression') { // foo: [
          hasType = cpValue.elements.length > 0
        } else if (cpValue.type === 'FunctionExpression' || cpValue.type === 'ArrowFunctionExpression') {
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
