/**
 * @author Przemyslaw Falowski (@przemkow)
 * @fileoverview This rule checks whether v-model used on custom component do not have an argument
 */
import utils from '../utils/index.ts'

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow adding an argument to `v-model` used in custom component',
      categories: ['vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-v-model-argument.html'
    },
    fixable: null,
    deprecated: true,
    schema: [],
    messages: {
      vModelRequireNoArgument: "'v-model' directives require no argument."
    }
  },
  create(context: RuleContext) {
    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='model']"(node: VDirective) {
        const element = node.parent.parent

        if (node.key.argument && utils.isCustomComponent(element)) {
          context.report({
            node,
            loc: node.loc,
            messageId: 'vModelRequireNoArgument'
          })
        }
      }
    })
  }
}
