/**
 * @author *****your name*****
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

// ...

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/**
 * @param {RuleContext} context
 */
function checkNewline(context) {
  /** @type {string[]} */
  const ignoreNewlinesAfter = context.options[0]?.ignoreNewlinesAfter || []
  /** @type {string[]} */
  const ignoreNewlinesBefore = context.options[0]?.ignoreNewlinesBefore || []

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
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Insert newlines between sibling tags in template ',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/space-between-siblings.html'
    },
    fixable: 'whitespace',
    schema: [
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
      never: 'Unexpected blank line before this block.',
      always: 'Expected blank line after this block.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      VElement: checkNewline(context)
    })
  }
}
