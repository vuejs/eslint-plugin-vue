/**
 * @author Amorites
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'enforce declaration style of `defineProps` and `defineModel`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/define-props-declaration.html'
    },
    fixable: null,
    schema: [
      {
        enum: ['type-based', 'runtime']
      }
    ],
    messages: {
      hasArg: 'Use type-based declaration instead of runtime declaration.',
      hasTypeArg: 'Use runtime declaration instead of type-based declaration.'
    }
  },
  create(context: RuleContext) {
    const scriptSetup = utils.getScriptSetupElement(context)
    if (!scriptSetup || !utils.hasAttribute(scriptSetup, 'lang', 'ts')) {
      return {}
    }

    const defineType = context.options[0] || 'type-based'
    return utils.defineScriptSetupVisitor(context, {
      onDefinePropsEnter(node) {
        switch (defineType) {
          case 'type-based': {
            if (node.arguments.length > 0) {
              context.report({
                node,
                messageId: 'hasArg'
              })
            }
            break
          }

          case 'runtime': {
            const typeArguments =
              'typeArguments' in node ? node.typeArguments : node.typeParameters
            if (typeArguments && typeArguments.params.length > 0) {
              context.report({
                node,
                messageId: 'hasTypeArg'
              })
            }
            break
          }
        }
      },
      onDefineModelEnter(node, model) {
        if (defineType === 'type-based' ? !model.typeNode : model.typeNode) {
          context.report({
            node,
            messageId: defineType === 'type-based' ? 'hasArg' : 'hasTypeArg'
          })
        }
      }
    })
  }
}
