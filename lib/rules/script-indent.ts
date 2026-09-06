/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
import { defineVisitor } from '../utils/indent-common.ts'

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce consistent indentation in `<script>`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/script-indent.html'
    },
    // eslint-disable-next-line eslint-plugin/require-meta-fixable -- fixer is not recognized
    fixable: 'whitespace',
    schema: [
      {
        oneOf: [{ type: 'integer', minimum: 1 }, { enum: ['tab'] }]
      },
      {
        type: 'object',
        properties: {
          baseIndent: { type: 'integer', minimum: 0 },
          switchCase: { type: 'integer', minimum: 0 },
          ignores: {
            type: 'array',
            items: {
              allOf: [
                { type: 'string' },
                { not: { type: 'string', pattern: ':exit$' } },
                { not: { type: 'string', pattern: String.raw`^\s*$` } }
              ]
            },
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ]
  },
  create(context: RuleContext) {
    return defineVisitor(context, context.sourceCode, {})
  }
}
