/**
 * @fileoverview This rule warns about the usage of extra whitespaces between attributes
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'This rule warns about the usage of extra whitespaces between attributes',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'whitespace',  // or "code" or "whitespace"
    schema: []
  },

  /**
   * @param {RuleContext} context - The rule context.
   * @returns {Object} AST event handlers.
   */
  create (context) {
    function formatValue (token) {
      switch (token.type) {
        case 'HTMLSelfClosingTagClose': return '/>'
        case 'HTMLTagClose': return '>'
      }

      return token.value
    }

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return {
      Program (node) {
        if (context.parserServices.getTemplateBodyTokenStore == null) {
          context.report({
            loc: { line: 1, column: 0 },
            message: 'Use the latest vue-eslint-parser. See also https://github.com/vuejs/eslint-plugin-vue#what-is-the-use-the-latest-vue-eslint-parser-error.'
          })
          return
        }
        const tokenStore = context.parserServices.getTemplateBodyTokenStore()
        const tokens = tokenStore.getTokens(node.templateBody, { includeComments: true })

        let prevToken = tokens.shift()
        for (const token of tokens) {
          const spaces = token.range[0] - prevToken.range[1]
          if (spaces > 1 && token.loc.start.line === prevToken.loc.start.line) {
            context.report({
              node: token,
              loc: {
                start: prevToken.loc.end,
                end: token.loc.start
              },
              message: "Multiple spaces found before '{{displayValue}}'.",
              fix: (fixer) => fixer.replaceTextRange([prevToken.range[1], token.range[0]], ' '),
              data: {
                displayValue: formatValue(token)
              }
            })
          }
          prevToken = token
        }
      }
    }
  }
}
