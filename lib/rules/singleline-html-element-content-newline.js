/**
 * @author Yosuke Ota
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

function isSinglelineElement (element) {
  return element.loc.start.line === element.endTag.loc.start.line
}

function parseOptions (options) {
  return Object.assign({
    'ignores': ['pre', 'textarea'],
    'ignoreWhenNoAttributes': true
  }, options)
}

/**
 * Check whether the given element is empty or not.
 * This ignores whitespaces, doesn't ignore comments.
 * @param {VElement} node The element node to check.
 * @param {SourceCode} sourceCode The source code object of the current context.
 * @returns {boolean} `true` if the element is empty.
 */
function isEmpty (node, sourceCode) {
  const start = node.startTag.range[1]
  const end = node.endTag.range[0]
  return sourceCode.text.slice(start, end).trim() === ''
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'require a line break before and after the contents of a singleline element',
      category: undefined,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.2/docs/rules/singleline-html-element-content-newline.md'
    },
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
        'ignoreWhenNoAttributes': {
          type: 'boolean'
        },
        'ignores': {
          type: 'array',
          items: { type: 'string' },
          uniqueItems: true,
          additionalItems: false
        }
      },
      additionalProperties: false
    }],
    messages: {
      unexpectedAfterClosingBracket: 'Expected 1 line break after opening tag (`<{{name}}>`), but no line breaks found.',
      unexpectedBeforeOpeningBracket: 'Expected 1 line break before closing tag (`</{{name}}>`), but no line breaks found.'
    }
  },

  create (context) {
    const options = parseOptions(context.options[0])
    const ignores = options.ignores
    const ignoreWhenNoAttributes = options.ignoreWhenNoAttributes
    const template = context.parserServices.getTemplateBodyTokenStore && context.parserServices.getTemplateBodyTokenStore()
    const sourceCode = context.getSourceCode()

    let inIgnoreElement

    return utils.defineTemplateBodyVisitor(context, {
      'VElement' (node) {
        if (inIgnoreElement) {
          return
        }
        if (ignores.indexOf(node.name) >= 0) {
          // ignore element name
          inIgnoreElement = node
          return
        }
        if (node.startTag.selfClosing || !node.endTag) {
          // self closing
          return
        }

        if (!isSinglelineElement(node)) {
          return
        }
        if (ignoreWhenNoAttributes && node.startTag.attributes.length === 0) {
          return
        }

        const getTokenOption = { includeComments: true, filter: (token) => token.type !== 'HTMLWhitespace' }
        const contentFirst = template.getTokenAfter(node.startTag, getTokenOption)
        const contentLast = template.getTokenBefore(node.endTag, getTokenOption)

        context.report({
          node: template.getLastToken(node.startTag),
          loc: {
            start: node.startTag.loc.end,
            end: contentFirst.loc.start
          },
          messageId: 'unexpectedAfterClosingBracket',
          data: {
            name: node.name
          },
          fix (fixer) {
            const range = [node.startTag.range[1], contentFirst.range[0]]
            return fixer.replaceTextRange(range, '\n')
          }
        })

        if (isEmpty(node, sourceCode)) {
          return
        }

        context.report({
          node: template.getFirstToken(node.endTag),
          loc: {
            start: contentLast.loc.end,
            end: node.endTag.loc.start
          },
          messageId: 'unexpectedBeforeOpeningBracket',
          data: {
            name: node.name
          },
          fix (fixer) {
            const range = [contentLast.range[1], node.endTag.range[0]]
            return fixer.replaceTextRange(range, '\n')
          }
        })
      },
      'VElement:exit' (node) {
        if (inIgnoreElement === node) {
          inIgnoreElement = null
        }
      }
    })
  }
}
