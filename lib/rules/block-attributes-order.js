/**
 * @fileoverview enforce ordering of block attributes
 * @author Wenlu Wang
 */
'use strict'
const utils = require('../utils')

/**
 * @enum {string}
 */
const WELL_KNOWN_TEMPLATE_ATTRS = {
  functional: 'functional',
  lang: 'lang',
  src: 'src'
}

/**
 * @enum {string}
 */
const WELL_KNOWN_SCRIPT_ATTRS = {
  lang: 'lang',
  setup: 'setup',
  src: 'src'
}

/**
 * @enum {string}
 */
const WELL_KNOWN_STYLE_ATTRS = {
  scoped: 'scoped',
  module: 'module',
  lang: 'lang',
  src: 'src'
}

/**
 * @template {string} T
 * @typedef {T | T[]} OrderItem
 */

/**
 * @typedef WellKnownOrders
 * @property { OrderItem<WELL_KNOWN_TEMPLATE_ATTRS>[] } [template]
 * @property { OrderItem<WELL_KNOWN_SCRIPT_ATTRS>[] } [script]
 * @property { OrderItem<WELL_KNOWN_STYLE_ATTRS>[] } [style]
 */

/**
 * @typedef {WellKnownOrders & Record<string, OrderItem<string>[]>} OrderOptions
 */

/**
 * @typedef UserOptions
 * @property {OrderOptions} [order]
 */

/**
 * Normalizes a given options.
 * @param {UserOptions} [options] An option to parse.
 * @return {OrderOptions}
 */
function normalizeOrderOptions(options) {
  if (!options || !options.order) {
    // Default attribute orders.
    // First item of the list will be the first attributes.
    return {
      template: [
        WELL_KNOWN_TEMPLATE_ATTRS.functional,
        WELL_KNOWN_TEMPLATE_ATTRS.lang,
        WELL_KNOWN_TEMPLATE_ATTRS.src
      ],
      script: [
        WELL_KNOWN_SCRIPT_ATTRS.setup,
        WELL_KNOWN_SCRIPT_ATTRS.lang,
        WELL_KNOWN_SCRIPT_ATTRS.src
      ],
      style: [
        WELL_KNOWN_STYLE_ATTRS.module,
        WELL_KNOWN_STYLE_ATTRS.scoped,
        WELL_KNOWN_STYLE_ATTRS.lang,
        WELL_KNOWN_STYLE_ATTRS.src
      ]
    }
  }
  return options.order
}

/**
 * @param {OrderOptions} order
 */
function normalizeAttributePositions(order) {
  /**
   * @type { Record<string, Record<string, number>> }
   */
  const attributePositions = {}
  for (const [blockName, blockOrder] of Object.entries(order)) {
    /**
     * @type { Record<string, number> }
     */
    const attributePosition = {}
    for (const [i, o] of blockOrder.entries()) {
      if (Array.isArray(o)) {
        for (const attr of o) {
          attributePosition[attr] = i
        }
      } else {
        attributePosition[o] = i
      }
    }
    attributePositions[blockName] = attributePosition
  }
  return attributePositions
}

/**
 * @param {VAttribute | VDirective} attribute
 * @param { Record<string, number> } attributePosition
 * @returns {number | null}
 */
function getPosition(attribute, attributePosition) {
  if (attribute.directive) {
    return null
  }

  return attributePosition[attribute.key.name]
}

/**
 * @param {VStartTag} node
 * @param {Record<string, number>} attributePosition
 */
function getAttributeAndPositionList(node, attributePosition) {
  /**
   * @type {{ attr: (VAttribute | VDirective), position: number }[]}
   */
  const results = []
  for (const attr of node.attributes) {
    const position = getPosition(attr, attributePosition)
    if (position == null) {
      continue
    }
    results.push({ attr, position })
  }
  return results
}

/**
 * @param {RuleContext} context - The rule context.
 * @returns {RuleListener} AST event handlers.
 */
function create(context) {
  const sourceCode = context.getSourceCode()
  const order = normalizeOrderOptions(context.options[0])
  const attributeAndPositions = normalizeAttributePositions(order)

  /**
   * @param {VAttribute | VDirective} node
   * @param {VAttribute | VDirective} previousNode
   */
  function reportIssue(node, previousNode) {
    const currentNodeText = sourceCode.getText(node.key)
    const prevNode = sourceCode.getText(previousNode.key)

    /**
     * @param {RuleFixer} fixer
     */
    function fix(fixer) {
      const attributes = node.parent.attributes

      const previousNodes = attributes.slice(
        attributes.indexOf(previousNode),
        attributes.indexOf(node)
      )
      const moveNodes = [node]
      for (const n of previousNodes) {
        moveNodes.push(n)
      }

      return moveNodes.map((moveNode, index) => {
        const text = sourceCode.getText(moveNode)
        return fixer.replaceText(previousNodes[index] || node, text)
      })
    }

    context.report({
      node,
      message: `Attribute "${currentNodeText}" should go before "${prevNode}".`,
      data: {
        currentNodeText
      },
      fix
    })
  }

  /**
   * @param {VElement} element
   * @returns {void}
   */
  function verify(element) {
    const tag = element.name
    const attributePosition = attributeAndPositions[tag]
    if (!attributePosition) {
      return
    }

    const attributeAndPositionList = getAttributeAndPositionList(
      element.startTag,
      attributePosition
    )
    if (attributeAndPositionList.length <= 1) {
      return
    }

    let { attr: previousNode, position: previousPosition } =
      attributeAndPositionList[0]
    for (let index = 1; index < attributeAndPositionList.length; index++) {
      const { attr, position } = attributeAndPositionList[index]
      if (previousPosition <= position) {
        previousNode = attr
        previousPosition = position
      } else {
        reportIssue(attr, previousNode)
      }
    }
  }

  return utils.defineDocumentVisitor(context, {
    'VDocumentFragment > VElement': verify
  })
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce order of block attributes',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/block-attributes-order.html'
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'object',
            properties: {
              template: {
                type: 'array',
                items: {
                  anyOf: [
                    { enum: Object.values(WELL_KNOWN_TEMPLATE_ATTRS) },
                    { type: 'string' },
                    {
                      type: 'array',
                      items: {
                        anyOf: [
                          { enum: Object.values(WELL_KNOWN_TEMPLATE_ATTRS) },
                          { type: 'string' }
                        ]
                      },
                      uniqueItems: true
                    }
                  ]
                },
                uniqueItems: true
              },
              script: {
                type: 'array',
                items: {
                  anyOf: [
                    { enum: Object.values(WELL_KNOWN_SCRIPT_ATTRS) },
                    { type: 'string' },
                    {
                      type: 'array',
                      items: {
                        anyOf: [
                          { enum: Object.values(WELL_KNOWN_SCRIPT_ATTRS) },
                          { type: 'string' }
                        ]
                      },
                      uniqueItems: true
                    }
                  ]
                },
                uniqueItems: true
              },
              style: {
                type: 'array',
                items: {
                  anyOf: [
                    { enum: Object.values(WELL_KNOWN_STYLE_ATTRS) },
                    { type: 'string' },
                    {
                      type: 'array',
                      items: {
                        anyOf: [
                          { enum: Object.values(WELL_KNOWN_STYLE_ATTRS) },
                          { type: 'string' }
                        ]
                      },
                      uniqueItems: true
                    }
                  ]
                },
                uniqueItems: true
              }
            },
            additionalProperties: {
              type: 'array',
              items: {
                type: 'string'
              },
              uniqueItems: true
            }
          }
        },
        additionalProperties: false
      }
    ]
  },
  create
}
