/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

/**
 * Strip quotes string
 */
function stripQuotesForHTML(text: string): string | null {
  if (['"', "'", '`'].includes(text[0]) && text[0] === text.at(-1)) {
    return text.slice(1, -1)
  }

  const re =
    /^(?:&(?:quot|apos|#\d+|#x[\da-f]+);|["'`])([\s\S]*)(?:&(?:quot|apos|#\d+|#x[\da-f]+);|["'`])$/u.exec(
      text
    )
  return re ? re[1] : null
}

/** Complete character references such as `&amp;`, `&#38;` and `&#x26;`. */
const CHARACTER_REFERENCE = /&(?:[a-z][\da-z]*|#\d+|#x[\da-f]+);/giu
/** `&bsol;`, `&#92;` and `&#x5c;` decode to a backslash, which starts an escape sequence. */
const BACKSLASH_REFERENCE = /&(?:bsol|#0*92|#x0*5c);/iu

/**
 * Checks whether the given string literal content contains a character reference
 * that would not render the same as static text.
 * Vue decodes character references in mustaches before evaluating the expression,
 * so only complete references without backslash escapes are kept as they are.
 */
function hasUnsafeCharacterReference(text: string): boolean {
  if (!text.includes('&')) {
    return false
  }
  const hasIncompleteReference = text
    .replaceAll(CHARACTER_REFERENCE, '')
    .includes('&')
  return (
    text.includes('\\') ||
    BACKSLASH_REFERENCE.test(text) ||
    hasIncompleteReference
  )
}

/**
 * Checks whether the text before the given offset ends with an unterminated
 * character reference start such as `&`, `&am` or `&#12`.
 */
function isAfterCharacterReferenceStart(text: string, offset: number): boolean {
  let index = offset - 1
  while (index >= 0 && /[\w#]/u.test(text[index])) {
    index--
  }
  return text[index] === '&'
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary mustache interpolations',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-useless-mustaches.html'
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          ignoreIncludesComment: {
            type: 'boolean'
          },
          ignoreStringEscape: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpected:
        'Unexpected mustache interpolation with a string literal value.'
    }
  },
  create(context: RuleContext) {
    const opts = context.options[0] || {}
    const ignoreIncludesComment = opts.ignoreIncludesComment
    const ignoreStringEscape = opts.ignoreStringEscape
    const sourceCode = context.sourceCode

    /**
     * Report if the value expression is string literals
     */
    function verify(node: VExpressionContainer) {
      const { expression } = node
      if (!expression) {
        return
      }
      let strValue: string
      let rawValue: string
      if (expression.type === 'Literal') {
        if (typeof expression.value !== 'string') {
          return
        }
        strValue = expression.value
        rawValue = sourceCode.getText(expression).slice(1, -1)
      } else if (expression.type === 'TemplateLiteral') {
        if (expression.expressions.length > 0) {
          return
        }
        strValue = expression.quasis[0].value.cooked
        rawValue = expression.quasis[0].value.raw
      } else {
        return
      }
      const tokenStore = sourceCode.parserServices.getTemplateBodyTokenStore()
      const hasComment = tokenStore
        .getTokens(node, { includeComments: true })
        .some((t) => t.type === 'Block' || t.type === 'Line')
      if (ignoreIncludesComment && hasComment) {
        return
      }

      let hasEscape = false
      if (rawValue !== strValue) {
        // check escapes
        const chars = [...rawValue]
        let c = chars.shift()
        while (c) {
          if (c === '\\') {
            c = chars.shift()
            if (
              c == null ||
              // ignore "\\", '"', "'", "`" and "$"
              'nrvtbfux'.includes(c)
            ) {
              // has useful escape.
              hasEscape = true
              break
            }
          }
          c = chars.shift()
        }
      }
      if (ignoreStringEscape && hasEscape) {
        return
      }

      context.report({
        node,
        messageId: 'unexpected',
        fix(fixer) {
          if (hasComment || hasEscape) {
            // cannot fix
            return null
          }
          const text = stripQuotesForHTML(sourceCode.getText(expression))
          if (text == null || text.includes('\n') || /^\s|\s$/u.test(text)) {
            // It doesn't autofix because another rule like indent or eol space might remove spaces.
            return null
          }
          const replacement = text
            .replaceAll('<', '&lt;')
            .replaceAll(/\\([\S\s])/g, '$1')
          const charBefore = sourceCode.text[node.range[0] - 1] ?? ''
          const charAfter = sourceCode.text[node.range[1]] ?? ''
          // `{{` in static text would start a new mustache interpolation.
          const canStartMustache =
            `${charBefore}${replacement}${charAfter}`.includes('{{')
          // `&` would join the surrounding text into a different character reference.
          const canJoinCharacterReference =
            isAfterCharacterReferenceStart(sourceCode.text, node.range[0]) &&
            /^[\w#;]/u.test(`${replacement}${charAfter}`)

          return canStartMustache ||
            canJoinCharacterReference ||
            hasUnsafeCharacterReference(text)
            ? null
            : fixer.replaceText(node, replacement)
        }
      })
    }

    return utils.defineTemplateBodyVisitor(context, {
      'VElement > VExpressionContainer': verify
    })
  }
}
