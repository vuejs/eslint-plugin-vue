/**
 * @fileoverview enforce ordering of block attributes
 * @author Wenlu Wang
 */
'use strict'
const utils = require('../utils')
const { parseSelector } = require('../utils/selector')

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
 * @typedef UserOrderOption
 * @property { string } element
 * @property { (string | string[])[] } order
 */

/**
 * @typedef {import('../utils/selector').VElementSelector} VElementSelector
 */

/**
 * @typedef OrderOption
 * @property {string} element
 * @property {(string | string[])[]} order
 * @property {(RegExp | RegExp[])[]} regexOrder
 * @property {VElementSelector} selector
 */

/**
 * @type {readonly UserOrderOption[]}
 */
const defaultOptions = Object.freeze([
  {
    element: 'style',
    order: [
      WELL_KNOWN_STYLE_ATTRS.module,
      WELL_KNOWN_STYLE_ATTRS.scoped,
      WELL_KNOWN_STYLE_ATTRS.lang,
      WELL_KNOWN_STYLE_ATTRS.src
    ]
  },
  {
    element: 'script',
    order: [
      WELL_KNOWN_SCRIPT_ATTRS.setup,
      WELL_KNOWN_SCRIPT_ATTRS.lang,
      WELL_KNOWN_SCRIPT_ATTRS.src
    ]
  },
  {
    element: 'template',
    order: [
      WELL_KNOWN_TEMPLATE_ATTRS.functional,
      WELL_KNOWN_TEMPLATE_ATTRS.lang,
      WELL_KNOWN_TEMPLATE_ATTRS.src
    ]
  }
])

/**
 *
 * @param {string | string[]} item
 * @return {RegExp | RegExp[]}
 */
function ordersToRegexOrders(item) {
  return Array.isArray(item) ? item.map((x) => new RegExp(x)) : new RegExp(item)
}

/**
 * @param {UserOrderOption} option
 * @param {RuleContext} context
 * @return {OrderOption}
 */
function normalizeUserOrderOption(option, context) {
  return {
    ...option,
    selector: parseSelector(option.element, context),
    regexOrder: option.order.map(ordersToRegexOrders)
  }
}

/**
 * @param {readonly UserOrderOption[] | undefined} options
 * @param {RuleContext} context
 * @returns {OrderOption[]}
 */
function normalizeUserOrderOptions(options, context) {
  if (!options) {
    return []
  }
  return options.map((option) => normalizeUserOrderOption(option, context))
}

/**
 * @param {OrderOption} option
 * @param {VElement} elementName
 * @returns {boolean}
 */
function matchOrderOption(option, elementName) {
  return option.selector.test(elementName)
}

/**
 * @param {VAttribute | VDirective} attribute
 * @param {OrderOption} orderOption
 * @returns {number | undefined}
 */
function getMatchedAttributePosition(attribute, orderOption) {
  if (attribute.directive) {
    return undefined
  }

  const name = attribute.key.name
  for (const [i, item] of orderOption.regexOrder.entries()) {
    if (Array.isArray(item)) {
      if (item.some((x) => x.test(name))) {
        return i
      }
    } else if (item.test(name)) {
      return i
    }
  }
  return undefined
}

/**
 * @param {VStartTag} node
 * @param {OrderOption} orderOption
 */
function getAttributeAndPositionList(node, orderOption) {
  /**
   * @type {{ attr: (VAttribute | VDirective), position: number }[]}
   */
  const results = []
  for (const attr of node.attributes) {
    const position = getMatchedAttributePosition(attr, orderOption)
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
  const normalizedDefaultOptions = normalizeUserOrderOptions(
    defaultOptions,
    context
  )
  const normalizedOrderOptions = normalizeUserOrderOptions(
    context.options[0],
    context
  )

  /**
   * @param {VElement} element
   * @returns {OrderOption | undefined}
   */
  function getMatchedOrderOption(element) {
    const matchedOption = normalizedOrderOptions.find((option) =>
      matchOrderOption(option, element)
    )
    if (matchedOption) {
      return matchedOption
    }
    return normalizedDefaultOptions.find((option) =>
      matchOrderOption(option, element)
    )
  }

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
    const orderOption = getMatchedOrderOption(element)
    if (!orderOption) {
      return
    }

    const attributeAndPositionList = getAttributeAndPositionList(
      element.startTag,
      orderOption
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
        type: 'array',
        items: {
          type: 'object',
          properties: {
            element: {
              type: 'string'
            },
            order: {
              type: 'array',
              items: {
                anyOf: [
                  {
                    type: 'string'
                  },
                  {
                    type: 'array',
                    items: {
                      type: 'string'
                    },
                    uniqueItems: true
                  }
                ],
                uniqueItems: true
              }
            }
          },
          additionalProperties: false
        }
      }
    ]
  },
  create
}
