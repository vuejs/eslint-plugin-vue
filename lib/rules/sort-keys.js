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
 * @param {Property} node The `Property` node to get.
 * @returns {string|null} The property name or null.
 * @private
 */
function getPropertyName(node) {
  const staticName = utils.getStaticPropertyName(node)

  if (staticName !== null) {
    return staticName
  }

  return node.key.type === 'Identifier' ? node.key.name : null
}

/**
 * Functions which check that the given 2 names are in specific order.
 *
 * Postfix `I` is meant insensitive.
 * Postfix `N` is meant natural.
 * @private
 * @type { { [key: string]: (a:string, b:string) => boolean } }
 */
const isValidOrders = {
  asc(a, b) {
    return a <= b
  },
  ascI(a, b) {
    return a.toLowerCase() <= b.toLowerCase()
  },
  ascN(a, b) {
    return naturalCompare(a, b) <= 0
  },
  ascIN(a, b) {
    return naturalCompare(a.toLowerCase(), b.toLowerCase()) <= 0
  },
  desc(a, b) {
    return isValidOrders.asc(b, a)
  },
  descI(a, b) {
    return isValidOrders.ascI(b, a)
  },
  descN(a, b) {
    return isValidOrders.ascN(b, a)
  },
  descIN(a, b) {
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
      description:
        'enforce sort-keys in a manner that is compatible with order-in-components',
      categories: null,
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
          ignoreChildrenOf: {
            type: 'array'
          },
          ignoreGrandchildrenOf: {
            type: 'array'
          },
          minKeys: {
            type: 'integer',
            minimum: 2,
            default: 2
          },
          natural: {
            type: 'boolean',
            default: false
          },
          runOutsideVue: {
            type: 'boolean',
            default: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      sortKeys:
        "Expected object keys to be in {{natural}}{{insensitive}}{{order}}ending order. '{{thisName}}' should be before '{{prevName}}'."
    }
  },
  /**
   * @param {RuleContext} context - The rule context.
   * @returns {RuleListener} AST event handlers.
   */
  create(context) {
    // Parse options.
    const options = context.options[1]
    const order = context.options[0] || 'asc'

    /** @type {string[]} */
    const ignoreGrandchildrenOf = (options &&
      options.ignoreGrandchildrenOf) || [
      'computed',
      'directives',
      'inject',
      'props',
      'watch'
    ]
    /** @type {string[]} */
    const ignoreChildrenOf = (options && options.ignoreChildrenOf) || ['model']
    const insensitive = options && options.caseSensitive === false
    const minKeys = options && options.minKeys
    const natural = options && options.natural
    const isValidOrder =
      isValidOrders[order + (insensitive ? 'I' : '') + (natural ? 'N' : '')]

    /**
     * @typedef {object} ObjectStack
     * @property {ObjectStack} ObjectStack.upper
     * @property {string | null} ObjectStack.prevName
     * @property {number} ObjectStack.numKeys
     * @property {VueState} ObjectStack.vueState
     *
     * @typedef {object} VueState
     * @property {Property} [VueState.currentProperty]
     * @property {boolean} [VueState.isVueObject]
     * @property {boolean} [VueState.within]
     * @property {string} [VueState.propName]
     * @property {number} [VueState.chainLevel]
     * @property {boolean} [VueState.ignore]
     */

    /**
     * The stack to save the previous property's name for each object literals.
     * @type {ObjectStack}
     */
    let stack

    return {
      ObjectExpression(node) {
        /** @type {VueState} */
        const vueState = {}
        const upperVueState = (stack && stack.vueState) || {}
        stack = {
          upper: stack,
          prevName: null,
          numKeys: node.properties.length,
          vueState
        }

        vueState.isVueObject = utils.getVueObjectType(context, node) != null
        if (vueState.isVueObject) {
          vueState.within = vueState.isVueObject
          // Ignore Vue object properties
          vueState.ignore = true
        } else {
          if (upperVueState.within && upperVueState.currentProperty) {
            const isChain = utils.isPropertyChain(
              upperVueState.currentProperty,
              node
            )
            if (isChain) {
              let propName
              let chainLevel
              if (upperVueState.isVueObject) {
                propName =
                  utils.getStaticPropertyName(upperVueState.currentProperty) ||
                  ''
                chainLevel = 1
              } else {
                propName = upperVueState.propName
                chainLevel = upperVueState.chainLevel + 1
              }
              vueState.propName = propName
              vueState.chainLevel = chainLevel
              // chaining
              vueState.within = true

              // Judge whether to ignore the property.
              if (chainLevel === 1) {
                if (ignoreChildrenOf.includes(propName)) {
                  vueState.ignore = true
                }
              } else if (chainLevel === 2) {
                if (ignoreGrandchildrenOf.includes(propName)) {
                  vueState.ignore = true
                }
              }
            } else {
              // chaining has broken.
              vueState.within = false
            }
          }
        }
      },
      'ObjectExpression:exit'() {
        stack = stack.upper
      },
      SpreadElement(node) {
        if (node.parent.type === 'ObjectExpression') {
          stack.prevName = null
        }
      },
      'ObjectExpression > Property'(node) {
        stack.vueState.currentProperty = node
        if (stack.vueState.ignore) {
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
          context.report({
            node,
            loc: node.key.loc,
            messageId: 'sortKeys',
            data: {
              thisName,
              prevName,
              order,
              insensitive: insensitive ? 'insensitive ' : '',
              natural: natural ? 'natural ' : ''
            }
          })
        }
      }
    }
  }
}
