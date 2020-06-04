/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

const DOUBLE_QUOTES_RE = /"/gu
const SINGLE_QUOTES_RE = /'/gu

/**
 * @typedef {import('eslint').Rule.RuleContext} RuleContext
 * @typedef {import('vue-eslint-parser').AST.VDirective} VDirective
 */

module.exports = {
  meta: {
    docs: {
      description: 'disallow unnecessary `v-bind` directives',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-useless-v-bind.html'
    },
    fixable: 'code',
    messages: {
      unexpected: 'Unexpected `v-bind` with a string literal value.'
    },
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
        }
      }
    ],
    type: 'suggestion'
  },
  /** @param {RuleContext} context */
  create(context) {
    const opts = context.options[0] || {}
    const ignoreIncludesComment = opts.ignoreIncludesComment
    const ignoreStringEscape = opts.ignoreStringEscape
    const sourceCode = context.getSourceCode()

    /**
     * Report if the value expression is string literals
     * @param {VDirective} node the node to check
     */
    function verify(node) {
      if (!node.value || node.key.modifiers.length) {
        return
      }
      const { expression } = node.value
      if (!expression) {
        return
      }
      let strValue, rawValue
      if (expression.type === 'Literal') {
        if (typeof expression.value !== 'string') {
          return
        }
        strValue = expression.value
        rawValue = expression.raw.slice(1, -1)
      } else if (expression.type === 'TemplateLiteral') {
        if (expression.expressions.length > 0) {
          return
        }
        strValue = expression.quasis[0].value.cooked
        rawValue = expression.quasis[0].value.raw
      } else {
        return
      }

      const tokenStore = context.parserServices.getTemplateBodyTokenStore()
      const hasComment = tokenStore
        .getTokens(node.value, { includeComments: true })
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
        // @ts-ignore
        node,
        messageId: 'unexpected',
        fix(fixer) {
          if (hasComment || hasEscape) {
            // cannot fix
            return null
          }
          const text = sourceCode.getText(node.value)
          const quoteChar = text[0]

          const shorthand = node.key.name.rawName === ':'
          /** @type { [number, number] } */
          const keyDirectiveRange = [
            node.key.name.range[0],
            node.key.name.range[1] + (shorthand ? 0 : 1)
          ]

          let attrValue
          if (quoteChar === '"') {
            attrValue = strValue.replace(DOUBLE_QUOTES_RE, '&quot;')
          } else if (quoteChar === "'") {
            attrValue = strValue.replace(SINGLE_QUOTES_RE, '&apos;')
          } else {
            attrValue = strValue
              .replace(DOUBLE_QUOTES_RE, '&quot;')
              .replace(SINGLE_QUOTES_RE, '&apos;')
          }
          return [
            fixer.removeRange(keyDirectiveRange),
            fixer.replaceText(expression, attrValue)
          ]
        }
      })
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='bind'][key.argument!=null]": verify
    })
  }
}
