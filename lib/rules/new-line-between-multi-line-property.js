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
    return {
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
          const lineCountOfPreProperty =
            pre.loc.end.line - pre.loc.start.line + 1
          const lineCountBetweenCurAndPreProperty =
            cur.loc.start.line - pre.loc.end.line - 1
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
                const firstPosofLine = cur.range[0] - cur.loc.start.column
                // this action equal to insert number of line before node
                return fixer.replaceTextRange(
                  [firstPosofLine, firstPosofLine],
                  '\n'.repeat(insertLine - lineCountBetweenCurAndPreProperty)
                )
              }
            })
          }
        }
      }
    }
  }
}
