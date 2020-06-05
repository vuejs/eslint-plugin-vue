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
    fixable: null,
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
        }
      }
    ],
    messages: {
      unexpected:
        'The <{{name}}> should be above the <{{firstUnorderedName}}> on line {{line}}.'
    }
  },
  create(context) {
    /** @type {Map<string, number} */
    const orderMap = new Map()
    ;(
      (context.options[0] && context.options[0].order) ||
      DEFAULT_ORDER
    ).forEach((nameOrNames, index) => {
      if (Array.isArray(nameOrNames)) {
        for (const name of nameOrNames) {
          orderMap.set(name, index)
        }
      } else {
        orderMap.set(nameOrNames, index)
      }
    })
    const documentFragment =
      context.parserServices.getDocumentFragment &&
      context.parserServices.getDocumentFragment()

    function getTopLevelHTMLElements() {
      if (documentFragment) {
        return documentFragment.children.filter((e) => e.type === 'VElement')
      }
      return []
    }

    function report(element, firstUnorderedElement) {
      context.report({
        node: element,
        loc: element.loc,
        messageId: 'unexpected',
        data: {
          name: element.name,
          firstUnorderedName: firstUnorderedElement.name,
          line: firstUnorderedElement.loc.start.line
        }
      })
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {},
      {
        Program(node) {
          if (utils.hasInvalidEOF(node)) {
            return
          }
          const elements = getTopLevelHTMLElements()

          elements.forEach((element, index) => {
            const expectedIndex = orderMap.get(element.name)
            if (expectedIndex < 0) {
              return
            }
            const firstUnordered = elements
              .slice(0, index)
              .filter((e) => expectedIndex < orderMap.get(e.name))
              .sort(
                (e1, e2) => orderMap.get(e1.name) - orderMap.get(e2.name)
              )[0]
            if (firstUnordered) {
              report(element, firstUnordered)
            }
          })
        }
      }
    )
  }
}
