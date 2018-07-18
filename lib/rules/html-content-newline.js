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

function isMultiline (node, contentFirst, contentLast) {
  if (node.startTag.loc.start.line !== node.startTag.loc.end.line ||
    node.endTag.loc.start.line !== node.endTag.loc.end.line) {
    // multiline tag
    return true
  }
  if (contentFirst.loc.start.line < contentLast.loc.end.line) {
    // multiline contents
    return true
  }
  return false
}

function parseOptions (options) {
  return Object.assign({
    'singleline': 'ignore',
    'multiline': 'always',
    'ignoreNames': ['pre', 'textarea']
  }, options)
}

function getPhrase (lineBreaks) {
  switch (lineBreaks) {
    case 0: return 'no line breaks'
    case 1: return '1 line break'
    default: return `${lineBreaks} line breaks`
  }
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'require or disallow a line break before and after html contents',
      category: undefined,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.7.0/docs/rules/html-content-newline.md'
    },
    fixable: 'whitespace',
    schema: [{
      type: 'object',
      properties: {
        'singleline': { enum: ['ignore', 'always', 'never'] },
        'multiline': { enum: ['ignore', 'always', 'never'] },
        'ignoreNames': {
          type: 'array',
          items: { type: 'string' },
          uniqueItems: true,
          additionalItems: false
        }
      },
      additionalProperties: false
    }]
  },

  create (context) {
    const options = parseOptions(context.options[0])
    const template = context.parserServices.getTemplateBodyTokenStore && context.parserServices.getTemplateBodyTokenStore()

    return utils.defineTemplateBodyVisitor(context, {
      'VElement' (node) {
        if (node.startTag.selfClosing || !node.endTag) {
          // self closing
          return
        }
        let target = node
        while (target.type === 'VElement') {
          if (options.ignoreNames.indexOf(target.name) >= 0) {
          // ignore element name
            return
          }
          target = target.parent
        }
        const getTokenOption = { includeComments: true, filter: (token) => token.type !== 'HTMLWhitespace' }
        const contentFirst = template.getTokenAfter(node.startTag, getTokenOption)
        const contentLast = template.getTokenBefore(node.endTag, getTokenOption)
        const type = isMultiline(node, contentFirst, contentLast) ? options.multiline : options.singleline
        if (type === 'ignore') {
          // 'ignore' option
          return
        }
        const beforeLineBreaks = contentFirst.loc.start.line - node.startTag.loc.end.line
        const afterLineBreaks = node.endTag.loc.start.line - contentLast.loc.end.line
        const expectedLineBreaks = type === 'always' ? 1 : 0
        if (expectedLineBreaks !== beforeLineBreaks) {
          context.report({
            node: template.getLastToken(node.startTag),
            loc: {
              start: node.startTag.loc.end,
              end: contentFirst.loc.start
            },
            message: `Expected {{expected}} after closing bracket of the "{{name}}" element, but {{actual}} found.`,
            data: {
              name: node.name,
              expected: getPhrase(expectedLineBreaks),
              actual: getPhrase(beforeLineBreaks)
            },
            fix (fixer) {
              const range = [node.startTag.range[1], contentFirst.range[0]]
              const text = '\n'.repeat(expectedLineBreaks)
              return fixer.replaceTextRange(range, text)
            }
          })
        }

        if (expectedLineBreaks !== afterLineBreaks) {
          context.report({
            node: template.getFirstToken(node.endTag),
            loc: {
              start: contentLast.loc.end,
              end: node.endTag.loc.start
            },
            message: 'Expected {{expected}} before opening bracket of the "{{name}}" element, but {{actual}} found.',
            data: {
              name: node.name,
              expected: getPhrase(expectedLineBreaks),
              actual: getPhrase(afterLineBreaks)
            },
            fix (fixer) {
              const range = [contentLast.range[1], node.endTag.range[0]]
              const text = '\n'.repeat(expectedLineBreaks)
              return fixer.replaceTextRange(range, text)
            }
          })
        }
      }
    })
  }
}
