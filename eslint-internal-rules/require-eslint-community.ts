export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce use of the `@eslint-community/*` package',
      categories: ['Internal']
    },
    fixable: 'code',
    schema: [],
    messages: {
      useCommunityPackageInstead:
        'Please use `@eslint-community/{{name}}` instead.'
    },
    languages: ['js/js']
  },

  create(context: RuleContext) {
    return {
      'CallExpression > Literal.arguments[value=/^(?:eslint-utils|regexpp)$/u]'(
        node: Literal & { value: string }
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
