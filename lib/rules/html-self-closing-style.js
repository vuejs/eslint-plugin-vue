/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
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

/**
 * Kind strings.
 * This strings wil be displayed in error messages.
 */
const KIND = Object.freeze({
  NORMAL: 'HTML elements',
  VOID: 'HTML void elements',
  COMPONENT: 'Vue.js custom components',
  SVG: 'SVG elements',
  MATH: 'MathML elements'
})

/**
 * Normalize the given options.
 * @param {Object|undefined} options The raw options object.
 * @returns {Object} Normalized options.
 */
function parseOptions (options) {
  return {
    [KIND.NORMAL]: (options && options.html && options.html.normal) || 'never',
    [KIND.VOID]: (options && options.html && options.html.void) || 'never',
    [KIND.COMPONENT]: (options && options.html && options.html.component) || 'always',
    [KIND.SVG]: (options && options.svg) || 'always',
    [KIND.MATH]: (options && options.math) || 'always'
  }
}

/**
 * Get the kind of the given element.
 * @param {VElement} node The element node to get.
 * @returns {string} The kind of the element.
 */
function getKind (node) {
  if (utils.isCustomComponent(node)) {
    return KIND.COMPONENT
  }
  if (utils.isHtmlElementNode(node)) {
    if (utils.isHtmlVoidElementName(node.name)) {
      return KIND.VOID
    }
    return KIND.NORMAL
  }
  if (utils.isSvgElementNode(node)) {
    return KIND.SVG
  }
  if (utils.isMathMLElementNode(node)) {
    return KIND.MATH
  }
  return 'unknown elements'
}

/**
 * Check whether the given element is empty or not.
 * This ignores whitespaces, doesn't ignore comments.
 * @param {VElement} node The element node to check.
 * @returns {boolean} `true` if the element is empty.
 */
function isEmpty (node, sourceCode) {
  const start = node.startTag.range[1]
  const end = (node.endTag != null) ? node.endTag.range[0] : node.range[1]

  return sourceCode.text.slice(start, end).trim() === ''
}

/**
 * Creates AST event handlers for html-self-closing-style.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create (context) {
  const sourceCode = context.getSourceCode()
  const options = parseOptions(context.options[0])

  utils.registerTemplateBodyVisitor(context, {
    'VElement' (node) {
      const kind = getKind(node)
      const mode = options[kind]

      if (mode === 'always' && !node.startTag.selfClosing && isEmpty(node, sourceCode)) {
        context.report({
          node,
          loc: node.loc,
          message: 'Require self-closing on {{kind}}.',
          data: { kind },
          fix: (fixer) => {
            const tokens = context.parserServices.getTemplateBodyTokenStore()
            const close = tokens.getLastToken(node.startTag)
            if (close.type !== 'HTMLTagClose') {
              return null
            }
            return fixer.replaceTextRange([close.range[0], node.range[1]], '/>')
          }
        })
      }

      if (mode === 'never' && node.startTag.selfClosing) {
        context.report({
          node,
          loc: node.loc,
          message: 'Disallow self-closing on {{kind}}.',
          data: { kind },
          fix: (fixer) => {
            const tokens = context.parserServices.getTemplateBodyTokenStore()
            const close = tokens.getLastToken(node.startTag)
            if (close.type !== 'HTMLSelfClosingTagClose') {
              return null
            }
            if (kind === KIND.VOID) {
              return fixer.replaceText(close, '>')
            }
            return fixer.replaceText(close, `></${node.rawName}>`)
          }
        })
      }
    }
  })

  return {}
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create,
  meta: {
    docs: {
      description: 'enforce self-closing style.',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',
    schema: {
      definitions: {
        optionValue: {
          enum: ['always', 'never', 'any']
        }
      },
      type: 'array',
      items: [{
        type: 'object',
        properties: {
          html: {
            type: 'object',
            properties: {
              normal: { $ref: '#/definitions/optionValue' },
              void: { $ref: '#/definitions/optionValue' },
              component: { $ref: '#/definitions/optionValue' }
            },
            additionalProperties: false
          },
          svg: { $ref: '#/definitions/optionValue' },
          math: { $ref: '#/definitions/optionValue' }
        },
        additionalProperties: false
      }],
      maxItems: 1
    }
  }
}
