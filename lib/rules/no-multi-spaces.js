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
      description: 'disallow multiple spaces',
      category: 'strongly-recommended',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.3.0/docs/rules/no-multi-spaces.md'
    },
    fixable: 'whitespace', // or "code" or "whitespace"
    schema: []
  },

  /**
   * @param {RuleContext} context - The rule context.
   * @returns {Object} AST event handlers.
   */
  create (context) {
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
        if (!node.templateBody) {
          return
        }
        const sourceCode = context.getSourceCode()
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
                displayValue: sourceCode.getText(token)
              }
            })
          }
          prevToken = token
        }
      }
    }
  }
}
