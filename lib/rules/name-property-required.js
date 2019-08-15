/**
 * @fileoverview Require a name property in Vue components
 * @author LukeeeeBennett
 */
'use strict'

const utils = require('../utils')

function isNameProperty (node) {
  return node.type === 'Property' && node.key.name === 'name'
}

function hasTruthyLiteralValue (node) {
  return node.value.type === 'Literal' && node.value.value
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require a name property in Vue components',
      category: undefined,
      url: 'https://eslint.vuejs.org/rules/name-property-required.html'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    return utils.executeOnVue(context, component => {
      const isValid = component.properties.some(property => {
        return isNameProperty(property) &&
          hasTruthyLiteralValue(property)
      })

      if (isValid) return

      context.report({
        node: component,
        message: 'Required name property is undefined.'
      })
    })
  }
}
