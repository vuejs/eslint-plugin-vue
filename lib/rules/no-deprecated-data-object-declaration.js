/**
 * @fileoverview disallow using deprecated object declaration on data
 * @author yoyo930021
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

function isOpenParen (token) {
  return token.type === 'Punctuator' && token.value === '('
}

function isCloseParen (token) {
  return token.type === 'Punctuator' && token.value === ')'
}

function getFirstAndLastTokens (node, sourceCode) {
  let first = sourceCode.getFirstToken(node)
  let last = sourceCode.getLastToken(node)

  // If the value enclosed by parentheses, update the 'first' and 'last' by the parentheses.
  while (true) {
    const prev = sourceCode.getTokenBefore(first)
    const next = sourceCode.getTokenAfter(last)
    if (isOpenParen(prev) && isCloseParen(next)) {
      first = prev
      last = next
    } else {
      return { first, last }
    }
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using deprecated object declaration on data (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-data-object-declaration.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      objectDeclarationIsDeprecated: "Object declaration on \'data\' property is deprecated. Using function declaration instead."
    }
  },

  create (context) {
    const sourceCode = context.getSourceCode()

    return utils.executeOnVue(context, (obj) => {
      obj.properties
        .filter(p =>
          p.type === 'Property' &&
          p.key.type === 'Identifier' &&
          p.key.name === 'data' &&
          p.value.type !== 'FunctionExpression' &&
          p.value.type !== 'ArrowFunctionExpression' &&
          p.value.type !== 'Identifier'
        )
        .forEach(p => {
          context.report({
            node: p,
            messageId: 'objectDeclarationIsDeprecated',
            fix (fixer) {
              const tokens = getFirstAndLastTokens(p.value, sourceCode)

              return [
                fixer.insertTextBefore(tokens.first, 'function() {\nreturn '),
                fixer.insertTextAfter(tokens.last, ';\n}')
              ]
            }
          })
        })
    })
  }
}
