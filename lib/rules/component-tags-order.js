/**
 * @author Yosuke Ota
 * issue https://github.com/vuejs/eslint-plugin-vue/issues/140
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')
const parser = require('postcss-selector-parser')

const DEFAULT_ORDER = Object.freeze([['script', 'template'], 'style'])

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce order of component top-level elements',
      categories: ['vue3-recommended', 'recommended'],
      url: 'https://eslint.vuejs.org/rules/component-tags-order.html'
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'array',
            items: {
              anyOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' }, uniqueItems: true }
              ]
            },
            uniqueItems: true,
            additionalItems: false
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpected:
        '<{{elementName}}{{elementAttributes}}> should be above <{{firstUnorderedName}}{{firstUnorderedAttributes}}> on line {{line}}.'
    }
  },
  /**
   * @param {RuleContext} context - The rule context.
   * @returns {RuleListener} AST event handlers.
   */
  create(context) {
    /** @type {Map<string, number>} */
    const orderMap = new Map()
    /** @type {(string|string[])[]} */
    const orderOptions =
      (context.options[0] && context.options[0].order) || DEFAULT_ORDER
    orderOptions.forEach((nameOrNames, index) => {
      if (Array.isArray(nameOrNames)) {
        for (const name of nameOrNames) {
          orderMap.set(name, index)
        }
      } else {
        orderMap.set(nameOrNames, index)
      }
    })

    /**
     * @param {VElement} element
     * @return {String}
     */
    function getAttributeString(element) {
      return element.startTag.attributes
        .map((attribute) => {
          if (attribute.value && attribute.value.type !== 'VLiteral') {
            return ''
          }

          return `${attribute.key.name}${
            attribute.value && attribute.value.value
              ? '=' + attribute.value.value
              : ''
          }`
        })
        .join(' ')
    }

    /**
     * @param {String} ordering
     * @param {VElement} element
     * @return {Boolean} true if the element matches the selector, false otherwise
     */
    function matches(ordering, element) {
      let attributeMatches = true
      let isNegated = false
      let tagMatches = true

      parser((selectors) => {
        selectors.walk((selector) => {
          switch (selector.type) {
            case 'tag':
              tagMatches = selector.value === element.name
              break
            case 'pseudo':
              isNegated = selector.value === ':not'
              break
            case 'attribute':
              attributeMatches = utils.hasAttribute(
                element,
                selector.qualifiedAttribute,
                selector.value
              )
              break
          }
        })
      }).processSync(ordering)

      if (isNegated) {
        return tagMatches && !attributeMatches
      } else {
        return tagMatches && attributeMatches
      }
    }

    /**
     * @param {VElement} element
     */
    function getOrderPosition(element) {
      for (const [ordering, index] of orderMap.entries()) {
        if (matches(ordering, element)) {
          return index
        }
      }

      return -1
    }
    const documentFragment =
      context.parserServices.getDocumentFragment &&
      context.parserServices.getDocumentFragment()

    function getTopLevelHTMLElements() {
      if (documentFragment) {
        return documentFragment.children.filter(utils.isVElement)
      }
      return []
    }

    return {
      Program(node) {
        if (utils.hasInvalidEOF(node)) {
          return
        }
        const elements = getTopLevelHTMLElements()
        const sourceCode = context.getSourceCode()
        elements.forEach((element, index) => {
          const expectedIndex = getOrderPosition(element)
          if (expectedIndex < 0) {
            return
          }
          const firstUnordered = elements
            .slice(0, index)
            .filter((e) => expectedIndex < getOrderPosition(e))
            .sort((e1, e2) => getOrderPosition(e1) - getOrderPosition(e2))[0]
          if (firstUnordered) {
            const firstUnorderedttributes = getAttributeString(firstUnordered)
            const elementAttributes = getAttributeString(element)

            context.report({
              node: element,
              loc: element.loc,
              messageId: 'unexpected',
              data: {
                elementName: element.name,
                elementAttributes: elementAttributes
                  ? ' ' + elementAttributes
                  : '',
                firstUnorderedName: firstUnordered.name,
                firstUnorderedAttributes: firstUnorderedttributes
                  ? ' ' + firstUnorderedttributes
                  : '',
                line: firstUnordered.loc.start.line
              },
              *fix(fixer) {
                // insert element before firstUnordered
                const fixedElements = elements.flatMap((it) => {
                  if (it === firstUnordered) {
                    return [element, it]
                  } else if (it === element) {
                    return []
                  }
                  return [it]
                })
                for (let i = elements.length - 1; i >= 0; i--) {
                  if (elements[i] !== fixedElements[i]) {
                    yield fixer.replaceTextRange(
                      elements[i].range,
                      sourceCode.text.slice(...fixedElements[i].range)
                    )
                  }
                }
              }
            })
          }
        })
      }
    }
  }
}
