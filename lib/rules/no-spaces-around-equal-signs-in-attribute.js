/**
 * @author Yosuke Ota
 * issue https://github.com/vuejs/eslint-plugin-vue/issues/460
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'disallow spaces around equal signs in attribute',
      category: undefined,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.2/docs/rules/no-spaces-around-equal-signs-in-attribute.md'
    },
    fixable: 'whitespace',
    schema: []
  },

  create (context) {
    const sourceCode = context.getSourceCode()
    return utils.defineTemplateBodyVisitor(context, {
      'VAttribute' (node) {
        if (!node.value) {
          return
        }
        const range = [node.key.range[1], node.value.range[0]]
        const eqText = sourceCode.text.slice(range[0], range[1])
        const expect = eqText.trim()

        if (eqText !== expect) {
          context.report({
            node: node.key,
            loc: {
              start: node.key.loc.end,
              end: node.value.loc.start
            },
            message: 'Unexpected spaces found around equal signs.',
            data: {},
            fix: fixer => fixer.replaceTextRange(range, expect)
          })
        }
      }
    })
  }
}
