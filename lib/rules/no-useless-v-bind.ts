/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

const DOUBLE_QUOTES_RE = /"/gu
const SINGLE_QUOTES_RE = /'/gu

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unnecessary `v-bind` directives',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-useless-v-bind.html'
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
      unexpected: 'Unexpected `v-bind` with a string literal value.'
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
    function verify(node: VDirective) {
      const { value, key } = node
      if (!value || key.modifiers.length > 0) {
        return
      }
      const { expression } = value
      if (!expression || !utils.isStringLiteral(expression)) {
        return
      }
      const strValue = utils.getStringLiteralValue(expression)
      if (strValue == null) {
        return
      }
      const rawValue =
        expression.type === 'Literal'
          ? sourceCode.getText(expression).slice(1, -1)
          : expression.quasis[0].value.raw

      const tokenStore = sourceCode.parserServices.getTemplateBodyTokenStore()
      const hasComment = tokenStore
        .getTokens(value, { includeComments: true })
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
        *fix(fixer) {
          if (hasComment || hasEscape) {
            // cannot fix
            return
          }
          const text = sourceCode.getText(value)
          const quoteChar = text[0]

          const isShorthand = key.name.rawName === ':'
          const keyDirectiveRange: Range = [
            key.name.range[0],
            key.name.range[1] + (isShorthand ? 0 : 1)
          ]

          yield fixer.removeRange(keyDirectiveRange)

          let attrValue
          if (quoteChar === '"') {
            attrValue = strValue.replaceAll(DOUBLE_QUOTES_RE, '&quot;')
            attrValue = quoteChar + attrValue + quoteChar
          } else if (quoteChar === "'") {
            attrValue = strValue.replaceAll(SINGLE_QUOTES_RE, '&apos;')
            attrValue = quoteChar + attrValue + quoteChar
          } else {
            attrValue = strValue
              .replaceAll(DOUBLE_QUOTES_RE, '&quot;')
              .replaceAll(SINGLE_QUOTES_RE, '&apos;')
          }
          yield fixer.replaceText(value, attrValue)
        }
      })
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='bind'][key.argument!=null]":
        verify
    })
  }
}
