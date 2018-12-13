/**
 * @author Yosuke ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// -----------------------------------------------------------------------------
// Requirements
// -----------------------------------------------------------------------------

const htmlComments = require('../utils/html-comments')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',

    docs: {
      description: 'enforce unified spacing in HTML comments',
      category: undefined,
      url: 'https://eslint.vuejs.org/rules/html-comment-content-spacing.html'
    },
    fixable: 'whitespace',
    schema: [
      {
        enum: ['always', 'never']
      },
      {
        type: 'object',
        properties: {
          exceptions: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      expectedAfterHTMLCommentOpen: "Expected space after '<!--'.",
      expectedBeforeHTMLCommentOpen: "Expected space before '-->'.",
      expectedAfterExceptionBlock: 'Expected space after exception block.',
      expectedBeforeExceptionBlock: 'Expected space before exception block.',
      unexpectedAfterHTMLCommentOpen: "Unexpected space after '<!--'.",
      unexpectedBeforeHTMLCommentOpen: "Unexpected space before '-->'."
    }
  },

  create (context) {
    // Unless the first option is never, require a space
    const requireSpace = context.options[0] !== 'never'
    return htmlComments.defineVisitor(context, context.options[1], (commentTokens) => {
      if (!commentTokens.value) {
        return
      }
      checkCommentOpen(commentTokens)
      checkCommentClose(commentTokens)
    }, { includeDirectives: true })

    /**
     * Reports the space before the contents of a given comment if it's invalid.
     * @param {string} commentTokens - comment tokens.
     * @returns {void}
     */
    function checkCommentOpen (commentTokens) {
      const beforeToken = commentTokens.openDecoration || commentTokens.open
      if (beforeToken.loc.end.line !== commentTokens.value.loc.start.line) {
        // Ignore newline
        return
      }

      if (requireSpace) {
        if (beforeToken.range[1] < commentTokens.value.range[0]) {
          // Is valid
          return
        }
        context.report({
          loc: {
            start: beforeToken.loc.end,
            end: commentTokens.value.loc.start
          },
          messageId: commentTokens.openDecoration ? 'expectedAfterExceptionBlock' : 'expectedAfterHTMLCommentOpen',
          fix: commentTokens.openDecoration ? undefined : (fixer) => fixer.insertTextAfter(beforeToken, ' ')
        })
      } else {
        if (commentTokens.openDecoration) {
          // Ignore expection block
          return
        }
        if (beforeToken.range[1] === commentTokens.value.range[0]) {
          // Is valid
          return
        }
        context.report({
          loc: {
            start: beforeToken.loc.end,
            end: commentTokens.value.loc.start
          },
          messageId: 'unexpectedAfterHTMLCommentOpen',
          fix: (fixer) => fixer.removeRange([beforeToken.range[1], commentTokens.value.range[0]])
        })
      }
    }

    /**
     * Reports the space after the contents of a given comment if it's invalid.
     * @param {string} commentTokens - comment tokens.
     * @returns {void}
     */
    function checkCommentClose (commentTokens) {
      const afterToken = commentTokens.closeDecoration || commentTokens.close
      if (commentTokens.value.loc.end.line !== afterToken.loc.start.line) {
        // Ignore newline
        return
      }

      if (requireSpace) {
        if (commentTokens.value.range[1] < afterToken.range[0]) {
          // Is valid
          return
        }
        context.report({
          loc: {
            start: commentTokens.value.loc.end,
            end: afterToken.loc.start
          },
          messageId: commentTokens.closeDecoration ? 'expectedBeforeExceptionBlock' : 'expectedBeforeHTMLCommentOpen',
          fix: commentTokens.closeDecoration ? undefined : (fixer) => fixer.insertTextBefore(afterToken, ' ')
        })
      } else {
        if (commentTokens.closeDecoration) {
          // Ignore expection block
          return
        }
        if (commentTokens.value.range[1] === afterToken.range[0]) {
          // Is valid
          return
        }
        context.report({
          loc: {
            start: commentTokens.value.loc.end,
            end: afterToken.loc.start
          },
          messageId: 'unexpectedBeforeHTMLCommentOpen',
          fix: (fixer) => fixer.removeRange([commentTokens.value.range[1], afterToken.range[0]])
        })
      }
    }
  }
}
