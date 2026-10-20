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
          const prevChar = sourceCode.text[node.range[0] - 1] ?? ''
          const nextChar = sourceCode.text[node.range[1]] ?? ''
          if (`${prevChar}${replacement}${nextChar}`.includes('{{')) {
            // `{{` in static text would start a new mustache interpolation.
            return null
          }

          return fixer.replaceText(node, replacement)
        }
      })
    }

    return utils.defineTemplateBodyVisitor(context, {
      'VElement > VExpressionContainer': verify
    })
  }
}
