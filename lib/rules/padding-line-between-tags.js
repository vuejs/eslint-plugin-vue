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

/**
 * @param {RuleContext} context
 * @param {VElement} tag
 * @param {VElement} sibling
 */
function insertNewLine(context, tag, sibling) {
  context.report({
    messageId: 'always',
    loc: sibling.loc,
    // @ts-ignore
    fix(fixer) {
      return fixer.insertTextAfter(tag, '\n')
    }
  })
}

/**
 * @param {RuleContext} context
 * @param {VEndTag | VStartTag} endTag
 * @param {VElement} sibling
 */
 function removeExcessLines(context, endTag, sibling) {
  context.report({
    messageId: 'never',
    loc: sibling.loc,
    // @ts-ignore
    fix(fixer) {
      const start = endTag.range[1]
      const end = sibling.range[0]
      const paddingText = context.getSourceCode().text.slice(start, end)
      const lastSpaces = splitLines(paddingText).pop()
      return fixer.replaceTextRange([start, end], `\n${lastSpaces}`)
    }
  })
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/**
 * @param {RuleContext} context
 */
function checkNewline(context) {

  /** @type {Array<{blankLine: "always" | "never", prev: string, next: string}>} */
  let options = context.options[0] || [{ blankLine: "always", prev: "*", next: "*"}];

  /** @type {Map<string, string[]>} */
  let alwaysBlankLine = new Map()
  /** @type {Map<string, string[]>} */
  let neverBlankLine = new Map()

  options.forEach((option) => {
    if (option.blankLine === "always") {
      let tagValue = alwaysBlankLine.get(option.prev)
      if (tagValue) {
        alwaysBlankLine.set(option.prev, [...tagValue, option.next])
      } else {
        alwaysBlankLine.set(option.prev, [option.next])
      }
    } else {
      let tagValue = neverBlankLine.get(option.prev)
      if (tagValue) {
        neverBlankLine.set(option.prev, [...tagValue, option.next])
      } else {
        neverBlankLine.set(option.prev, [option.next])
      }
    }
  })

  /**
   * @param {VElement} block
   */
  return (block) => {
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

    const element = /** @type {VElement} */ (closestSibling)
    let lineDifference = element.loc.start.line - endTag.loc.end.line
    // @ts-ignore
    if (neverBlankLine.has("*") && (neverBlankLine.get("*").includes("*") || neverBlankLine.get("*").includes(element.name))) {
      // @ts-ignore
      if (alwaysBlankLine.has(block.name) && (alwaysBlankLine.get(block.name).includes("*") || alwaysBlankLine.get(block.name).includes(element.name))) {
        if (lineDifference === 1) {
          insertNewLine(context, block, element)
        }
      } else if (lineDifference > 1) {
        removeExcessLines(context, endTag, element)
      }
    // @ts-ignore
    } else if (alwaysBlankLine.has("*") && (alwaysBlankLine.get("*").includes("*") || alwaysBlankLine.get("*").includes(element.name))) {
      // @ts-ignore
      if (neverBlankLine.has(block.name) && (neverBlankLine.get(block.name).includes("*") || neverBlankLine.get(block.name).includes(element.name))) {
        if (lineDifference > 1) {
          removeExcessLines(context, endTag, element)
        }
      } else if (lineDifference === 1) {
          insertNewLine(context, block, element)
      }
    } else {
      // @ts-ignore
      if (neverBlankLine.has(block.name) && (neverBlankLine.get(block.name).includes("*") || neverBlankLine.get(block.name).includes(element.name))) {
        if (lineDifference > 1) {
          removeExcessLines(context, endTag, element)
        }
      // @ts-ignore
      } else if (alwaysBlankLine.has(block.name) && (alwaysBlankLine.get(block.name).includes("*") || alwaysBlankLine.get(block.name).includes(element.name))) {
        if (lineDifference === 1) {
          insertNewLine(context, block, element)
        }
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
        type: "array",
        items: {
          type: "object",
          properties: {
              blankLine: { enum: ["always", "never"] },
              prev: { type: 'string' },
              next: { type: 'string' }
          },
          additionalProperties: false,
          required: ["blankLine", "prev", "next"]
        }
      }
    ],
    messages: {
      never: 'Unexpected blank line before this tag.',
      always: 'Expected blank line before this tag.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      VElement: checkNewline(context)
    })
  }
}
