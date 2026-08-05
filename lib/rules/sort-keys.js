/**
 * @fileoverview enforce sort-keys in a manner that is compatible with order-in-components
 * @author Loren Klingman
 * Original ESLint sort-keys by Toru Nagashima
 */

import naturalCompare from 'natural-compare'
import utils from '../utils/index.js'

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
const orderComparators = {
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
    return orderComparators.asc(b, a)
  },
  descI(a, b) {
    return orderComparators.ascI(b, a)
  },
  descN(a, b) {
    return orderComparators.ascN(b, a)
  },
  descIN(a, b) {
    return orderComparators.ascIN(b, a)
  }
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce sort-keys in a manner that is compatible with order-in-components',
      categories: null,
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
            type: 'boolean'
          },
          ignoreChildrenOf: {
            type: 'array'
          },
          ignoreGrandchildrenOf: {
            type: 'array'
          },
          minKeys: {
            type: 'integer',
            minimum: 2
          },
          natural: {
            type: 'boolean'
          },
          allowLineSeparatedGroups: {
            type: 'boolean'
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

    /** @type {Set<string>} */
    const ignoreGrandchildrenOf = new Set(
      (options && options.ignoreGrandchildrenOf) || [
        'computed',
        'directives',
        'inject',
        'props',
        'watch'
      ]
    )
    /** @type {Set<string>} */
    const ignoreChildrenOf = new Set(
      (options && options.ignoreChildrenOf) || ['model']
    )
    const insensitive = options && options.caseSensitive === false
    const minKeys = options?.minKeys ?? 2
    const natural = options && options.natural
    const allowLineSeparatedGroups =
      (options && options.allowLineSeparatedGroups) || false
    const isValidOrder =
      orderComparators[order + (insensitive ? 'I' : '') + (natural ? 'N' : '')]
    const sourceCode = context.sourceCode

    /**
     * @typedef {object} ObjectStack
     * @property {ObjectStack | null} ObjectStack.upper
     * @property {string | null} ObjectStack.prevName
     * @property {Property | null} ObjectStack.prevNode
     * @property {boolean} ObjectStack.prevBlankLine
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
     * @type {ObjectStack | null}
     */
    let objectStack

    return {
      ObjectExpression(node) {
        /** @type {VueState} */
        const vueState = {}
        const upperVueState = (objectStack && objectStack.vueState) || {}
        objectStack = {
          upper: objectStack,
          prevName: null,
          prevNode: null,
          prevBlankLine: false,
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
                propName = upperVueState.propName || ''
                chainLevel = (upperVueState.chainLevel || 0) + 1
              }
              vueState.propName = propName
              vueState.chainLevel = chainLevel
              // chaining
              vueState.within = true

              // Judge whether to ignore the property.
              if (
                (chainLevel === 1 && ignoreChildrenOf.has(propName)) ||
                (chainLevel === 2 && ignoreGrandchildrenOf.has(propName))
              ) {
                vueState.ignore = true
              }
            } else {
              // chaining has broken.
              vueState.within = false
            }
          }
        }
      },
      'ObjectExpression:exit'() {
        objectStack &&= objectStack.upper
      },
      SpreadElement(node) {
        if (!objectStack) {
          return
        }
        if (node.parent.type === 'ObjectExpression') {
          objectStack.prevName = null
        }
      },
      'ObjectExpression > Property'(node) {
        if (!objectStack) {
          return
        }
        objectStack.vueState.currentProperty = node
        if (objectStack.vueState.ignore) {
          return
        }
        const prevName = objectStack.prevName
        const numKeys = objectStack.numKeys
        const thisName = getPropertyName(node)

        const prevNode = objectStack.prevNode
        let isBlankLineBetweenNodes = objectStack.prevBlankLine

        if (prevNode) {
          const tokens = [
            prevNode,
            ...sourceCode.getTokensBetween(prevNode, node, {
              includeComments: true
            }),
            node
          ]

          isBlankLineBetweenNodes ||= tokens.some((token, index) => {
            if (index === 0) {
              return false
            }
            return token.loc.start.line - tokens[index - 1].loc.end.line > 1
          })
        }

        objectStack.prevNode = node

        if (thisName !== null) {
          objectStack.prevName = thisName
        }

        if (allowLineSeparatedGroups && isBlankLineBetweenNodes) {
          // A computed key (e.g. `[a+b]`) has no name to compare, so it's skipped and doesn't
          // reset the sort. Carry the blank line over; otherwise the next key would be compared
          // against the previous group and wrongly reported as out of order.
          objectStack.prevBlankLine = thisName === null
          return
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
