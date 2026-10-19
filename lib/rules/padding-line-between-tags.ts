/**
 * @author dev1437
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

/**
 * Split the source code into multiple lines based on the line delimiters.
 * Copied from padding-line-between-blocks
 */
function splitLines(text: string): string[] {
  return text.split(/\r\n|[\r\n\u{2028}\u{2029}]/gu)
}

function insertNewLine(
  context: RuleContext,
  tag: VElement,
  sibling: VElement,
  lineDifference: number
) {
  const endTag = tag.endTag || tag.startTag

  if (lineDifference === 1) {
    context.report({
      messageId: 'always',
      loc: sibling.loc,
      fix(fixer) {
        return fixer.insertTextAfter(tag, '\n')
      }
    })
  } else if (lineDifference === 0) {
    context.report({
      messageId: 'always',
      loc: sibling.loc,
      fix(fixer) {
        const lastSpaces = /^\s*/.exec(
          context.sourceCode.lines[endTag.loc.start.line - 1]
        )![0]

        return fixer.insertTextAfter(endTag, `\n\n${lastSpaces}`)
      }
    })
  }
}

function removeExcessLines(
  context: RuleContext,
  endTag: VEndTag | VStartTag,
  sibling: VElement,
  lineDifference: number
) {
  if (lineDifference <= 1) {
    return
  }

  let hasOnlyTextBetween = true
  for (
    let i = endTag.loc.start.line;
    hasOnlyTextBetween && i < sibling.loc.start.line - 1;
    i++
  ) {
    hasOnlyTextBetween = !/^\s*$/.test(context.sourceCode.lines[i])
  }
  if (!hasOnlyTextBetween) {
    context.report({
      messageId: 'never',
      loc: sibling.loc,
      fix(fixer) {
        const start = endTag.range[1]
        const end = sibling.range[0]
        const paddingText = context.sourceCode.text.slice(start, end)
        const textBetween = splitLines(paddingText)
        let newTextBetween = `\n${textBetween.pop()}`
        for (let i = textBetween.length - 1; i >= 0; i--) {
          if (!/^\s*$/.test(textBetween[i])) {
            newTextBetween = `${i === 0 ? '' : '\n'}${
              textBetween[i]
            }${newTextBetween}`
          }
        }
        return fixer.replaceTextRange([start, end], newTextBetween)
      }
    })
  }
}

/**
 * Check if a tag is single-line (opening and closing tags on the same line)
 */
function isSingleLine(element: VElement): boolean {
  const endTag = element.endTag || element.startTag
  return element.startTag.loc.start.line === endTag.loc.end.line
}

/**
 * Match a selector string against an element.
 * Supports pseudo-classes `:single-line` and `:multi-line`.
 */
function isSelectorMatchingTag(selector: string, element: VElement): boolean {
  const colonIndex = selector.lastIndexOf(':')

  if (colonIndex > 0) {
    const pseudo = selector.slice(colonIndex)
    const tagPart = selector.slice(0, colonIndex)
    const isTagMatch = tagPart === '*' || element.name === tagPart

    if (pseudo === ':single-line') {
      return isTagMatch && isSingleLine(element)
    }

    if (pseudo === ':multi-line') {
      return isTagMatch && !isSingleLine(element)
    }
  }

  return selector === '*' || element.name === selector
}

/**
 * Check if the configuration matches the given elements
 */
function isConfigurationMatchingElements(
  configure: { blankLine: string; prev: string; next: string },
  prevElement: VElement,
  nextElement: VElement
): boolean {
  return (
    isSelectorMatchingTag(configure.prev, prevElement) &&
    isSelectorMatchingTag(configure.next, nextElement)
  )
}

function checkNewline(context: RuleContext) {
  const configureList: Array<{
    blankLine: 'always' | 'never' | 'consistent'
    prev: string
    next: string
  }> = context.options[0] || [{ blankLine: 'always', prev: '*', next: '*' }]

  const reverseConfigureList = [...configureList].reverse()

  /**
   * It has the style of the first `blankLine="consistent"`.
   */
  const firstConsistentBlankLines = new Map<VElement, 'always' | 'never'>()

  return (block: VElement) => {
    if (!block.parent.parent) {
      return
    }

    const endTag = block.endTag || block.startTag
    const lowerSiblings = block.parent.children
      .filter(
        (element) =>
          element.type === 'VElement' && element.range !== block.range
      )
      .filter((sibling) => sibling.range[0] >= endTag.range[1])

    if (lowerSiblings.length === 0) {
      return
    }

    const closestSibling = lowerSiblings[0] as VElement

    const configure = reverseConfigureList.find((configure) =>
      isConfigurationMatchingElements(configure, block, closestSibling)
    )

    if (!configure) {
      return
    }
    const lineDifference = closestSibling.loc.start.line - endTag.loc.end.line

    let blankLine = configure.blankLine
    if (blankLine === 'consistent') {
      const firstConsistentBlankLine = firstConsistentBlankLines.get(
        block.parent
      )
      if (firstConsistentBlankLine == null) {
        firstConsistentBlankLines.set(
          block.parent,
          lineDifference > 1 ? 'always' : 'never'
        )
        return
      }
      blankLine = firstConsistentBlankLine
    }

    if (blankLine === 'always') {
      insertNewLine(context, block, closestSibling, lineDifference)
    } else {
      removeExcessLines(context, endTag, closestSibling, lineDifference)
    }
  }
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description:
        'require or disallow newlines between sibling tags in template',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/padding-line-between-tags.html'
    },
    // eslint-disable-next-line eslint-plugin/require-meta-fixable -- fixer is not recognized
    fixable: 'whitespace',
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            blankLine: { enum: ['always', 'never', 'consistent'] },
            prev: { type: 'string' },
            next: { type: 'string' }
          },
          additionalProperties: false,
          required: ['blankLine', 'prev', 'next']
        }
      }
    ],
    messages: {
      never: 'Unexpected blank line before this tag.',
      always: 'Expected blank line before this tag.'
    }
  },
  create(context: RuleContext) {
    return utils.defineTemplateBodyVisitor(context, {
      VElement: checkNewline(context)
    })
  }
}
