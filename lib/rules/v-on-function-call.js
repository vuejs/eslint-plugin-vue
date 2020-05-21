/**
 * @author Niklas Higi
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Check whether the given token is a left parenthesis.
 * @param {Token} token The token to check.
 * @returns {boolean} `true` if the token is a left parenthesis.
 */
function isLeftParen (token) {
  return token != null && token.type === 'Punctuator' && token.value === '('
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce or forbid parentheses after method calls without arguments in `v-on` directives',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/v-on-function-call.html'
    },
    fixable: 'code',
    schema: [
      { enum: ['always', 'never'] }
    ]
  },

  create (context) {
    const always = context.options[0] === 'always'

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='on'][key.argument!=null] > VExpressionContainer > Identifier" (node) {
        if (!always) return
        context.report({
          node,
          loc: node.loc,
          message: "Method calls inside of 'v-on' directives must have parentheses."
        })
      },

      "VAttribute[directive=true][key.name.name='on'][key.argument!=null] VOnExpression > ExpressionStatement > CallExpression" (node) {
        if (!always && node.arguments.length === 0 && node.callee.type === 'Identifier') {
          context.report({
            node,
            loc: node.loc,
            message: "Method calls without arguments inside of 'v-on' directives must not have parentheses.",
            fix: fixer => {
              const tokenStore = context.parserServices.getTemplateBodyTokenStore()
              const rightToken = tokenStore.getLastToken(node)
              const leftToken = tokenStore.getTokenAfter(node.callee, isLeftParen)
              const tokens = tokenStore.getTokensBetween(leftToken, rightToken, { includeComments: true })

              if (tokens.length) {
                // The comment is included and cannot be fixed.
                return null
              }

              return fixer.removeRange([leftToken.range[0], rightToken.range[1]])
            }
          })
        }
      }
    })
  }
}
