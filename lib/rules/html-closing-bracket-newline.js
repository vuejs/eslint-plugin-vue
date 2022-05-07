/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * @param {number} lineBreaks
 */
function getPhrase(lineBreaks) {
  switch (lineBreaks) {
    case 0:
      return 'no line breaks'
    case 1:
      return '1 line break'
    default:
      return `${lineBreaks} line breaks`
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description:
        "require or disallow a line break before tag's closing brackets",
      categories: ['vue3-strongly-recommended', 'strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/html-closing-bracket-newline.html'
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          singleline: { enum: ['always', 'never'] },
          multiline: { enum: ['always', 'never'] }
        },
        additionalProperties: false
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const df =
      context.parserServices.getDocumentFragment &&
      context.parserServices.getDocumentFragment()
    if (!df) {
      return {}
    }

    const options = Object.assign(
      {},
      {
        singleline: 'never',
        multiline: 'always'
      },
      context.options[0] || {}
    )
    const template =
      context.parserServices.getTemplateBodyTokenStore &&
      context.parserServices.getTemplateBodyTokenStore()

    /** @param {VStartTag | VEndTag} node */
    function verify(node) {
      const closingBracketToken = template.getLastToken(node)
      if (
        closingBracketToken.type !== 'HTMLSelfClosingTagClose' &&
        closingBracketToken.type !== 'HTMLTagClose'
      ) {
        return
      }

      const prevToken = template.getTokenBefore(closingBracketToken)
      const type =
        node.loc.start.line === prevToken.loc.end.line
          ? 'singleline'
          : 'multiline'
      const expectedLineBreaks = options[type] === 'always' ? 1 : 0
      const actualLineBreaks =
        closingBracketToken.loc.start.line - prevToken.loc.end.line

      if (actualLineBreaks !== expectedLineBreaks) {
        context.report({
          node,
          loc: {
            start: prevToken.loc.end,
            end: closingBracketToken.loc.start
          },
          message:
            'Expected {{expected}} before closing bracket, but {{actual}} found.',
          data: {
            expected: getPhrase(expectedLineBreaks),
            actual: getPhrase(actualLineBreaks)
          },
          fix(fixer) {
            /** @type {Range} */
            const range = [prevToken.range[1], closingBracketToken.range[0]]
            const text = '\n'.repeat(expectedLineBreaks)
            return fixer.replaceTextRange(range, text)
          }
        })
      }
    }

    const documentFragment = df

    return utils.defineTemplateBodyVisitor(
      context,
      {
        /** @param {VStartTag | VEndTag} node */
        'VStartTag, VEndTag': verify
      },
      {
        /** @param {Program} node */
        Program(node) {
          if (utils.hasInvalidEOF(node)) {
            return
          }

          for (const element of documentFragment.children) {
            if (!utils.isVElement(element) || element.name === 'template') {
              continue
            }

            verify(element.startTag)

            if (element.endTag !== null) {
              verify(element.endTag)
            }
          }
        }
      }
    )
  }
}
