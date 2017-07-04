/**
 * @fileoverview Don't introduce side effects in computed properties
 * @author Michał Sajnóg
 */
'use strict'

const utils = require('../utils')

function getComputedProperties (componentProperties) {
  const computedPropertiesNode = componentProperties
    .filter(p =>
      p.key.type === 'Identifier' &&
      p.key.name === 'computed' &&
      p.value.type === 'ObjectExpression'
    )[0]

  if (!computedPropertiesNode) { return [] }

  const computedProperties = computedPropertiesNode.value.properties

  return computedProperties.map(cp => {
    const key = cp.key.name
    let value

    if (cp.value.type === 'FunctionExpression') {
      value = cp.value.body.body
    } else if (cp.value.type === 'ObjectExpression') {
      value = cp.value.properties
        .filter(p =>
          p.key.type === 'Identifier' &&
          p.key.name === 'get' &&
          p.value.type === 'FunctionExpression'
        )
        .map(p => p.value.body.body)[0]
    }

    return { key, value }
  })
}

function create (context) {
  return utils.executeOnVueComponent(context, (properties) => {
    const computedProperties = getComputedProperties(properties)
    // to be continued...
  })
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create,
  meta: {
    docs: {
      description: 'Don\'t introduce side effects in computed properties',
      category: 'Best Practices',
      recommended: false
    },
    fixable: null,
    schema: []
  }
}
