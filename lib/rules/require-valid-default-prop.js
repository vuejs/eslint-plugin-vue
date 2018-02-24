/**
 * @fileoverview Enforces props default values to be valid.
 * @author Armano
 */
'use strict'
const utils = require('../utils')

const NATIVE_TYPES = new Set([
  'String',
  'Number',
  'Boolean',
  'Function',
  'Object',
  'Array',
  'Symbol'
])

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'enforce props default values to be valid',
      category: 'essential',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.3.0/docs/rules/require-valid-default-prop.md'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    function isPropertyIdentifier (node) {
      return node.type === 'Property' && node.key.type === 'Identifier'
    }

    function getPropertyNode (obj, name) {
      return obj.properties.find(p =>
        isPropertyIdentifier(p) &&
        p.key.name === name
      )
    }

    function getTypes (node) {
      if (node.type === 'Identifier') {
        return [node.name]
      } else if (node.type === 'ArrayExpression') {
        return node.elements
          .filter(item => item.type === 'Identifier')
          .map(item => item.name)
      }
      return []
    }

    function ucFirst (text) {
      return text[0].toUpperCase() + text.slice(1)
    }

    function getValueType (node) {
      if (node.type === 'CallExpression') { // Symbol(), Number() ...
        if (node.callee.type === 'Identifier' && NATIVE_TYPES.has(node.callee.name)) {
          return node.callee.name
        }
      } else if (node.type === 'TemplateLiteral') { // String
        return 'String'
      } else if (node.type === 'Literal') { // String, Boolean, Number
        if (node.value === null) return null
        const type = ucFirst(typeof node.value)
        if (NATIVE_TYPES.has(type)) {
          return type
        }
      } else if (node.type === 'ArrayExpression') { // Array
        return 'Array'
      } else if (node.type === 'ObjectExpression') { // Object
        return 'Object'
      }
      // FunctionExpression, ArrowFunctionExpression
      return null
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.executeOnVue(context, obj => {
      const props = obj.properties.find(p =>
        isPropertyIdentifier(p) &&
        p.key.name === 'props' &&
        p.value.type === 'ObjectExpression'
      )
      if (!props) return

      const properties = props.value.properties.filter(p =>
        isPropertyIdentifier(p) &&
        p.value.type === 'ObjectExpression'
      )

      for (const prop of properties) {
        const type = getPropertyNode(prop.value, 'type')
        if (!type) continue

        const typeNames = new Set(getTypes(type.value)
          .map(item => item === 'Object' || item === 'Array' ? 'Function' : item) // Object and Array require function
          .filter(item => NATIVE_TYPES.has(item)))

        // There is no native types detected
        if (typeNames.size === 0) continue

        const def = getPropertyNode(prop.value, 'default')
        if (!def) continue

        const defType = getValueType(def.value)
        if (!defType || typeNames.has(defType)) continue

        context.report({
          node: def,
          message: "Type of the default value for '{{name}}' prop must be a {{types}}.",
          data: {
            name: prop.key.name,
            types: Array.from(typeNames).join(' or ').toLowerCase()
          }
        })
      }
    })
  }
}
