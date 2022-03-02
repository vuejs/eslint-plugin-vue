/**
 * @author Yosuke Ota
 * issue https://github.com/vuejs/eslint-plugin-vue/issues/140
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

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
        'The <{{name}}> should be above the <{{firstUnorderedName}}> on line {{line}}.'
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
     * @param {string} name
     */
    function getOrderPosition(name) {
      const num = orderMap.get(name)
      return num == null ? -1 : num
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
          const expectedIndex = getOrderPosition(element.name)
          if (expectedIndex < 0) {
            return
          }
          const firstUnordered = elements
            .slice(0, index)
            .filter((e) => expectedIndex < getOrderPosition(e.name))
            .sort(
              (e1, e2) => getOrderPosition(e1.name) - getOrderPosition(e2.name)
            )[0]
          if (firstUnordered) {
            context.report({
              node: element,
              loc: element.loc,
              messageId: 'unexpected',
              data: {
                name: element.name,
                firstUnorderedName: firstUnordered.name,
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
