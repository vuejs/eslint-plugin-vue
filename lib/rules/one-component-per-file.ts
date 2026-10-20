/**
 * @fileoverview enforce that each component should be in its own file
 * @author Armano
 */
import utils from '../utils/index.js'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce that each component should be in its own file',
      categories: ['vue3-strongly-recommended', 'vue2-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/one-component-per-file.html'
    },
    fixable: null,
    schema: [],
    messages: {
      tooManyComponents: 'There is more than one component in this file.'
    }
  },
  create(context: RuleContext) {
    const components: ObjectExpression[] = []

    return Object.assign(
      {},
      utils.executeOnVueComponent(context, (node, type) => {
        if (type === 'definition') {
          const defType = utils.getVueComponentDefinitionType(context, node)
          if (defType === 'mixin') {
            return
          }
        }
        components.push(node)
      }),
      {
        'Program:exit'() {
          if (components.length > 1) {
            for (const node of components) {
              context.report({
                node,
                messageId: 'tooManyComponents'
              })
            }
          }
        }
      }
    )
  }
}
