/**
 * @author Niklas Higi
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
      description: 'enforce or forbid parentheses after method calls without arguments in `v-on` directives',
      category: 'recommended',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.5.0/docs/rules/v-on-parens.md'
    },
    fixable: 'code',
    schema: [
      { enum: ['always', 'never'] }
    ]
  },

  create (context) {
    const always = context.options[0] === 'always'

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name='on'][key.argument!=null] VOnExpression > ExpressionStatement > *" (node) {
        const hasParens = node.type === 'CallExpression'
        if (hasParens && node.arguments.length > 0) return

        if (always && !hasParens) {
          context.report({
            node,
            loc: node.loc,
            message: "Method calls inside of 'v-on' directives must have parentheses.",
            fix: fixer => fixer.insertTextAfter(node, '()')
          })
        } else if (!always && hasParens) {
          context.report({
            node,
            loc: node.loc,
            message: "Method calls without arguments inside of 'v-on' directives must not have parentheses.",
            fix: fixer => {
              const nodeString = context.getSourceCode().getText().substring(...node.range)
              // This ensures that parens are also removed if they contain whitespace
              const parensLength = nodeString.match(/\(\s*\)\s*$/)[0].length
              return fixer.removeRange([node.end - parensLength, node.end])
            }
          })
        }
      }
    })
  }
}
