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

function isComponentFile (node, path) {
  const isVueFile = path.endsWith('.vue') || path.endsWith('.jsx')
  return isVueFile && node.declaration.type === 'ObjectExpression'
}

function isVueComponent (node) {
  const callee = node.callee

  const isFullVueComponent = node.type === 'CallExpression' &&
    callee.type === 'MemberExpression' &&
    callee.object.type === 'Identifier' &&
    callee.object.name === 'Vue' &&
    callee.property.type === 'Identifier' &&
    callee.property.name === 'component' &&
    node.arguments.length &&
    node.arguments.slice(-1)[0].type === 'ObjectExpression'

  const isDestructedVueComponent = callee.type === 'Identifier' &&
    callee.name === 'component'

  return isFullVueComponent || isDestructedVueComponent
}

function isVueInstance (node) {
  const callee = node.callee
  return node.type === 'NewExpression' &&
    callee.type === 'Identifier' &&
    callee.name === 'Vue' &&
    node.arguments.length &&
    node.arguments[0].type === 'ObjectExpression'
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
        message: `The "${property.name}" property should be above the "${firstUnorderedProperty.name}" property on line ${line}.`
      })
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
      if (!isComponentFile(node, filePath)) return
      checkOrder(node.declaration.properties, orderMap, context)
    },
    CallExpression (node) {
      // Vue.component('xxx', {}) || component('xxx', {})
      if (!isVueComponent(node)) return
      checkOrder(node.arguments.slice(-1)[0].properties, orderMap, context)
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
      recommended: false
    },
    fixable: null,
    schema: []
  }
}
