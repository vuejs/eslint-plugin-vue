/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow default values in `defineModel`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-define-model-default.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Unexpected default value for the "{{name}}" model.'
    }
  },
  create(context: RuleContext) {
    return utils.defineScriptSetupVisitor(context, {
      onDefineModelEnter(_node, model) {
        const options = model.options && utils.skipTSAsExpression(model.options)
        if (options?.type !== 'ObjectExpression') {
          return
        }
        const defaultProperty = utils.findProperty(options, 'default')
        if (defaultProperty) {
          context.report({
            node: defaultProperty,
            messageId: 'unexpected',
            data: { name: model.name.modelName }
          })
        }
      }
    })
  }
}
