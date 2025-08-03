'use strict'

const path = require('node:path')
const rules = require('../tools/lib/rules.js')

/** @typedef {import('@eslint/markdown').MarkdownSourceCode} MarkdownSourceCode */

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require make some words in markdown into link',
      categories: ['Internal']
    },
    fixable: 'code',
    schema: [],
    messages: {
      requireLink: 'The word "{{name}}" should be a link.'
    }
  },

  /** @param {import('@eslint/core').RuleContext<{ Code: MarkdownSourceCode }>} context */
  create(context) {
    const sourceCode = context.sourceCode
    const inDocs = context.filename.includes('/docs/')
    const linkWords = {
      ...Object.fromEntries(
        rules
          .map((rule) => [
            rule.ruleId,
            inDocs
              ? `./${path.relative(path.dirname(context.filename), path.resolve(__dirname, '../docs/rules', `./${rule.name}.md`))}`
              : `https://eslint.vuejs.org/rules/${rule.name}.html`
          ])
          .filter(([, link]) => link !== `./${path.basename(context.filename)}`)
      ),
      'vue-eslint-parser': 'https://github.com/vuejs/vue-eslint-parser',
      '@typescript-eslint/parser':
        'https://typescript-eslint.io/packages/parser',
      'eslint-typegen': 'https://github.com/antfu/eslint-typegen',
      '@stylistic/eslint-plugin': 'https://eslint.style/'
    }
    /** @typedef {import("mdast").Link | import("mdast").LinkReference | import("mdast").Heading} IgnoreNode */
    /** @type {IgnoreNode | null} */
    let ignore = null
    return {
      /**
       * @param {IgnoreNode} node
       */
      'link, linkReference, heading'(node) {
        if (ignore) return
        ignore = node
      },
      /**
       * @param {IgnoreNode} node
       */
      'link, linkReference, heading:exit'(node) {
        if (ignore === node) ignore = null
      },
      /**
       * @param {import("mdast").Text} node
       */
      text(node) {
        if (ignore) return
        for (const [word, link] of Object.entries(linkWords)) {
          let startPosition = 0
          let index = 0
          while ((index = node.value.indexOf(word, startPosition)) >= 0) {
            startPosition = index + word.length
            if (
              (node.value[index - 1] || '').trim() ||
              (node.value[index + word.length] || '').trim()
            ) {
              // not a whole word
              continue
            }

            const loc = sourceCode.getLoc(node)
            const beforeLines = node.value.slice(0, index).split(/\n/gu)
            const line = loc.start.line + beforeLines.length - 1
            const column =
              (beforeLines.length === 1 ? loc.start.column : 1) +
              (beforeLines.at(-1) || '').length

            context.report({
              node,
              loc: {
                start: { line, column },
                end: { line, column: column + word.length }
              },
              messageId: 'requireLink',
              data: {
                name: word
              },
              fix(fixer) {
                const [start] = sourceCode.getRange(node)
                return fixer.replaceTextRange(
                  [start + index, start + index + word.length],
                  `[${word}](${link})`
                )
              }
            })
          }
          // }
        }
      },
      /**
       * @param {import("mdast").InlineCode} node
       */
      inlineCode(node) {
        if (ignore) return
        for (const [word, link] of Object.entries(linkWords)) {
          if (node.value === word) {
            context.report({
              node,
              messageId: 'requireLink',
              data: {
                name: word
              },
              fix(fixer) {
                return fixer.replaceText(node, `[\`${word}\`](${link})`)
              }
            })
          }
        }
      }
    }
  }
}
