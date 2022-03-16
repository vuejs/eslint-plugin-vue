/**
 * @author Barthy Bonhomme <post@barthy.koeln> (https://github.com/barthy-koeln)
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

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
       *
       * @param {RuleFixer} fixer
       * @param {number} endOfCurrent
       * @param {number} startOfNext
       * @return {Fix}
       */
      never(fixer, endOfCurrent, startOfNext) {
        return fixer.replaceTextRange([endOfCurrent, startOfNext], '\n')
      },
      /**
       * Add newlines between component options.
       *
       * @param {RuleFixer} fixer
       * @param {number} endOfCurrent
       * @return {Fix}
       */
      always(fixer, endOfCurrent /*, startOfNext*/) {
        return fixer.insertTextAfterRange([0, endOfCurrent], '\n')
      }
    }

    /**
     * Report error based on configuration.
     *
     * @param {ASTNode} node Where to report errors
     * @param {boolean} isPadded True if the option is followed by an empty line
     * @param {number} endOfCurrent End of checked token
     * @param {number} startOfNext Start of next token
     */
    function reportError(node, isPadded, endOfCurrent, startOfNext) {
      const key = isPadded ? 'never' : 'always'
      const fixFunction = fixFunctions[key]

      context.report({
        node,
        messageId: key,
        fix: (fixer) => fixFunction(fixer, endOfCurrent, startOfNext)
      })
    }

    /**
     * Compares options and decides what to do.
     * This takes into account comments before options, but not empty lines between multiple comments.
     *
     * @param {ASTNode} current current option to check
     * @param {ASTNode} next next node to check against
     */
    function checkOption(current, next) {
      const endOfCurrent =
        sourceCode.getIndexFromLoc({
          line: current.loc.end.line + 1,
          column: 0
        }) - 1 /* start of next line, -1 for previous line */

      const comments = sourceCode.getCommentsBefore(next)
      const nextNode = comments.length ? comments[0] : next

      const startOfNext = sourceCode.getIndexFromLoc({
        line: nextNode.loc.start.line,
        column: 0
      })

      const isPadded = startOfNext !== endOfCurrent + 1
      if (shouldPad === isPadded) {
        return
      }

      reportError(next, isPadded, endOfCurrent, startOfNext)
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
