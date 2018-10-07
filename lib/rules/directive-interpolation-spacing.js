/**
 * @fileoverview enforce unified spacing in directive interpolations.
 * @author Rafael Milewski <https://github.com/milewski>
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function isOpenBrace (token) {
  return token.type === 'Punctuator' && token.value === '{'
}

function isCloseBrace (token) {
  return token.type === 'Punctuator' && token.value === '}'
}

function isEndOf (punctuator, token) {
  return punctuator.value !== ',' && token.value !== ']' && token.type !== 'Identifier' && token.type !== 'Numeric'
}

function getOpenAndCloseBraces (node, tokens) {
  let root = tokens.getFirstToken(node)
  let openBrace, closeBrace

  while (true) {
    root = tokens.getTokenAfter(root)

    if (!root) {
      return
    }

    if (isOpenBrace(root)) {
      openBrace = root
    } else if (isCloseBrace(root)) {
      closeBrace = root
    }

    if (openBrace && closeBrace) {
      return { openBrace, closeBrace }
    }
  }
}

module.exports = {
  meta: {
    docs: {
      description: 'enforce unified spacing in directive interpolations',
      category: 'strongly-recommended',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.3/docs/rules/directive-interpolation-spacing.md'
    },
    fixable: 'whitespace',
    schema: [{ enum: ['always', 'never'] }]
  },

  create (context) {
    const options = context.options[0] || 'always'
    const template =
      context.parserServices.getTemplateBodyTokenStore &&
      context.parserServices.getTemplateBodyTokenStore()

    // ----------------------------------------------------------------------
    // Public
    // ----------------------------------------------------------------------

    return utils.defineTemplateBodyVisitor(context, {
      VDirectiveKey (node) {
        const openAndCloseTokens = getOpenAndCloseBraces(node, template)

        /**
         * If these are not present,
         * somewhat it is an invalid syntax not possible to continue
         */
        if (!openAndCloseTokens) {
          return
        }

        const { openBrace, closeBrace } = openAndCloseTokens
        const nextToken = template.getTokenAfter(openBrace)
        const previousToken = template.getTokenBefore(closeBrace)

        const punctuators = template.getTokensBetween(nextToken, previousToken).filter(({ value }) => (value === ':' || value === '?' || value === ','))

        const firstToken = template.getTokenBefore(openBrace)
        const lastToken = template.getTokenAfter(closeBrace)

        /**
         * Space out inner braces :class="{[+x][expression][+x]}"
         */
        if (options === 'always') {
          if (openBrace.range[0] === nextToken.range[0] - 1) {
            context.report({
              node: nextToken,
              message: `Expected 1 space after '{', but not found.`,
              fix: fixer => fixer.insertTextAfter(openBrace, ' ')
            })
          }
          if (closeBrace.range[0] === previousToken.range[1]) {
            context.report({
              node: closeBrace,
              message: `Expected 1 space before '}', but not found.`,
              fix: fixer => fixer.insertTextBefore(closeBrace, ' ')
            })
          }
        } else {
          if (openBrace.range[1] !== nextToken.range[0]) {
            context.report({
              node: openBrace,
              loc: {
                start: openBrace.loc.end,
                end: openBrace.loc.start
              },
              message: `Expected no space after '{', but found.`,
              fix: fixer => fixer.removeRange([openBrace.range[1], nextToken.range[0]])
            })
          }

          if (closeBrace.range[0] !== previousToken.range[1]) {
            context.report({
              node: closeBrace,
              message: `Expected no space before '}', but found.`,
              fix: fixer => fixer.removeRange([previousToken.range[1], closeBrace.range[0]])
            })
          }
        }

        /**
         * Remove spaces from outer braces :class="[-x]{ [expression] }[-x]"
         */
        if (firstToken.range[1] !== openBrace.range[0] && firstToken.value === '"') {
          context.report({
            node: firstToken,
            loc: {
              start: firstToken.loc.end,
              end: firstToken.loc.start
            },
            message: `Expected no space before '{', but found.`,
            fix: fixer => fixer.removeRange([firstToken.range[1], openBrace.range[0]])
          })
        } else if (firstToken.range[1] === openBrace.range[0] && firstToken.value !== '"') {
          context.report({
            node: openBrace,
            message: `Expected 1 space before '{', but not found.`,
            fix: fixer => fixer.insertTextAfter(firstToken, ' ')
          })
        }

        if (lastToken.range[0] !== closeBrace.range[1] && lastToken.value === '"') {
          context.report({
            node: lastToken,
            message: `Expected no space after '}', but found.`,
            fix: fixer => fixer.removeRange([closeBrace.range[1], lastToken.range[0]])
          })
        } else if (lastToken.range[0] === closeBrace.range[1] && lastToken.value !== '"') {
          context.report({
            node: lastToken,
            message: `Expected 1 space after '}', but not found.`,
            fix: fixer => fixer.insertTextBefore(lastToken, ' ')
          })
        }

        /**
         * Space out every Punctuator[:?] :class="{ [key][-x]:[+x][expression] }"
         */
        for (const punctuator of punctuators) {
          const nextToken = template.getTokenAfter(punctuator)
          const previousToken = template.getTokenBefore(punctuator)

          if (punctuator.range[1] === nextToken.range[0]) {
            context.report({
              node: punctuator,
              loc: {
                start: punctuator.loc.end,
                end: punctuator.loc.start
              },
              message: `Expected 1 space after '{{ displayValue }}', but not found.`,
              data: {
                displayValue: punctuator.value
              },
              fix: fixer => fixer.insertTextAfter(punctuator, ' ')
            })
          }

          if (punctuator.range[0] === previousToken.range[1] && isEndOf(punctuator, previousToken)) {
            context.report({
              node: punctuator,
              message: `Expected 1 space before '{{ displayValue }}', but not found.`,
              data: {
                displayValue: punctuator.value
              },
              fix: fixer => fixer.insertTextBefore(punctuator, ' ')
            })
          }

          if (previousToken.range[1] !== punctuator.range[0] && !isEndOf(punctuator, previousToken)) {
            context.report({
              node: punctuator,
              message: `Expected no space before '{{ displayValue }}', but found.`,
              data: {
                displayValue: punctuator.value
              },
              fix: fixer => fixer.removeRange([previousToken.range[1], punctuator.range[0]])
            })
          }
        }
      }
    })
  }
}
