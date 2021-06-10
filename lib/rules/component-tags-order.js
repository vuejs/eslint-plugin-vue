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

    /**
     *
     *
     * @param {{name: string, index: number}[]} list component tag list of the SFC
     */
    function getSortedTagList(list) {
      list.sort((a, b) => {
        const ao = getOrderPosition(a.name)
        const bo = getOrderPosition(b.name)
        // if two tag has same order, keep the original position
        if (ao === bo) {
          return 0
        } else {
          // else sort the tag position by asc
          return ao - bo
        }
      })
      // if the tag is customize keep the original position
      for (let i = 0; i < list.length; i++) {
        const order = getOrderPosition(list[i].name)
        if (order === -1) {
          const [res] = list.splice(i, 1)

          list.splice(res.index, 0, res)
        }
      }

      return list
    }

    /**
     * @param {VElement} element
     * @param {VElement} firstUnorderedElement
     * @param {string} code
     * @param {number[]} replaceRange
     */
    function report(element, firstUnorderedElement, code, replaceRange) {
      context.report({
        node: element,
        loc: element.loc,
        messageId: 'unexpected',
        data: {
          name: element.name,
          firstUnorderedName: firstUnorderedElement.name,
          line: firstUnorderedElement.loc.start.line
        },
        fix(fixer) {
          return fixer.replaceTextRange(
            [replaceRange[0], replaceRange[1]],
            code
          )
        }
      })
    }

    return {
      Program(node) {
        if (utils.hasInvalidEOF(node)) {
          return
        }
        const elements = getTopLevelHTMLElements()
        /** @type {{element: VElement, firstUnordered: VElement}[]} */
        const reportCandidates = []
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
            reportCandidates.push({ element, firstUnordered })
          }
        })
        if (reportCandidates.length) {
          const replaceRange = [
            elements[0].range[0],
            elements[elements.length - 1].range[1]
          ]
          const sortTagList = getSortedTagList(
            elements.map((element, index) => ({
              name: element.name,
              index
            }))
          )
          const sourceCode = context.getSourceCode().text
          const reOrderedCode = Array.from(
            { length: elements.length },
            (_, i) => {
              const [start, end] = elements[sortTagList[i].index].range
              const code = sourceCode.slice(start, end)
              return code
            }
          ).join('\n')
          reportCandidates.forEach((error) => {
            report(
              error.element,
              error.firstUnordered,
              reOrderedCode,
              replaceRange
            )
          })
        }
      }
    }
  }
}
