/**
 * @fileoverview disallow adding multiple root nodes to the template
 * @author Przemyslaw Falowski (@przemkow)
 */
'use strict'

const utils = require('../utils')

/**
 * Get all comments that need to be reported
 * @param {(HTMLComment | HTMLBogusComment | Comment)[]} comments
 * @param {VRootElement} element
 * @returns {(HTMLComment | HTMLBogusComment | Comment)[]}
 */
function getReportComments(comments, element) {
  const commentRanges = comments.map((comment) => comment.range)
  const elementRanges = element.children
    .filter((child) => child.type === 'VElement')
    .map((child) => child.range)

  // should return comment directly when no any elements
  if (elementRanges.length === 0) {
    return comments
  }

  let commentIndex = 0
  let elementIndex = 0

  const needReportComments = []
  while (commentIndex < commentRanges.length) {
    const [commentStart, commentEnd] = commentRanges[commentIndex]
    const [elementStart, elementEnd] = elementRanges[elementIndex]
    // if the comment is in the range of element, should skip
    if (commentStart > elementStart && commentEnd < elementEnd) {
      commentIndex += 1
      continue
    }

    if (commentEnd < elementStart) {
      needReportComments.push(comments[commentIndex])
      commentIndex += 1
    }

    // the element array has no any element, but comment still has some elements
    if (
      elementIndex === elementRanges.length - 1 &&
      commentStart > elementEnd
    ) {
      needReportComments.push(comments[commentIndex])
      commentIndex += 1
    }

    if (elementIndex < elementRanges.length - 1 && commentStart > elementEnd) {
      elementIndex += 1
    }
  }

  return needReportComments
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow adding multiple root nodes to the template',
      categories: ['vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-multiple-template-root.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          disallowComments: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      commentRoot: 'The template root disallows comments.',
      multipleRoot: 'The template root requires exactly one element.',
      textRoot: 'The template root requires an element rather than texts.',
      disallowedElement: "The template root disallows '<{{name}}>' elements.",
      disallowedDirective: "The template root disallows 'v-for' directives."
    }
  },
  /**
   * @param {RuleContext} context - The rule context.
   * @returns {RuleListener} AST event handlers.
   */
  create(context) {
    const options = context.options[0] || {}
    const disallowComments = options.disallowComments
    const sourceCode = context.getSourceCode()

    return {
      Program(program) {
        const element = program.templateBody
        if (element == null) {
          return
        }

        const comments = element.comments
        if (disallowComments && comments.length > 0) {
          const needReportComments = getReportComments(comments, element)
          if (needReportComments.length > 0) {
            for (const comment of needReportComments) {
              context.report({
                node: comment,
                loc: comment.loc,
                messageId: 'commentRoot'
              })
            }
          }
        }

        const rootElements = []
        let extraText = null
        let extraElement = null
        let vIf = false
        for (const child of element.children) {
          if (child.type === 'VElement') {
            if (rootElements.length === 0) {
              rootElements.push(child)
              vIf = utils.hasDirective(child, 'if')
            } else if (vIf && utils.hasDirective(child, 'else-if')) {
              rootElements.push(child)
            } else if (vIf && utils.hasDirective(child, 'else')) {
              rootElements.push(child)
              vIf = false
            } else {
              extraElement = child
            }
          } else if (sourceCode.getText(child).trim() !== '') {
            extraText = child
          }
        }

        if (extraText != null) {
          context.report({
            node: extraText,
            loc: extraText.loc,
            messageId: 'textRoot'
          })
        } else if (extraElement == null) {
          for (const element of rootElements) {
            const tag = element.startTag
            const name = element.name

            if (name === 'template' || name === 'slot') {
              context.report({
                node: tag,
                loc: tag.loc,
                messageId: 'disallowedElement',
                data: { name }
              })
            }
            if (utils.hasDirective(element, 'for')) {
              context.report({
                node: tag,
                loc: tag.loc,
                messageId: 'disallowedDirective'
              })
            }
          }
        } else {
          context.report({
            node: extraElement,
            loc: extraElement.loc,
            messageId: 'multipleRoot'
          })
        }
      }
    }
  }
}
