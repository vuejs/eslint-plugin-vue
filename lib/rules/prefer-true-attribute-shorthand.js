/**
 * @author Pig Fang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
const { getRuleOptions } = require('../utils/rule-options')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'require shorthand form attribute when `v-bind` value is `true`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-true-attribute-shorthand.html'
    },
    fixable: null,
    hasSuggestions: true,
    schema: [{ enum: ['always', 'never'] }],
    defaultOptions: ['always'],
    messages: {
      expectShort:
        "Boolean prop with 'true' value should be written in shorthand form.",
      expectLong:
        "Boolean prop with 'true' value should be written in long form.",
      rewriteIntoShort: 'Rewrite this prop into shorthand form.',
      rewriteIntoLongVueProp:
        'Rewrite this prop into long-form Vue component prop.',
      rewriteIntoLongHtmlAttr:
        'Rewrite this prop into long-form HTML attribute.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {('always' | 'never')[]} */
    const [option] = getRuleOptions(context, __filename)

    return utils.defineTemplateBodyVisitor(context, {
      VAttribute(node) {
        if (!utils.isCustomComponent(node.parent.parent)) {
          return
        }

        if (option === 'never' && !node.directive && !node.value) {
          context.report({
            node,
            messageId: 'expectLong',
            suggest: [
              {
                messageId: 'rewriteIntoLongVueProp',
                fix: (fixer) =>
                  fixer.replaceText(node, `:${node.key.rawName}="true"`)
              },
              {
                messageId: 'rewriteIntoLongHtmlAttr',
                fix: (fixer) =>
                  fixer.replaceText(
                    node,
                    `${node.key.rawName}="${node.key.rawName}"`
                  )
              }
            ]
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
              messageId: 'rewriteIntoShort',
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
