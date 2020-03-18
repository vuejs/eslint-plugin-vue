/**
 * @fileoverview Enforce new lines between multi-line properties in Vue components.
 * @author IWANABETHATGUY
 */
'use strict'
const _ = require('lodash')
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce new lines between multi-line properties in Vue components',
      category: 'strongly-recommended',
      url: 'https://eslint.vuejs.org/rules/new-line-between-multi-line-property.html'
    },
    fixable: 'code',  // or "code" or "whitespace"
    schema: [
      {
        type: 'object',
        properties: {
          // number of line you want to insert after multi-line property
          insertLine: {
            type: 'number',
            minimum: 1
          },
          minLineOfMultilineProperty: {
            type: 'number',
            minimum: 2
          }
        }
      }
    ]
  },

  create: function (context) {
    const insertLine = _.get(context, ['options', '0', 'insertLine'], 1)
    const minLineOfMultilineProperty = _.get(context, ['options', '0', 'minLineOfMultilineProperty'], 2)
    return {
      ObjectExpression (node) {
        const properties = node.properties
        for (let i = 1; i < properties.length; i++) {
          const cur = properties[i]
          const pre = properties[i - 1]
          const lineCountOfPreProperty = pre.loc.end.line - pre.loc.start.line + 1
          const lineCountBetweenCurAndPreProperty = cur.loc.start.line - pre.loc.end.line - 1
          if (lineCountOfPreProperty >= minLineOfMultilineProperty && lineCountBetweenCurAndPreProperty < insertLine) {
            context.report({
              node: pre,
              loc: pre.loc,
              message: 'Enforce new lines between multi-line properties in Vue components.',
              fix (fixer) {
                const firstPosofLine = cur.range[0] - cur.loc.start.column
                // this action equal to insert number of line before node
                return fixer.replaceTextRange([firstPosofLine, firstPosofLine], '\n'.repeat(insertLine - lineCountBetweenCurAndPreProperty))
              }
            })
          }
        }
      }
    }
  }
}
