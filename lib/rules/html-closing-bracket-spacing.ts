/**
 * @author Toru Nagashima <https://github.com/mysticatea>
 */

import utils from '../utils/index.ts'

interface Options {
  startTag?: 'always' | 'never'
  endTag?: 'always' | 'never'
  selfClosingTag?: 'always' | 'never'
}

/**
 * Normalize options.
 */
function parseOptions(
  options: Options,
  tokens: ParserServices.TokenStore
): Options & {
  detectType: (node: VStartTag | VEndTag) => 'never' | 'always' | null
} {
  const opts = Object.assign(
    {
      startTag: 'never',
      endTag: 'never',
      selfClosingTag: 'always'
    },
    options
  )
  return Object.assign(opts, {
    detectType(node: VStartTag | VEndTag): 'never' | 'always' | null {
      const openType = tokens.getFirstToken(node).type
      const closeType = tokens.getLastToken(node).type

      if (openType === 'HTMLEndTagOpen' && closeType === 'HTMLTagClose') {
        return opts.endTag
      }
      if (openType === 'HTMLTagOpen' && closeType === 'HTMLTagClose') {
        return opts.startTag
      }
      return openType === 'HTMLTagOpen' &&
        closeType === 'HTMLSelfClosingTagClose'
        ? opts.selfClosingTag
        : null
    }
  })
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description: "require or disallow a space before tag's closing brackets",
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/html-closing-bracket-spacing.html'
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          startTag: { enum: ['always', 'never'] },
          endTag: { enum: ['always', 'never'] },
          selfClosingTag: { enum: ['always', 'never'] }
        },
        additionalProperties: false
      }
    ],
    messages: {
      missing: "Expected a space before '{{bracket}}', but not found.",
      unexpected: "Expected no space before '{{bracket}}', but found."
    }
  },
  create(context: RuleContext) {
    const sourceCode = context.sourceCode
    const tokens =
      sourceCode.parserServices.getTemplateBodyTokenStore &&
      sourceCode.parserServices.getTemplateBodyTokenStore()
    const options = parseOptions(context.options[0], tokens)

    return utils.defineDocumentVisitor(context, {
      'VStartTag, VEndTag'(node: VStartTag | VEndTag) {
        const type = options.detectType(node)
        const lastToken = tokens.getLastToken(node)
        const prevToken = tokens.getLastToken(node, 1)

        // Skip if EOF exists in the tag or linebreak exists before `>`.
        if (
          type == null ||
          prevToken == null ||
          prevToken.loc.end.line !== lastToken.loc.start.line
        ) {
          return
        }

        // Check and report.
        const hasSpace = prevToken.range[1] !== lastToken.range[0]
        if (type === 'always' && !hasSpace) {
          context.report({
            node,
            loc: lastToken.loc,
            messageId: 'missing',
            data: { bracket: sourceCode.getText(lastToken) },
            fix: (fixer) => fixer.insertTextBefore(lastToken, ' ')
          })
        } else if (type === 'never' && hasSpace) {
          context.report({
            node,
            loc: {
              start: prevToken.loc.end,
              end: lastToken.loc.end
            },
            messageId: 'unexpected',
            data: { bracket: sourceCode.getText(lastToken) },
            fix: (fixer) =>
              fixer.removeRange([prevToken.range[1], lastToken.range[0]])
          })
        }
      }
    })
  }
}
