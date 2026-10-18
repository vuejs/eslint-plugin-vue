/**
 * @fileoverview enforce `v-for` directive's delimiter style
 * @author Flo Edelmann
 * @copyright 2020 Flo Edelmann. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

export default {
  meta: {
    type: 'layout',
    docs: {
      description: "enforce `v-for` directive's delimiter style",
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/v-for-delimiter-style.html'
    },
    fixable: 'code',
    schema: [{ enum: ['in', 'of'] }],
    messages: {
      expected:
        "Expected '{{preferredDelimiter}}' instead of '{{usedDelimiter}}' in 'v-for'."
    }
  },
  create(context: RuleContext) {
    const preferredDelimiter =
      (context.options[0] as string | undefined) || 'in'

    return utils.defineTemplateBodyVisitor(context, {
      VForExpression(node: VForExpression) {
        const sourceCode = context.sourceCode
        const tokenStore =
          sourceCode.parserServices.getTemplateBodyTokenStore &&
          sourceCode.parserServices.getTemplateBodyTokenStore()

        const lastLeftNode = node.left.at(-1)
        const delimiterToken = tokenStore.getTokenAfter(
          lastLeftNode ?? tokenStore.getFirstToken(node),
          (token) => token.type !== 'Punctuator'
        ) as Token

        if (delimiterToken.value === preferredDelimiter) {
          return
        }

        context.report({
          node,
          loc: node.loc,
          messageId: 'expected',
          data: {
            preferredDelimiter,
            usedDelimiter: delimiterToken.value
          },
          *fix(fixer) {
            yield fixer.replaceText(delimiterToken, preferredDelimiter)
          }
        })
      }
    })
  }
}
