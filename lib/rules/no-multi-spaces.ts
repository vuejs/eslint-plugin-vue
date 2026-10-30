/**
 * @fileoverview This rule warns about the usage of extra whitespaces between attributes
 * @author Armano
 */
import path from 'node:path'
import utils from '../utils/index.js'

const isProperty = (context: RuleContext, node: Token) => {
  const sourceCode = context.sourceCode
  return node.type === 'Punctuator' && sourceCode.getText(node) === ':'
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'disallow multiple spaces',
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/no-multi-spaces.html'
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          ignoreProperties: {
            type: 'boolean'
          },
          ignoreEOLComments: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      multipleSpaces: "Multiple spaces found before '{{displayValue}}'.",
      useLatestParser:
        'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error.'
    }
  },

  create(context: RuleContext): RuleListener {
    const options = context.options[0] || {}
    const shouldIgnoreProperties = options.ignoreProperties === true
    const shouldIgnoreEOLComments = options.ignoreEOLComments === true

    return {
      Program(node) {
        const sourceCode = context.sourceCode
        if (sourceCode.parserServices.getTemplateBodyTokenStore == null) {
          const filename = context.filename
          if (path.extname(filename) === '.vue') {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: 'useLatestParser'
            })
          }
          return
        }
        const tokenStore = sourceCode.parserServices.getTemplateBodyTokenStore()
        const documentFragment =
          sourceCode.parserServices.getDocumentFragment &&
          sourceCode.parserServices.getDocumentFragment()
        if (!documentFragment) {
          return
        }
        const tokenLists: Token[][] = []
        for (const element of documentFragment.children) {
          if (!utils.isVElement(element)) {
            continue
          }
          if (element === node.templateBody) {
            tokenLists.push(
              tokenStore.getTokens(element, { includeComments: true })
            )
          } else {
            tokenLists.push(tokenStore.getTokens(element.startTag))
            if (element.endTag) {
              tokenLists.push(tokenStore.getTokens(element.endTag))
            }
          }
        }

        for (const tokens of tokenLists) {
          let prevToken = tokens.shift()!
          for (const token of tokens) {
            const spaces = token.range[0] - prevToken.range[1]
            let shouldIgnore =
              shouldIgnoreProperties &&
              (isProperty(context, token) || isProperty(context, prevToken))

            if (
              !shouldIgnore &&
              shouldIgnoreEOLComments &&
              (token.type === 'Line' || token.type === 'Block')
            ) {
              const nextToken = tokenStore.getTokenAfter(token, {
                includeComments: true
              })
              if (!nextToken || nextToken.loc.start.line > token.loc.end.line) {
                shouldIgnore = true
              }
            }

            if (
              !shouldIgnore &&
              spaces > 1 &&
              token.loc.start.line === prevToken.loc.start.line
            ) {
              context.report({
                node: token,
                loc: {
                  start: prevToken.loc.end,
                  end: token.loc.start
                },
                messageId: 'multipleSpaces',
                fix: (fixer) =>
                  fixer.replaceTextRange(
                    [prevToken.range[1], token.range[0]],
                    ' '
                  ),
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
}
