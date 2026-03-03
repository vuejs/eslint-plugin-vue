/**
 * @author Yosuke ota
 * See LICENSE file in root directory for full license.
 */
import type { ParsedHTMLComment } from '../utils/html-comments.ts'
import { defineVisitor } from '../utils/html-comments.ts'

export default {
  meta: {
    type: 'layout',

    docs: {
      description: 'enforce unified spacing in HTML comments',
      categories: undefined,
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
  create(context: RuleContext) {
    // Unless the first option is never, require a space
    const requireSpace = context.options[0] !== 'never'
    return defineVisitor(
      context,
      context.options[1],
      (comment) => {
        checkCommentOpen(comment)
        checkCommentClose(comment)
      },
      { includeDirectives: true }
    )

    /**
     * Reports the space before the contents of a given comment if it's invalid.
     */
    function checkCommentOpen(comment: ParsedHTMLComment): void {
      const { value, openDecoration, open } = comment
      if (!value) {
        return
      }
      const beforeToken = openDecoration || open
      if (beforeToken.loc.end.line !== value.loc.start.line) {
        // Ignore newline
        return
      }

      if (requireSpace) {
        if (beforeToken.range[1] < value.range[0]) {
          // Is valid
          return
        }
        context.report({
          loc: {
            start: beforeToken.loc.end,
            end: value.loc.start
          },
          messageId: openDecoration
            ? 'expectedAfterExceptionBlock'
            : 'expectedAfterHTMLCommentOpen',
          fix: openDecoration
            ? undefined
            : (fixer) => fixer.insertTextAfter(beforeToken, ' ')
        })
      } else {
        if (openDecoration) {
          // Ignore expection block
          return
        }
        if (beforeToken.range[1] === value.range[0]) {
          // Is valid
          return
        }
        context.report({
          loc: {
            start: beforeToken.loc.end,
            end: value.loc.start
          },
          messageId: 'unexpectedAfterHTMLCommentOpen',
          fix: (fixer) =>
            fixer.removeRange([beforeToken.range[1], value.range[0]])
        })
      }
    }

    /**
     * Reports the space after the contents of a given comment if it's invalid.
     */
    function checkCommentClose(comment: ParsedHTMLComment): void {
      const { value, closeDecoration, close } = comment
      if (!value) {
        return
      }
      const afterToken = closeDecoration || close
      if (value.loc.end.line !== afterToken.loc.start.line) {
        // Ignore newline
        return
      }

      if (requireSpace) {
        if (value.range[1] < afterToken.range[0]) {
          // Is valid
          return
        }
        context.report({
          loc: {
            start: value.loc.end,
            end: afterToken.loc.start
          },
          messageId: closeDecoration
            ? 'expectedBeforeExceptionBlock'
            : 'expectedBeforeHTMLCommentOpen',
          fix: closeDecoration
            ? undefined
            : (fixer) => fixer.insertTextBefore(afterToken, ' ')
        })
      } else {
        if (closeDecoration) {
          // Ignore expection block
          return
        }
        if (value.range[1] === afterToken.range[0]) {
          // Is valid
          return
        }
        context.report({
          loc: {
            start: value.loc.end,
            end: afterToken.loc.start
          },
          messageId: 'unexpectedBeforeHTMLCommentOpen',
          fix: (fixer) =>
            fixer.removeRange([value.range[1], afterToken.range[0]])
        })
      }
    }
  }
}
