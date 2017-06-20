/**
 * @fileoverview Keep order of properties in components
 * @author Michał Sajnóg
 */
'use strict'

const ORDER = [
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
  'lifecycle_hooks',
  'methods',
  'render',
  'renderError'
]

function isVueFile (path) {
  return path.endsWith('.vue')
}

function normalizeOrder (orderConfig) {
  return orderConfig.reduce((acc, el, i) => {
    if (Array.isArray(el)) {
      const subOrder = el.reduce((acc2, subEl) => {
        acc[subEl] = i
      }, {})
      acc = Object.assign({}, acc, subOrder)
    } else if (el === 'lifecycle_hooks') {
      acc = Object.assign({}, acc, {
        // to be added
      })
    } else {
      acc[el] = i
    }
    return acc
  }, {})
}

function formatProperties (properties, order) {
  return properties
    .map(p => {
      const name = p.key.name
      return [name, order[name], p.key]
    })
}

function create (context) {
  const options = context.options[0] || {}
  const order = options.order || ORDER
  const filePath = context.getFilename()
  const normalizedOrder = normalizeOrder(order)

  return {
    ExportDefaultDeclaration (node) {
      if (!isVueFile(filePath)) return
      const properties = formatProperties(node.declaration.properties, normalizedOrder)

      properties.sort((prev, next) => {
        const [prevPropName, prevPropOrder, prevNode] = prev
        const [nextPropName, nextPropOrder, nextNode] = next
        const prevNodeLine = prevNode.loc.start.line

        if (nextPropOrder < prevPropOrder) {
          context.report(nextNode, `The "${nextPropName}" property should be above the "${prevPropName}" property on line ${prevNodeLine}.`)
        }
      })
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
      category: 'Best practices',
      recommended: true
    },
    fixable: null,
    schema: []
  }
}
