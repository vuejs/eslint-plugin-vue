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
 * @private
 */
function getPropertyName(node: Property): string | null {
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
 */
const orderComparators: { [key: string]: (a: string, b: string) => boolean } = {
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
            type: 'array',
            items: { type: 'string' }
          },
          ignoreGrandchildrenOf: {
            type: 'array',
            items: { type: 'string' }
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
  create(context: RuleContext): RuleListener {
    // Parse options.
    const options = context.options[1]
    const order = context.options[0] || 'asc'

    const ignoreGrandchildrenOf = new Set<string>(
      (options && options.ignoreGrandchildrenOf) || [
        'computed',
        'directives',
        'inject',
        'props',
        'watch'
      ]
    )
    const ignoreChildrenOf = new Set<string>(
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

    interface ObjectStack {
      upper: ObjectStack | null
      prevName: string | null
      prevNode: Property | null
      prevBlankLine: boolean
      numKeys: number
      vueState: VueState
    }

    interface VueState {
      currentProperty?: Property
      isVueObject?: boolean
      within?: boolean
      propName?: string
      chainLevel?: number
      ignore?: boolean
    }

    /**
     * The stack to save the previous property's name for each object literals.
     */
    let objectStack: ObjectStack | null

    return {
      ObjectExpression(node) {
        const vueState: VueState = {}
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
      'ObjectExpression > Property'(node: Property) {
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

          isBlankLineBetweenNodes ||= tokens.some(
            (token, index) =>
              index !== 0 &&
              token.loc.start.line - tokens[index - 1].loc.end.line > 1
          )
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
