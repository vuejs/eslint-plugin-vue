/**
 * @author Yosuke Ota
 * @fileoverview Rule to disalow whitespace that is not a tab or space, whitespace inside strings and comments are allowed
 */

import utils from '../utils/index.js'

const ALL_IRREGULARS =
  /[\f\v\u{85}\u{FEFF}\u{A0}\u{1680}\u{180E}\u{2000}\u{2001}\u{2002}\u{2003}\u{2004}\u{2005}\u{2006}\u{2007}\u{2008}\u{2009}\u{200A}\u{200B}\u{202F}\u{205F}\u{3000}\u{2028}\u{2029}]/u
const IRREGULAR_WHITESPACE =
  /[\f\v\u{85}\u{FEFF}\u{A0}\u{1680}\u{180E}\u{2000}\u{2001}\u{2002}\u{2003}\u{2004}\u{2005}\u{2006}\u{2007}\u{2008}\u{2009}\u{200A}\u{200B}\u{202F}\u{205F}\u{3000}]+/gmu
const IRREGULAR_LINE_TERMINATORS = /[\u{2028}\u{2029}]/gmu

export default {
  meta: {
    type: 'problem',

    docs: {
      description: 'disallow irregular whitespace in `.vue` files',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-irregular-whitespace.html',
      extensionSource: {
        url: 'https://eslint.org/docs/rules/no-irregular-whitespace',
        name: 'ESLint core'
      }
    },

    schema: [
      {
        type: 'object',
        properties: {
          skipComments: { type: 'boolean' },
          skipStrings: { type: 'boolean' },
          skipTemplates: { type: 'boolean' },
          skipRegExps: { type: 'boolean' },
          skipHTMLAttributeValues: { type: 'boolean' },
          skipHTMLTextContents: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ],
    messages: {
      disallow: 'Irregular whitespace not allowed.'
    }
  },
  /**
   * @param {RuleContext} context - The rule context.
   * @returns {RuleListener} AST event handlers.
   */
  create(context) {
    // Module store of error ranges that we have found
    /** @type {{start: number, end: number}[]} */
    let errorIndices = []

    // Lookup the `skipComments` option, which defaults to `false`.
    const options = context.options[0] || {}
    const shouldSkipComments = !!options.skipComments
    const shouldSkipStrings = options.skipStrings !== false
    const shouldSkipRegExps = !!options.skipRegExps
    const shouldSkipTemplates = !!options.skipTemplates
    const shouldSkipHTMLAttributeValues = !!options.skipHTMLAttributeValues
    const shouldSkipHTMLTextContents = !!options.skipHTMLTextContents

    const sourceCode = context.sourceCode

    /**
     * Removes errors that occur inside a string node
     * @param {ASTNode | Token} node to check for matching errors.
     * @returns {void}
     * @private
     */
    function removeWhitespaceError(node) {
      const [startIndex, endIndex] = node.range

      errorIndices = errorIndices.filter(
        (error) => error.start < startIndex || endIndex <= error.start
      )
    }

    /**
     * Checks literal nodes for errors that we are choosing to ignore and calls the relevant methods to remove the errors
     * @param {Literal} node to check for matching errors.
     * @returns {void}
     * @private
     */
    function removeInvalidNodeErrorsInLiteral(node) {
      const shouldCheckStrings =
        shouldSkipStrings && typeof node.value === 'string'
      const shouldCheckRegExps = shouldSkipRegExps && Boolean(node.regex)

      // If we have irregular characters, remove them from the errors list
      if (
        (shouldCheckStrings || shouldCheckRegExps) &&
        ALL_IRREGULARS.test(sourceCode.getText(node))
      ) {
        removeWhitespaceError(node)
      }
    }

    /**
     * Checks template string literal nodes for errors that we are choosing to ignore and calls the relevant methods to remove the errors
     * @param {TemplateElement} node to check for matching errors.
     * @returns {void}
     * @private
     */
    function removeInvalidNodeErrorsInTemplateLiteral(node) {
      if (ALL_IRREGULARS.test(node.value.raw)) {
        removeWhitespaceError(node)
      }
    }

    /**
     * Checks HTML attribute value nodes for errors that we are choosing to ignore and calls the relevant methods to remove the errors
     * @param {VLiteral} node to check for matching errors.
     * @returns {void}
     * @private
     */
    function removeInvalidNodeErrorsInHTMLAttributeValue(node) {
      if (ALL_IRREGULARS.test(sourceCode.getText(node))) {
        removeWhitespaceError(node)
      }
    }

    /**
     * Checks HTML text content nodes for errors that we are choosing to ignore and calls the relevant methods to remove the errors
     * @param {VText} node to check for matching errors.
     * @returns {void}
     * @private
     */
    function removeInvalidNodeErrorsInHTMLTextContent(node) {
      if (ALL_IRREGULARS.test(sourceCode.getText(node))) {
        removeWhitespaceError(node)
      }
    }

    /**
     * Checks comment nodes for errors that we are choosing to ignore and calls the relevant methods to remove the errors
     * @param {Comment | HTMLComment | HTMLBogusComment} node to check for matching errors.
     * @returns {void}
     * @private
     */
    function removeInvalidNodeErrorsInComment(node) {
      if (ALL_IRREGULARS.test(node.value)) {
        removeWhitespaceError(node)
      }
    }

    /**
     * Checks the program source for irregular whitespaces and irregular line terminators
     * @returns {void}
     * @private
     */
    function checkForIrregularWhitespace() {
      const source = sourceCode.getText()
      let match
      while ((match = IRREGULAR_WHITESPACE.exec(source)) !== null) {
        errorIndices.push({
          start: match.index,
          end: match.index + match[0].length
        })
      }
      while ((match = IRREGULAR_LINE_TERMINATORS.exec(source)) !== null) {
        errorIndices.push({
          start: match.index,
          end: match.index + match[0].length
        })
      }
    }

    checkForIrregularWhitespace()

    if (errorIndices.length === 0) {
      return {}
    }
    const bodyVisitor = utils.defineTemplateBodyVisitor(context, {
      ...(shouldSkipHTMLAttributeValues
        ? {
            'VAttribute[directive=false] > VLiteral':
              removeInvalidNodeErrorsInHTMLAttributeValue
          }
        : {}),
      ...(shouldSkipHTMLTextContents
        ? { VText: removeInvalidNodeErrorsInHTMLTextContent }
        : {}),

      // inline scripts
      Literal: removeInvalidNodeErrorsInLiteral,
      ...(shouldSkipTemplates
        ? { TemplateElement: removeInvalidNodeErrorsInTemplateLiteral }
        : {})
    })
    return {
      ...bodyVisitor,
      Literal: removeInvalidNodeErrorsInLiteral,
      ...(shouldSkipTemplates
        ? { TemplateElement: removeInvalidNodeErrorsInTemplateLiteral }
        : {}),
      'Program:exit'(node) {
        if (bodyVisitor['Program:exit']) {
          bodyVisitor['Program:exit'](node)
        }
        const templateBody = node.templateBody
        if (shouldSkipComments) {
          // First strip errors occurring in comment nodes.
          for (const node of sourceCode.getAllComments()) {
            removeInvalidNodeErrorsInComment(node)
          }
          if (templateBody) {
            for (const node of templateBody.comments) {
              removeInvalidNodeErrorsInComment(node)
            }
          }
        }

        // Removes errors that occur outside script and template
        const [scriptStart, scriptEnd] = node.range
        const [templateStart, templateEnd] = templateBody
          ? templateBody.range
          : [0, 0]
        errorIndices = errorIndices.filter(
          (error) =>
            (scriptStart <= error.start && error.start < scriptEnd) ||
            (templateStart <= error.start && error.start < templateEnd)
        )

        // If we have any errors remaining, report on them
        for (const { start, end } of errorIndices) {
          context.report({
            loc: {
              start: sourceCode.getLocFromIndex(start),
              end: sourceCode.getLocFromIndex(end)
            },
            messageId: 'disallow'
          })
        }
      }
    }
  }
}
