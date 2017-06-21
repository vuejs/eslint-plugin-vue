/**
 * @fileoverview Keep order of properties in components
 * @author Michał Sajnóg
 */
'use strict'

const defaultOrder = [
  ['name', 'delimiters', 'functional', 'model'],
  ['components', 'directives', 'filters'],
  ['parent', 'mixins', 'extends', 'provide', 'inject'],
  'el',
  'template',
  'props',
  'propsData',
  'data',
  'computed',
  'watch',
  'LIFECYCLE_HOOKS',
  'methods',
  'render',
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

function isComponentFile (path) {
  return path.endsWith('.vue') || path.endsWith('.jsx')
}

function isVueComponent (node) {
  return true
}

function isVueInstance (node) {
  return true
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

function checkOrder (propertiesNodes, orderMap, context) {
  const properties = propertiesNodes.map(property => property.key)

  // To be changed - iterate over all properties above the current one
  // which order is higher than the order of current one
  // and get the one with the lowest order
  properties.sort((prevNode, nextNode) => {
    const { name: prevPropName } = prevNode
    const { name: nextPropName } = nextNode
    const nextPropOrder = orderMap.get(nextPropName)
    const prevPropOrder = orderMap.get(prevPropName)
    const prevNodeLine = prevNode.loc.start.line

    if (nextPropOrder < prevPropOrder) {
      context.report(nextNode, `The "${nextPropName}" property should be above the "${prevPropName}" property on line ${prevNodeLine}.`)
    }
  })
}

function create (context) {
  const options = context.options[0] || {}
  const order = options.order || defaultOrder
  const filePath = context.getFilename()

  const extendedOrder = order.map(property => groups[property] || property)
  const orderMap = getOrderMap(extendedOrder)

  return {
    ExportDefaultDeclaration (node) {
      // export default {} in .vue || .jsx
      if (!isComponentFile(filePath)) return
      checkOrder(node.declaration.properties, orderMap, context)
    },
    CallExpression (node) {
      // Vue.component('xxx', {})
      if (!isVueComponent(node)) return
      checkOrder(node.arguments[1].properties, orderMap, context)
    },
    NewExpression (node) {
      // new Vue({})
      if (!isVueInstance(node)) return
      checkOrder(node.arguments[0].properties, orderMap, context)
    }
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create,
  meta: {
    docs: {
      description: 'Keep order of properties in components',
      category: 'Best Practices',
      recommended: true
    },
    fixable: null,
    schema: []
  }
}
