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

function isMultilineElement (element) {
  return element.loc.start.line < element.endTag.loc.start.line
}

function parseOptions (options) {
  return Object.assign({
    'ignores': ['pre', 'textarea']
  }, options)
}

function getPhrase (lineBreaks) {
  switch (lineBreaks) {
    case 0: return 'no'
    default: return `${lineBreaks}`
  }
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
      description: 'require a line break before and after the contents of a multiline element',
      category: undefined,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.3/docs/rules/multiline-html-element-content-newline.md'
    },
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
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
      unexpectedAfterClosingBracket: 'Expected 1 line break after opening tag (`<{{name}}>`), but {{actual}} line breaks found.',
      unexpectedBeforeOpeningBracket: 'Expected 1 line break before closing tag (`</{{name}}>`), but {{actual}} line breaks found.'
    }
  },

  create (context) {
    const ignores = parseOptions(context.options[0]).ignores
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

        if (!isMultilineElement(node)) {
          return
        }

        const getTokenOption = { includeComments: true, filter: (token) => token.type !== 'HTMLWhitespace' }
        const contentFirst = template.getTokenAfter(node.startTag, getTokenOption)
        const contentLast = template.getTokenBefore(node.endTag, getTokenOption)

        const beforeLineBreaks = contentFirst.loc.start.line - node.startTag.loc.end.line
        const afterLineBreaks = node.endTag.loc.start.line - contentLast.loc.end.line
        if (beforeLineBreaks !== 1) {
          context.report({
            node: template.getLastToken(node.startTag),
            loc: {
              start: node.startTag.loc.end,
              end: contentFirst.loc.start
            },
            messageId: 'unexpectedAfterClosingBracket',
            data: {
              name: node.name,
              actual: getPhrase(beforeLineBreaks)
            },
            fix (fixer) {
              const range = [node.startTag.range[1], contentFirst.range[0]]
              return fixer.replaceTextRange(range, '\n')
            }
          })
        }

        if (isEmpty(node, sourceCode)) {
          return
        }

        if (afterLineBreaks !== 1) {
          context.report({
            node: template.getFirstToken(node.endTag),
            loc: {
              start: contentLast.loc.end,
              end: node.endTag.loc.start
            },
            messageId: 'unexpectedBeforeOpeningBracket',
            data: {
              name: node.name,
              actual: getPhrase(afterLineBreaks)
            },
            fix (fixer) {
              const range = [contentLast.range[1], node.endTag.range[0]]
              return fixer.replaceTextRange(range, '\n')
            }
          })
        }
      },
      'VElement:exit' (node) {
        if (inIgnoreElement === node) {
          inIgnoreElement = null
        }
      }
    })
  }
}
