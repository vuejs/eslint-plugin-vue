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
    type: 'problem',
    docs: {
      description:
        'require shorthand form attribute when `v-bind` value is `true`.',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-true-attribute-shorthand.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [],
    messages: {
      report:
        "Boolean prop with 'true' value can be written in shorthand form.",
      fix: 'Rewrite this prop into shorthand form.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    // ...

    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VDirective} node */
      "VAttribute[directive=true][key.name.name='bind']"(node) {
        const { argument } = node.key
        if (
          !argument ||
          !node.value ||
          !node.value.expression ||
          node.value.expression.type !== 'Literal' ||
          node.value.expression.value !== true
        ) {
          return
        }

        context.report({
          node,
          messageId: 'report',
          suggest: [
            {
              messageId: 'fix',
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
