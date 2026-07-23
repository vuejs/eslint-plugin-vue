/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */

import utils from '../utils/index.js'

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce quotes style of HTML attributes',
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/html-quotes.html'
    },
    fixable: 'code',
    schema: [
      { enum: ['double', 'single'] },
      {
        type: 'object',
        properties: {
          avoidEscape: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      expected: 'Expected to be enclosed by {{kind}}.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const sourceCode = context.sourceCode
    const shouldUseDoubleQuotes = context.options[0] !== 'single'
    const avoidEscape =
      context.options[1] && context.options[1].avoidEscape === true
    const quoteChar = shouldUseDoubleQuotes ? '"' : "'"
    const quoteName = shouldUseDoubleQuotes ? 'double quotes' : 'single quotes'
    /** @type {boolean} */
    let hasInvalidEOF

    return utils.defineTemplateBodyVisitor(
      context,
      {
        'VAttribute[value!=null]'(node) {
          if (hasInvalidEOF) {
            return
          }

          if (utils.isVBindSameNameShorthand(node)) {
            // v-bind same-name shorthand (Vue 3.4+)
            return
          }

          const text = sourceCode.getText(node.value)
          const firstChar = text[0]

          if (firstChar !== quoteChar) {
            const isQuoted = firstChar === "'" || firstChar === '"'
            if (avoidEscape && isQuoted) {
              const contentText = text.slice(1, -1)
              if (contentText.includes(quoteChar)) {
                return
              }
            }

            context.report({
              node: node.value,
              loc: node.value.loc,
              messageId: 'expected',
              data: { kind: quoteName },
              fix(fixer) {
                const contentText = isQuoted ? text.slice(1, -1) : text

                let shouldFixToDouble = shouldUseDoubleQuotes
                if (
                  avoidEscape &&
                  !isQuoted &&
                  contentText.includes(quoteChar)
                ) {
                  shouldFixToDouble = shouldUseDoubleQuotes
                    ? contentText.includes("'")
                    : !contentText.includes('"')
                }

                const quotePattern = shouldFixToDouble ? /"/g : /'/g
                const quoteEscaped = shouldFixToDouble ? '&quot;' : '&apos;'
                const fixQuoteChar = shouldFixToDouble ? '"' : "'"

                const replacement =
                  fixQuoteChar +
                  contentText.replace(quotePattern, () => quoteEscaped) +
                  fixQuoteChar
                return fixer.replaceText(node.value, replacement)
              }
            })
          }
        }
      },
      {
        Program(node) {
          hasInvalidEOF = utils.hasInvalidEOF(node)
        }
      }
    )
  }
}
