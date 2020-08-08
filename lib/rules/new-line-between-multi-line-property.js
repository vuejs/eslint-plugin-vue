/**
 * @fileoverview Enforce new lines between multi-line properties in Vue components.
 * @author IWANABETHATGUY
 */
'use strict'

const utils = require('../utils')
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

  /** @param {RuleContext} context */
  create(context) {
    // always insert one line
    const insertLine = 1

    let minLineOfMultilineProperty = 2
    if (
      context.options &&
      context.options[0] &&
      context.options[0].minLineOfMultilineProperty
    ) {
      minLineOfMultilineProperty = context.options[0].minLineOfMultilineProperty
    }

    /** @type {any[]} */
    const callStack = []
    const sourceCode = context.getSourceCode()
    return Object.assign(
      utils.defineVueVisitor(context, {
        CallExpression(node) {
          callStack.push(node)
        },
        'CallExpression:exit'() {
          callStack.pop()
        },

        /**
         * @param {ObjectExpression} node
         */
        ObjectExpression(node) {
          if (callStack.length) {
            return
          }
          const properties = node.properties
          for (let i = 1; i < properties.length; i++) {
            const cur = properties[i]
            const pre = properties[i - 1]

            const leadingComments = sourceCode
              .getTokensBetween(pre, cur, { includeComments: true })
              .filter((token) => ['Line', 'Block'].includes(token.type))
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
                  return fixer.insertTextAfterRange(
                    [firstPositionOfLine, firstPositionOfLine],
                    '\n'
                    // to avoid conflict with no-multiple-empty-lines, only insert one newline
                  )
                }
              })
            }
          }
        }
      })
    )
  }
}
