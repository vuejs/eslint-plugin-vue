/**
 * @fileoverview Enforce component opening tags with a single attribute to be on a single line
 * @author Jackson Gross
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
const utils = require('../utils')

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description:
        'enforce component opening tags with a single attribute to be on a single line',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/single-attribute-single-line.html'
    },
    fixable: 'whitespace', // or "code" or "whitespace"
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    const sourceCode = context.getSourceCode()
    const template =
      context.parserServices.getTemplateBodyTokenStore &&
      context.parserServices.getTemplateBodyTokenStore()

    return utils.defineTemplateBodyVisitor(context, {
      VStartTag(node) {
        const closingTag = node.range[1] - 1
        const numberOfAttributes = node.attributes.length

        if (numberOfAttributes !== 1) return

        if (!utils.isSingleLine(node)) {
          // Find the closest token before the current prop
          // that is not a white space
          const prevToken = /** @type {Token} */ (template.getTokenBefore(
            node.attributes[0],
            {
              filter: (token) => token.type !== 'HTMLWhitespace'
            }
          ))

          const startOfAttribute = node.attributes[0].range[0]
          const endOfAttribute = node.attributes[0].range[1]

          /** @type {Range} */
          const rangeBetweenAttributeAndStartTag = [
            prevToken.range[1],
            startOfAttribute
          ]

          /** @type {Range} */
          const rangeBetweenAttributeAndClosingTag = [
            endOfAttribute,
            closingTag
          ]

          context.report({
            node,
            message: "'{{name}}' should be on a single line.",
            data: { name: sourceCode.getText(node.attributes[0].key) },
            fix(fixer) {
              return [
                fixer.replaceTextRange(rangeBetweenAttributeAndClosingTag, ''),
                fixer.replaceTextRange(rangeBetweenAttributeAndStartTag, ' ')
              ]
            }
          })
        }
      }
    })
  }
}
