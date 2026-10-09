/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow content outside of the top-level blocks',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-content-outside-block.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      unexpectedContent:
        'Unexpected content outside of the top-level blocks. It is dropped by the compiler.',
      removeContent: 'Remove the content outside of the top-level blocks.'
    }
  },
  create(context: RuleContext): RuleListener {
    const sourceCode = context.sourceCode
    const documentFragment =
      sourceCode.parserServices.getDocumentFragment &&
      sourceCode.parserServices.getDocumentFragment()
    if (!documentFragment) {
      // Not a `.vue` file, or the parser is not `vue-eslint-parser`.
      return {}
    }

    return {
      Program(node: Program) {
        if (utils.hasInvalidEOF(node)) {
          return
        }
        for (const child of documentFragment.children) {
          if (child.type !== 'VText') {
            // Top-level elements (including custom blocks) are fine, and
            // HTML comments are not stored in `children` at all.
            continue
          }
          // The raw text has to be used instead of `child.value`, because the
          // value is normalized (HTML entities are decoded and CRLF is
          // converted to LF), so its length does not match the source range.
          const [start, end] = child.range
          const raw = sourceCode.text.slice(start, end)
          const leading = raw.length - raw.trimStart().length
          if (leading === raw.length) {
            // Whitespace only.
            continue
          }
          const trailing = raw.length - raw.trimEnd().length
          const contentRange: Range = [start + leading, end - trailing]

          context.report({
            loc: {
              start: sourceCode.getLocFromIndex(contentRange[0]),
              end: sourceCode.getLocFromIndex(contentRange[1])
            },
            messageId: 'unexpectedContent',
            suggest: [
              {
                messageId: 'removeContent',
                fix: (fixer: RuleFixer) => fixer.removeRange(contentRange)
              }
            ]
          })
        }
      }
    }
  }
}
