/**
 * @fileoverview Enforces component's data property to be a function.
 * @author Armano
 */
import utils from '../utils/index.ts'

function isOpenParen(token: Token) {
  return token.type === 'Punctuator' && token.value === '('
}

function isCloseParen(token: Token) {
  return token.type === 'Punctuator' && token.value === ')'
}

function getFirstAndLastTokens(node: Expression, sourceCode: SourceCode) {
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

export default {
  meta: {
    type: 'problem',
    docs: {
      description: "enforce component's data property to be a function",
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-shared-component-data.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      dataPropertyMustBeFunction:
        '`data` property in component must be a function.'
    }
  },
  create(context: RuleContext) {
    const sourceCode = context.sourceCode
    const validPropertyTypes = new Set([
      'FunctionExpression',
      'ArrowFunctionExpression',
      'Identifier'
    ])

    return utils.executeOnVueComponent(context, (objectExpression) => {
      const invalidData = utils.findProperty(
        objectExpression,
        'data',
        (property) => !validPropertyTypes.has(property.value.type)
      )

      if (invalidData) {
        context.report({
          node: invalidData,
          messageId: 'dataPropertyMustBeFunction',
          fix(fixer) {
            const tokens = getFirstAndLastTokens(invalidData.value, sourceCode)

            return [
              fixer.insertTextBefore(tokens.first, 'function() {\nreturn '),
              fixer.insertTextAfter(tokens.last, ';\n}')
            ]
          }
        })
      }
    })
  }
}
