/**
 * @author Marton Csordas
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * @typedef { { name: string, loc: SourceLocation, type: string, value: number } } ComputedProperty
 * @typedef { Object.<string, number> } OrderValue
 */

const ATTRS = {
  NORMAL: 'NORMAL',
  GETTERS_SETTERS: 'GETTERS_SETTERS',
  MAP_GETTERS: 'MAP_GETTERS',
  MAP_STATE: 'MAP_STATE'
}

/**
 * @param {Property} property
 */
function isFunctionExpression(property) {
  return property.value.type === 'FunctionExpression'
}

/**
 * This function will collect and return information for all computed
 * properties.
 * @param {ObjectExpression} obj
 * @param {string[]} order
 * @param {OrderValue} orderValue
 */
function collectProperties(obj, order, orderValue) {
  /** @type ComputedProperty[] */
  const properties = []

  const nodes = utils.getComputedPropertyNodes(obj)
  nodes.forEach((node) => {
    let name = null
    let loc = null
    let type = null

    if (node.type === 'Property') {
      const prop = node.value
      name = utils.getStaticPropertyName(node)
      loc = node.loc
      if (prop.type === 'FunctionExpression') {
        type = ATTRS.NORMAL
      } else if (prop.type === 'ObjectExpression') {
        if (
          utils.findProperty(prop, 'get', isFunctionExpression) ||
          utils.findProperty(prop, 'set', isFunctionExpression)
        ) {
          type = ATTRS.GETTERS_SETTERS
        }
      }
    } else if (node.type === 'SpreadElement') {
      const arg = node.argument
      loc = node.loc
      if (arg.type === 'CallExpression' && arg.callee.type === 'Identifier') {
        name = arg.callee.name
        if (name === 'mapGetters') {
          type = ATTRS.MAP_GETTERS
        } else if (name === 'mapState') {
          type = ATTRS.MAP_STATE
        }
      }
    }

    if (type && name && loc) {
      properties.push({
        name,
        loc,
        type,
        value: type in orderValue ? orderValue[type] : order.length
      })
    }
  })

  return properties
}

/**
 * This function will check the properties order by using an 'Insertion sort'
 * algorithm and report errors if a property is not in the right place.
 * @param {ComputedProperty[]} properties
 * @param {RuleContext} context
 */
function checkOrder(properties, context) {
  let i, j, val
  for (i = 1; i < properties.length; i++) {
    val = properties[i]

    j = i - 1
    while (j >= 0 && properties[j].value > val.value) {
      properties[j + 1] = properties[j]
      j = j - 1
    }

    if (j + 1 !== i) {
      properties[j + 1] = val

      context.report({
        loc: val.loc,
        messageId: 'unexpected',
        data: {
          name: val.name,
          other: properties[j + 2].name,
          line: properties[j + 1].loc.start.line
        }
      })
    }
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce order of computed properties.',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/order-in-computed.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'array',
            items: {
              enum: Object.values(ATTRS),
              uniqueItems: true,
              additionalItems: false
            }
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpected:
        'The "{{name}}" property in line {{line}} should be above the "{{other}}" property.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    let order = [
      ATTRS.MAP_GETTERS,
      ATTRS.MAP_STATE,
      ATTRS.GETTERS_SETTERS,
      ATTRS.NORMAL
    ]
    if (context.options[0] && context.options[0].order) {
      order = context.options[0].order
    }

    /** @type OrderValue */
    const orderValue = {}
    order.forEach((o, idx) => (orderValue[o] = idx))

    return utils.defineVueVisitor(context, {
      onVueObjectEnter(obj) {
        const properties = collectProperties(obj, order, orderValue)
        checkOrder(properties, context)
      }
    })
  }
}
