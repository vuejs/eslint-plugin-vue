/**
 * @fileoverview Enforce new lines between multi-line properties in Vue components.
 * @author IWANABETHATGUY
 */
import utils from '../utils/index.js'

function isComma(node: Token) {
  return node.type === 'Punctuator' && node.value === ','
}

/**
 * Check whether the between given nodes has empty line.
 */
function* iterateBetweenTokens(
  sourceCode: SourceCode,
  pre: ASTNode,
  cur: ASTNode
) {
  yield sourceCode.getLastToken(pre)
  yield* sourceCode.getTokensBetween(pre, cur, {
    includeComments: true
  })
  yield sourceCode.getFirstToken(cur)
}

/**
 * Check whether the between given nodes has empty line.
 */
function hasEmptyLine(sourceCode: SourceCode, pre: ASTNode, cur: ASTNode) {
  let preToken: Token | null = null
  for (const token of iterateBetweenTokens(sourceCode, pre, cur)) {
    if (preToken && token.loc.start.line - preToken.loc.end.line >= 2) {
      return true
    }
    preToken = token
  }
  return false
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description:
        'enforce new lines between multi-line properties in Vue components',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/new-line-between-multi-line-property.html'
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          // number of line you want to insert after multi-line property
          minLineOfMultilineProperty: {
            type: 'number',
            minimum: 2
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      missingEmptyLine:
        'Enforce new lines between multi-line properties in Vue components.'
    }
  },

  create(context: RuleContext) {
    const minLineOfMultilineProperty =
      context.options &&
      context.options[0] &&
      context.options[0].minLineOfMultilineProperty
        ? context.options[0].minLineOfMultilineProperty
        : 2

    const callStack: CallExpression[] = []
    const sourceCode = context.sourceCode
    return Object.assign(
      utils.defineVueVisitor(context, {
        CallExpression(node) {
          callStack.push(node)
        },
        'CallExpression:exit'() {
          callStack.pop()
        },

        ObjectExpression(node: ObjectExpression) {
          if (callStack.length > 0) {
            return
          }
          const properties = node.properties
          for (let i = 1; i < properties.length; i++) {
            const cur = properties[i]
            const pre = properties[i - 1]

            const lineCountOfPreProperty =
              pre.loc.end.line - pre.loc.start.line + 1
            if (
              lineCountOfPreProperty < minLineOfMultilineProperty ||
              hasEmptyLine(sourceCode, pre, cur)
            ) {
              continue
            }

            context.report({
              node: pre,
              loc: {
                start: pre.loc.end,
                end: cur.loc.start
              },
              messageId: 'missingEmptyLine',
              fix(fixer) {
                let preToken: Token | null = null
                for (const token of iterateBetweenTokens(
                  sourceCode,
                  pre,
                  cur
                )) {
                  if (
                    preToken &&
                    preToken.loc.end.line < token.loc.start.line
                  ) {
                    return fixer.insertTextAfter(preToken, '\n')
                  }
                  preToken = token
                }
                const commaToken = sourceCode.getTokenAfter(pre, isComma)
                return fixer.insertTextAfter(commaToken || pre, '\n\n')
              }
            })
          }
        }
      })
    )
  }
}
