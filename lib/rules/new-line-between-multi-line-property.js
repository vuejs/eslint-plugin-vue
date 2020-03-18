/**
 * @fileoverview Enforce new lines between multi-line properties in Vue components.
 * @author IWANABETHATGUY
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce new lines between multi-line properties in Vue components',
      category: 'recommended',
      url: 'https://eslint.vuejs.org/rules/new-line-between-multi-line-property.html'
    },
    fixable: 'code',  // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create: function (context) {
    // variables should be defined here

    // ----------------------------------------------------------------------
    // Helpers
    // ----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------
    return {
      ObjectExpression (node) {
        const properties = node.properties
        for (let i = 1; i < properties.length; i++) {
          const cur = properties[i]
          const pre = properties[i - 1]
          if (pre.loc.end.line - pre.loc.start.line >= 1 && cur.loc.start.line - pre.loc.end.line <= 1) {
            context.report({
              node,
              message: 'Enforce new lines between multi-line properties in Vue components.',
              fix (fixer) {
                return fixer.insertTextBefore(cur, '\n' + ' '.repeat(cur.loc.start.column))
              }
            })
          }
        }
      }
    }
  }
}
