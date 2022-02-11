/**
 * @author Pig Fang
 * See LICENSE file in root directory for full license.
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
    type: 'suggestion',
    docs: {
      description:
        'require shorthand form attribute when `v-bind` value is `true`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-true-attribute-shorthand.html'
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [{ enum: ['always', 'never'] }],
    messages: {
      expectShort:
        "Boolean prop with 'true' value should be written in shorthand form.",
      expectLong:
        "Boolean prop with 'true' value should be written in long form.",
      suggestion: 'Rewrite this prop into shorthand form.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {'always' | 'never'} */
    const option = context.options[0] || 'always'

    return utils.defineTemplateBodyVisitor(context, {
      VAttribute(node) {
        if (!utils.isCustomComponent(node.parent.parent)) {
          return
        }

        if (option === 'never' && !node.directive && !node.value) {
          context.report({
            node,
            messageId: 'expectLong',
            fix: (fixer) =>
              fixer.replaceText(node, `:${node.key.rawName}="true"`)
          })
          return
        }

        if (option !== 'always') {
          return
        }

        if (
          !node.directive ||
          !node.value ||
          !node.value.expression ||
          node.value.expression.type !== 'Literal' ||
          node.value.expression.value !== true
        ) {
          return
        }

        const { argument } = node.key
        if (!argument) {
          return
        }

        context.report({
          node,
          messageId: 'expectShort',
          suggest: [
            {
              messageId: 'suggestion',
              fix: (fixer) => {
                const sourceCode = context.getSourceCode()
                return fixer.replaceText(node, sourceCode.getText(argument))
              }
            }
          ]
        })
      }
    })
  }
}
