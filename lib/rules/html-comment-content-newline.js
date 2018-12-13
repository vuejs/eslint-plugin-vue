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
// Helpers
// ------------------------------------------------------------------------------

function parseOption (param) {
  if (param && typeof param === 'string') {
    return {
      singleline: param,
      multiline: param
    }
  }
  return Object.assign({
    singleline: 'never',
    multiline: 'always'
  }, param)
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',

    docs: {
      description: 'enforce unified line brake in HTML comments',
      category: undefined,
      url: 'https://eslint.vuejs.org/rules/html-comment-content-newline.html'
    },
    fixable: 'whitespace',
    schema: [
      {
        anyOf: [
          {
            enum: ['always', 'never']
          },
          {
            type: 'object',
            properties: {
              'singleline': { enum: ['always', 'never', 'ignore'] },
              'multiline': { enum: ['always', 'never', 'ignore'] }
            },
            additionalProperties: false
          }
        ]
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
      expectedAfterHTMLCommentOpen: "Expected line break after '<!--'.",
      expectedBeforeHTMLCommentOpen: "Expected line break before '-->'.",
      expectedAfterExceptionBlock: 'Expected line break after exception block.',
      expectedBeforeExceptionBlock: 'Expected line break before exception block.',
      unexpectedAfterHTMLCommentOpen: "Unexpected line breaks after '<!--'.",
      unexpectedBeforeHTMLCommentOpen: "Unexpected line breaks before '-->'."
    }
  },

  create (context) {
    const option = parseOption(context.options[0])
    return htmlComments.defineVisitor(context, context.options[1], (commentTokens) => {
      if (!commentTokens.value) {
        return
      }
      const startLine = commentTokens.openDecoration
        ? commentTokens.openDecoration.loc.end.line
        : commentTokens.value.loc.start.line
      const endLine = commentTokens.closeDecoration
        ? commentTokens.closeDecoration.loc.start.line
        : commentTokens.value.loc.end.line
      const newlineType = startLine === endLine
        ? option.singleline
        : option.multiline
      if (newlineType === 'ignore') {
        return
      }
      checkCommentOpen(commentTokens, newlineType !== 'never')
      checkCommentClose(commentTokens, newlineType !== 'never')
    })

    /**
     * Reports the newline before the contents of a given comment if it's invalid.
     * @param {string} commentTokens - comment tokens.
     * @param {boolean} requireNewline - `true` if line breaks are required.
     * @returns {void}
     */
    function checkCommentOpen (commentTokens, requireNewline) {
      const beforeToken = commentTokens.openDecoration || commentTokens.open

      if (requireNewline) {
        if (beforeToken.loc.end.line < commentTokens.value.loc.start.line) {
          // Is valid
          return
        }
        context.report({
          loc: {
            start: beforeToken.loc.end,
            end: commentTokens.value.loc.start
          },
          messageId: commentTokens.openDecoration ? 'expectedAfterExceptionBlock' : 'expectedAfterHTMLCommentOpen',
          fix: commentTokens.openDecoration ? undefined : (fixer) => fixer.insertTextAfter(beforeToken, '\n')
        })
      } else {
        if (beforeToken.loc.end.line === commentTokens.value.loc.start.line) {
          // Is valid
          return
        }
        context.report({
          loc: {
            start: beforeToken.loc.end,
            end: commentTokens.value.loc.start
          },
          messageId: 'unexpectedAfterHTMLCommentOpen',
          fix: (fixer) => fixer.replaceTextRange([beforeToken.range[1], commentTokens.value.range[0]], ' ')
        })
      }
    }

    /**
     * Reports the space after the contents of a given comment if it's invalid.
     * @param {string} commentTokens - comment tokens.
     * @param {boolean} requireNewline - `true` if line breaks are required.
     * @returns {void}
     */
    function checkCommentClose (commentTokens, requireNewline) {
      const afterToken = commentTokens.closeDecoration || commentTokens.close

      if (requireNewline) {
        if (commentTokens.value.loc.end.line < afterToken.loc.start.line) {
          // Is valid
          return
        }
        context.report({
          loc: {
            start: commentTokens.value.loc.end,
            end: afterToken.loc.start
          },
          messageId: commentTokens.closeDecoration ? 'expectedBeforeExceptionBlock' : 'expectedBeforeHTMLCommentOpen',
          fix: commentTokens.closeDecoration ? undefined : (fixer) => fixer.insertTextBefore(afterToken, '\n')
        })
      } else {
        if (commentTokens.value.loc.end.line === afterToken.loc.start.line) {
          // Is valid
          return
        }
        context.report({
          loc: {
            start: commentTokens.value.loc.end,
            end: afterToken.loc.start
          },
          messageId: 'unexpectedBeforeHTMLCommentOpen',
          fix: (fixer) => fixer.replaceTextRange([commentTokens.value.range[1], afterToken.range[0]], ' ')
        })
      }
    }
  }
}
