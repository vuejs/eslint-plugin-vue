/**
 * @author Barthy Bonhomme <post@barthy.koeln> <github.com/barthy-koeln>
 * @author Sergio Arbeo <sergio.arbeo@dockyard.com>
 * Adapted from https://github.com/DockYard/eslint-plugin-ember-suave/blob/master/lib/rules/lines-between-object-properties.js
 *
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const path = require('path')
const utils = require('../utils')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

// ...

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce empty lines between top-level options',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/empty-line-between-options.html'
    },
    fixable: 'whitespace',
    schema: [{ enum: ['always', 'never'] }],
    messages: {
      never: 'Unexpected blank line between Vue component options.',
      always: 'Expected blank line between Vue component options.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const isVueFile = utils.isVueFile(context.getFilename())
    if (!isVueFile) {
      return {}
    }

    const sourceCode = context.getSourceCode()
    const shouldPad = (context.options[0] || 'always') === 'always'

    const fixFunctions = {
      /**
       * Removes newlines between component options
       * @param {RuleFixer} fixer
       * @param {Token} currentLast
       * @param {Token} nextFirst
       * @return {Fix}
       */
      never(fixer, currentLast, nextFirst) {
        return fixer.replaceTextRange(
          [currentLast.range[1], nextFirst.range[0]],
          ',\n'
        )
      },
      /**
       * Add newlines between component options
       * @param {RuleFixer} fixer
       * @param {Token} currentLast
       * @return {Fix}
       */
      always(fixer, currentLast /*, nextFirst*/) {
        const tokenAfterLastToken = sourceCode.getTokenAfter(currentLast)
        const tokenToLineBreakAfter =
          tokenAfterLastToken.value === ',' ? tokenAfterLastToken : currentLast

        return fixer.insertTextAfter(tokenToLineBreakAfter, '\n')
      }
    }

    /**
     * Checks if there is an empty line between two tokens
     * @param {Token} first The first token
     * @param {Token} second The second token
     * @returns {boolean} True if there is at least a line between the tokens
     */
    function isPaddingBetweenTokens(first, second) {
      const comments = sourceCode.getCommentsBefore(second)
      const len = comments.length

      // If there is no comments
      if (len === 0) {
        const linesBetweenFstAndSnd =
          second.loc.start.line - first.loc.end.line - 1

        return linesBetweenFstAndSnd >= 1
      }

      // If there are comments
      let sumOfCommentLines = 0 // the numbers of lines of comments
      let prevCommentLineNum = -1 // line number of the end of the previous comment

      for (let i = 0; i < len; i++) {
        const commentLinesOfThisComment =
          comments[i].loc.end.line - comments[i].loc.start.line + 1

        sumOfCommentLines += commentLinesOfThisComment

        /*
         * If this comment and the previous comment are in the same line,
         * the count of comment lines is duplicated. So decrement sumOfCommentLines.
         */
        if (prevCommentLineNum === comments[i].loc.start.line) {
          sumOfCommentLines -= 1
        }

        prevCommentLineNum = comments[i].loc.end.line
      }

      /*
       * If the first block and the first comment are in the same line,
       * the count of comment lines is duplicated. So decrement sumOfCommentLines.
       */
      if (first.loc.end.line === comments[0].loc.start.line) {
        sumOfCommentLines -= 1
      }

      /*
       * If the last comment and the second block are in the same line,
       * the count of comment lines is duplicated. So decrement sumOfCommentLines.
       */
      if (comments[len - 1].loc.end.line === second.loc.start.line) {
        sumOfCommentLines -= 1
      }

      const linesBetweenFstAndSnd =
        second.loc.start.line - first.loc.end.line - 1

      return linesBetweenFstAndSnd - sumOfCommentLines >= 1
    }

    /**
     * Report error based on configuration
     * @param {ASTNode} node Where to report errors
     * @param {boolean} isPadded True if the option is followed by an empty line
     * @param {Token} currentLast End of checked token
     * @param {Token} nextFirst Start of next token
     */
    function reportError(node, isPadded, currentLast, nextFirst) {
      const key = isPadded ? 'never' : 'always'
      const fixFunction = fixFunctions[key]

      context.report({
        node,
        messageId: key,
        fix: (fixer) => fixFunction(fixer, currentLast, nextFirst)
      })
    }

    /**
     * Compares options and decides what to do
     * @param {ASTNode} option current option to check
     * @param {ASTNode} nextNode next node to check against
     */
    function checkOption(option, nextNode) {
      const currentLast = sourceCode.getLastToken(option)
      const nextFirst = sourceCode.getFirstToken(nextNode)
      const isPadded = isPaddingBetweenTokens(currentLast, nextFirst)

      if (shouldPad === isPadded) {
        return
      }

      reportError(nextNode, isPadded, currentLast, nextFirst)
    }

    return {
      /**
       * @param {import('vue-eslint-parser/ast').Node} node
       */
      ObjectExpression(node) {
        if (node.parent && node.parent.type !== 'ExportDefaultDeclaration') {
          return
        }

        const { properties } = node

        for (let i = 0; i < properties.length - 1; i++) {
          const property = properties[i]
          const nextProperty = properties[i + 1]

          checkOption(property, nextProperty)
        }
      }
    }
  }
}
