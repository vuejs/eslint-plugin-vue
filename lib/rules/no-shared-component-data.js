/**
 * @fileoverview Enforces component's data property to be a function.
 * @author Armano
 */
'use strict'

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

function create (context) {
  const sourceCode = context.getSourceCode()

  return utils.executeOnVueComponent(context, (obj) => {
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
          message: '`data` property in component must be a function',
          fix (fixer) {
            const tokens = getFirstAndLastTokens(p.value, sourceCode)

            // If we can upgrade requirements to `eslint@>4.1.0`, this code can be replaced by:
            //     return [
            //       fixer.insertTextBefore(tokens.first, 'function() {\nreturn '),
            //       fixer.insertTextAfter(tokens.last, ';\n}')
            //     ]
            // See: https://eslint.org/blog/2017/06/eslint-v4.1.0-released#applying-multiple-autofixes-simultaneously
            const range = [tokens.first.range[0], tokens.last.range[1]]
            const valueText = sourceCode.text.slice(range[0], range[1])
            const replacement = `function() {\nreturn ${valueText};\n}`
            return fixer.replaceTextRange(range, replacement)
          }
        })
      })
  })
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: "enforce component's data property to be a function",
      category: 'essential'
    },
    fixable: 'code',
    schema: []
  },

  create
}
