/**
 * @fileoverview Enforce new lines between multi-line properties in Vue components.
 * @author IWANABETHATGUY
 */
'use strict'
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
// @ts-ignore
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description:
        'enforce new lines between multi-line properties in Vue components',
      categories: undefined,
      url:
        'https://eslint.vuejs.org/rules/new-line-between-multi-line-property.html'
    },
    fixable: 'whitespace', // or "code" or "whitespace"
    schema: [
      {
        type: 'object',
        properties: {
          // number of line you want to insert after multi-line property
          minLineOfMultilineProperty: {
            type: 'number',
            minimum: 2
          }
        }
      }
    ]
  },

  create(context) {
    const insertLine = 1

    let minLineOfMultilineProperty = 2
    if (
      context.options &&
      context.options[0] &&
      context.options[0].minLineOfMultilineProperty
    ) {
      minLineOfMultilineProperty = context.options[0].minLineOfMultilineProperty
    }
    // @ts-ignore
    const callStack = []
    /** @type {any[]} */
    let comments = []
    return {
      Program(node) {
        comments = node.comments
      },
      // @ts-ignore
      CallExpression(node) {
        callStack.push(node)
      },
      'CallExpression:exit'() {
        // @ts-ignore
        callStack.pop()
      },
      // @ts-ignore
      ObjectExpression(node) {
        // @ts-ignore
        if (callStack.length) {
          return
        }
        const properties = node.properties
        for (let i = 1; i < properties.length; i++) {
          const cur = properties[i]
          const pre = properties[i - 1]

          /** @type {any[]} */
          const leadingComments = []
          // getFirstLeadingComments is enough , after that break the loop.
          for (
            let commentsIndex = 0;
            commentsIndex < comments.length;
            commentsIndex++
          ) {
            const comment = comments[commentsIndex]
            if (
              comment.range[0] > pre.range[1] &&
              comment.range[1] < cur.range[0]
            ) {
              leadingComments.push(comments[commentsIndex])
              break
            }
          }
          const lineCountOfPreProperty =
            pre.loc.end.line - pre.loc.start.line + 1
          let curStartLine = cur.loc.start.line
          if (leadingComments.length) {
            curStartLine = leadingComments[0].loc.start.line
          }
          const lineCountBetweenCurAndPreProperty =
            curStartLine - pre.loc.end.line - 1
          if (
            lineCountOfPreProperty >= minLineOfMultilineProperty &&
            lineCountBetweenCurAndPreProperty < insertLine
          ) {
            context.report({
              node: pre,
              loc: pre.loc,
              message:
                'Enforce new lines between multi-line properties in Vue components.',
              // @ts-ignore
              fix(fixer) {
                let firstPositionOfLine = cur.range[0] - cur.loc.start.column
                if (leadingComments.length) {
                  const firstComment = leadingComments[0]
                  firstPositionOfLine =
                    firstComment.range[0] - firstComment.loc.start.column
                }
                // this action equal to insert number of line before node
                return fixer.replaceTextRange(
                  [firstPositionOfLine, firstPositionOfLine],
                  '\n'
                  // to avoid conflict with no-multiple-empty-lines, only insert one newline
                )
              }
            })
          }
        }
      }
    }
  }
}
