/**
 * @fileoverview Don't use this in a beforeRouteEnter method
 * @author Przemyslaw Jan Beigert
 */
'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const utils = require('../utils')

;('use strict')
/**
 * @param {FunctionExpression | BlockStatement | Property | ThisExpression} obj
 * @returns {boolean}
 */
function deepFindThisExpression(obj) {
  if (typeof obj !== 'object' || !obj) {
    return false
  }
  if (obj.type === 'ThisExpression') {
    return true
  }

  /** @param {typeof obj} key */
  return Object.entries(obj).some(([key, value]) => {
    if (key === 'parent') {
      return false
    }
    if (Array.isArray(value)) {
      return value.some((item) => deepFindThisExpression(item))
    }
    if (typeof value === 'object') {
      return deepFindThisExpression(value)
    }

    return false
  })
}

/**
 * @param {Property | SpreadElement} property
 * @returns {property is Property}
 */
function isPropertyBeforeRouteMethod(property) {
  if (property.type !== 'Property') {
    return false
  }

  return (
    property.key.type === 'Identifier' &&
    property.key.name === 'beforeRouteEnter'
  )
}

const errorMessage =
  'beforeRouteEnter does NOT have access to `this` component instance. https://router.vuejs.org/guide/advanced/navigation-guards.html#in-component-guards'

module.exports = {
  errorMessage,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow this usage in a beforeRouteEnter method',
      categories: null,
      url: 'https://eslint.vuejs.org/rules/no-this-in-before-route-enter.html'
    },
    schema: []
  },

  /** @param {RuleContext} context */
  create(context) {
    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------
    return utils.executeOnVue(context, (obj) => {
      const beforeRouteProperty = obj.properties.find(
        isPropertyBeforeRouteMethod
      )
      if (!beforeRouteProperty) {
        return
      }
      if (beforeRouteProperty.value.type !== 'FunctionExpression') {
        return
      }
      if (deepFindThisExpression(beforeRouteProperty.value.body)) {
        context.report({
          node: beforeRouteProperty,
          message: errorMessage
        })
      }
    })
  }
}
