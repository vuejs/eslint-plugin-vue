'use strict'

module.exports = {
  meta: {
    docs: {
      description: 'enforce use of the `@eslint-community/*` package',
      categories: ['Internal']
    },
    fixable: 'code',
    messages: {
      useCommunityPackageInstead:
        'Please use `@eslint-community/{{name}}` instead.'
    },
    schema: []
  },

  /** @param {import('eslint').Rule.RuleContext} context */
  create(context) {
    return {
      /**
       * @param {import("../typings/eslint-plugin-vue/util-types/ast").Literal} node
       */
      'CallExpression > Literal.arguments[value=/^(?:eslint-utils|regexpp)$/u]'(
        node
      ) {
        context.report({
          node,
          messageId: 'useCommunityPackageInstead',
          data: {
            name: node.value
          },
          fix(fixer) {
            return fixer.replaceText(node, `'@eslint-community/${node.value}'`)
          }
        })
      }
    }
  }
}
