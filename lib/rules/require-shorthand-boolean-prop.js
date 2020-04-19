/**
 * @fileoverview Enforce or forbid passing `true` value to a prop
 * @author Anton Veselev
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce or forbid passing `true` value to a prop',
      categories: ['vue3-uncategorized', 'uncategorized'],
      recommended: false,
      url: 'https://eslint.vuejs.org/rules/require-shorthand-boolean-prop.html'
    },
    fixable: 'code',
    schema: [
      {
        enum: ['always', 'never']
      }
    ]
  },

  create (context) {
    const isAlways = context.options[0] !== 'never'

    return utils.defineTemplateBodyVisitor(context, {
      VStartTag (node) {
        for (const attr of node.attributes) {
          if (attr.value === null) {
            if (!isAlways) {
              context.report({
                node,
                loc: attr.loc,
                message: 'Unexpected shorthand prop.',
                fix (fixer) {
                  const { rawName } = attr.key || {}
                  return rawName
                    ? fixer.replaceTextRange(attr.range, `:${rawName}="true"`)
                    : null
                }
              })
            }
            continue
          }
          const { expression } = attr.value
          if (expression && expression.value === true) {
            if (isAlways) {
              context.report({
                node,
                loc: attr.loc,
                message: "Unexpected 'true' value.",
                fix (fixer) {
                  const { rawName } = (attr.key || {}).argument || {}
                  return rawName
                    ? fixer.replaceTextRange(attr.range, rawName)
                    : null
                }
              })
            }
            continue
          }
        }
      }
    })
  }
}
