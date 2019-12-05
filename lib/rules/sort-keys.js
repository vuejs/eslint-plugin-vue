/**
 * @fileoverview enforce sort-keys in a manner that is compatible with order-in-components
 * @author Loren Klingman
 * Original ESLint sort-keys by Toru Nagashima
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const naturalCompare = require('natural-compare')
const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Gets the property name of the given `Property` node.
 *
 * - If the property's key is an `Identifier` node, this returns the key's name
 *   whether it's a computed property or not.
 * - If the property has a static name, this returns the static name.
 * - Otherwise, this returns null.
 * @param {ASTNode} node The `Property` node to get.
 * @returns {string|null} The property name or null.
 * @private
 */
function getPropertyName (node) {
  const staticName = utils.getStaticPropertyName(node)

  if (staticName !== null) {
    return staticName
  }

  return node.key.name || null
}

/**
 * Functions which check that the given 2 names are in specific order.
 *
 * Postfix `I` is meant insensitive.
 * Postfix `N` is meant natual.
 * @private
 */
const isValidOrders = {
  asc (a, b) {
    return a <= b
  },
  ascI (a, b) {
    return a.toLowerCase() <= b.toLowerCase()
  },
  ascN (a, b) {
    return naturalCompare(a, b) <= 0
  },
  ascIN (a, b) {
    return naturalCompare(a.toLowerCase(), b.toLowerCase()) <= 0
  },
  desc (a, b) {
    return isValidOrders.asc(b, a)
  },
  descI (a, b) {
    return isValidOrders.ascI(b, a)
  },
  descN (a, b) {
    return isValidOrders.ascN(b, a)
  },
  descIN (a, b) {
    return isValidOrders.ascIN(b, a)
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce sort-keys in a manner that is compatible with order-in-components',
      category: null,
      recommended: false,
      url: 'https://eslint.vuejs.org/rules/sort-keys.html'
    },
    fixable: null,
    schema: [
      {
        enum: ['asc', 'desc']
      },
      {
        type: 'object',
        properties: {
          caseSensitive: {
            type: 'boolean',
            default: true
          },
          natural: {
            type: 'boolean',
            default: false
          },
          minKeys: {
            type: 'integer',
            minimum: 2,
            default: 2
          },
          runOutsideVue: {
            type: 'boolean',
            default: true
          }
        },
        additionalProperties: false
      }
    ]
  },

  create (context) {
    // Parse options.
    const order = context.options[0] || 'asc'
    const options = context.options[1]
    const insensitive = options && options.caseSensitive === false
    const natual = options && options.natural
    const minKeys = options && options.minKeys
    const isValidOrder = isValidOrders[
      order + (insensitive ? 'I' : '') + (natual ? 'N' : '')
    ]

    // The stack to save the previous property's name for each object literals.
    let stack = null

    let errors = []

    const reportErrors = (isVue) => {
      if (isVue) {
        errors = errors.filter((error) => error.hasUpper)
      }
      errors.forEach((error) => context.report(error))
      errors = []
    }

    const sortTests = {
      ObjectExpression (node) {
        if (!stack) {
          reportErrors(false)
        }
        stack = {
          upper: stack,
          prevName: null,
          numKeys: node.properties.length
        }
      },
      'ObjectExpression:exit' () {
        stack = stack.upper
      },
      SpreadElement (node) {
        if (node.parent.type === 'ObjectExpression') {
          stack.prevName = null
        }
      },
      'Program:exit' () {
        reportErrors(false)
      },
      Property (node) {
        if (node.parent.type === 'ObjectPattern') {
          return
        }

        const prevName = stack.prevName
        const numKeys = stack.numKeys
        const thisName = getPropertyName(node)

        if (thisName !== null) {
          stack.prevName = thisName
        }

        if (prevName === null || thisName === null || numKeys < minKeys) {
          return
        }

        if (!isValidOrder(prevName, thisName)) {
          errors.push({
            node,
            hasUpper: !!stack.upper,
            loc: node.key.loc,
            message: "Expected object keys to be in {{natual}}{{insensitive}}{{order}}ending order. '{{thisName}}' should be before '{{prevName}}'.",
            data: {
              thisName,
              prevName,
              order,
              insensitive: insensitive ? 'insensitive ' : '',
              natual: natual ? 'natural ' : ''
            }
          })
        }
      }
    }

    const execOnVue = utils.executeOnVue(context, (obj) => {
      reportErrors(true)
    })

    const result = { ...sortTests }

    Object.keys(execOnVue).forEach((key) => {
      // Ensure we call both the callback from sortTests and execOnVue if they both use the same key
      if (Object.prototype.hasOwnProperty.call(sortTests, key)) {
        result[key] = (node) => {
          sortTests[key](node)
          execOnVue[key](node)
        }
      } else {
        result[key] = execOnVue[key]
      }
    })

    return result
  }
}
