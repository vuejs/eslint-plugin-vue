/**
 * @fileoverview Keep order of properties in components
 * @author Michał Sajnóg
 */
'use strict'

const utils = require('../utils')

const defaultOrder = [
  'el',
  'name',
  'parent',
  'functional',
  ['delimiters', 'comments'],
  ['components', 'directives', 'filters'],
  'extends',
  'mixins',
  'inheritAttrs',
  'model',
  ['props', 'propsData'],
  'data',
  'computed',
  'watch',
  'LIFECYCLE_HOOKS',
  'methods',
  ['template', 'render'],
  'renderError'
]

const groups = {
  LIFECYCLE_HOOKS: [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'beforeDestroy',
    'destroyed'
  ]
}

function getOrderMap (order) {
  const orderMap = new Map()

  order.forEach((property, i) => {
    if (Array.isArray(property)) {
      property.forEach(p => orderMap.set(p, i))
    } else {
      orderMap.set(property, i)
    }
  })

  return orderMap
}

function isComma (node) {
  return node.type === 'Punctuator' && node.value === ','
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'enforce order of properties in components',
      category: 'recommended',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.2.2/docs/rules/order-in-components.md'
    },
    fixable: 'code', // null or "code" or "whitespace"
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'array'
          }
        },
        additionalProperties: false
      }
    ]
  },

  create (context) {
    const options = context.options[0] || {}
    const order = options.order || defaultOrder
    const extendedOrder = order.map(property => groups[property] || property)
    const orderMap = getOrderMap(extendedOrder)
    const sourceCode = context.getSourceCode()

    function checkOrder (propertiesNodes, orderMap) {
      const properties = propertiesNodes
        .filter(property => property.type === 'Property')
        .map(property => property.key)

      properties.forEach((property, i) => {
        const propertiesAbove = properties.slice(0, i)
        const unorderedProperties = propertiesAbove
          .filter(p => orderMap.get(p.name) > orderMap.get(property.name))
          .sort((p1, p2) => orderMap.get(p1.name) > orderMap.get(p2.name))

        const firstUnorderedProperty = unorderedProperties[0]

        if (firstUnorderedProperty) {
          const line = firstUnorderedProperty.loc.start.line
          context.report({
            node: property,
            message: `The "{{name}}" property should be above the "{{firstUnorderedPropertyName}}" property on line {{line}}.`,
            data: {
              name: property.name,
              firstUnorderedPropertyName: firstUnorderedProperty.name,
              line
            },
            fix (fixer) {
              const propertyNode = property.parent
              const comma = sourceCode.getTokenAfter(propertyNode)
              const hasAfterComma = isComma(comma)

              const codeStart = sourceCode.getTokenBefore(propertyNode).range[1] // to include comments
              const codeEnd = hasAfterComma ? comma.range[1] : propertyNode.range[1]

              const propertyCode = sourceCode.text.slice(codeStart, codeEnd) + (hasAfterComma ? '' : ',')
              const insertTarget = sourceCode.getTokenBefore(firstUnorderedProperty.parent)
              // If we can upgrade requirements to `eslint@>4.1.0`, this code can be replaced by:
              // return [
              //   fixer.removeRange([codeStart, codeEnd]),
              //   fixer.insertTextAfter(insertTarget, propertyCode)
              // ]
              const insertStart = insertTarget.range[1]
              const newCode = propertyCode + sourceCode.text.slice(insertStart, codeStart)
              return fixer.replaceTextRange([insertStart, codeEnd], newCode)
            }
          })
        }
      })
    }

    return utils.executeOnVue(context, (obj) => {
      checkOrder(obj.properties, orderMap)
    })
  }
}
