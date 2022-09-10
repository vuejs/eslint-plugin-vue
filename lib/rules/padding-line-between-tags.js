/**
 * @author dev1437
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

/**
 * Split the source code into multiple lines based on the line delimiters.
 * Copied from padding-line-between-blocks
 * @param {string} text Source code as a string.
 * @returns {string[]} Array of source code lines.
 */
function splitLines(text) {
  return text.split(/\r\n|[\r\n\u2028\u2029]/gu)
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/**
 * @param {RuleContext} context
 */
function checkNewline(context) {
  /** @type {'always' | 'never'} */
  const applyRule = context.options[0] || 'always'
  /** @type {string[]} */
  let ignoreNewlinesAfter = []
  /** @type {string[]} */
  let ignoreNewlinesBefore = []

  if (context.options.length > 1) {
    const options = context.options[1]
    ignoreNewlinesAfter = options.ignoreNewlinesAfter ?? []
    ignoreNewlinesBefore = options.ignoreNewlinesBefore ?? []
  }

  /**
   * @param {VElement} block
   */
  return (block) => {
    if (ignoreNewlinesAfter.includes(block.name)) {
      return
    }

    const endTag = block.endTag || block.startTag
    const lowerSiblings = block.parent.children
      .filter(
        (element) =>
          element.type === 'VElement' && element.range !== block.range
      )
      .filter((sibling) => sibling.range[0] - endTag.range[1] > 0)

    if (lowerSiblings.length === 0) {
      return
    }

    let closestSibling = lowerSiblings[0]

    for (const sibling of lowerSiblings) {
      const diff = sibling.range[0] - endTag.range[1]
      if (diff < closestSibling.range[0] - endTag.range[1]) {
        closestSibling = sibling
      }
    }

    if (applyRule === 'always') {
      if (closestSibling.loc.start.line === endTag.loc.end.line + 1) {
        context.report({
          messageId: 'always',
          loc: closestSibling.loc,
          // @ts-ignore
          fix(fixer) {
            const element = /** @type {VElement} */ (closestSibling)
            if (!ignoreNewlinesBefore.includes(element.name)) {
              return fixer.insertTextAfter(block, '\n')
            }
          }
        })
      }
    } else {
      if (closestSibling.loc.start.line > endTag.loc.end.line + 1) {
        context.report({
          messageId: 'never',
          loc: closestSibling.loc,
          // @ts-ignore
          fix(fixer) {
            const start = endTag.range[1]
            const end = closestSibling.range[0]
            const paddingText = context.getSourceCode().text.slice(start, end)
            const lastSpaces = splitLines(paddingText).pop()
            return fixer.replaceTextRange([start, end], `\n${lastSpaces}`)
          }
        })
      }
    }
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'require or disallow newlines between sibling tags in template',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/space-between-siblings.html'
    },
    fixable: 'whitespace',
    schema: [
      {
        enum: ['always', 'never']
      },
      {
        type: 'object',
        properties: {
          ignoreNewlinesBefore: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false
          },
          ignoreNewlinesAfter: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      never: 'Unexpected blank line after this tag.',
      always: 'Expected blank line after this tag.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      VElement: checkNewline(context)
    })
  }
}
