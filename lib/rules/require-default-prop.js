/**
 * @fileoverview Require default value for props
 * @author Michał Sajnóg <msajnog93@gmail.com> (http://github.com/michalsnik)
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'require default value for props',
      category: 'strongly-recommended'
    },
    fixable: null,  // or "code" or "whitespace"
    schema: []
  },

  create: function (context) {
    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    /**
     * Checks if the passed prop is required
     * @param {Property} prop - Property AST node for a single prop
     * @return {boolean}
     */
    function propIsRequired (prop) {
      const propRequiredNode = prop.value.properties
        .find(p =>
          p.type === 'Property' &&
          p.key.name === 'required' &&
          p.value.type === 'Literal' &&
          p.value.value === true
        )

      return Boolean(propRequiredNode)
    }

    /**
     * Checks if the passed prop has a defualt value
     * @param {Property} prop - Property AST node for a single prop
     * @return {boolean}
     */
    function propHasDefault (prop) {
      const propDefaultNode = prop.value.properties
        .find(p => p.key.name === 'default')

      return Boolean(propDefaultNode)
    }

    /**
     * Finds all props that don't have a default value set
     * @param {Property} propsNode - Vue component's "props" node
     * @return {boolean}
     */
    function findPropsWithoutDefaultValue (propsNode) {
      return propsNode.value.properties
        .filter(prop => prop.type === 'Property')
        .filter(prop => {
          if (prop.value.type !== 'ObjectExpression') {
            return true
          }

          return !propIsRequired(prop) && !propHasDefault(prop)
        })
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.executeOnVue(context, (obj) => {
      const propsNode = obj.properties
        .find(p =>
          p.type === 'Property' &&
          p.key.type === 'Identifier' &&
          p.key.name === 'props' &&
          p.value.type === 'ObjectExpression'
        )

      if (!propsNode) return

      const propsWithoutDefault = findPropsWithoutDefaultValue(propsNode)

      propsWithoutDefault.forEach(prop => {
        context.report({
          node: prop,
          message: `Prop '{{propName}}' requires default value to be set.`,
          data: {
            propName: prop.key.name
          }
        })
      })
    })
  }
}
