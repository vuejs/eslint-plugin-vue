/**
 * @author Amorites
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce declaration style of `defineEmits`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/define-emits-declaration.html'
    },
    fixable: null,
    messages: {
      hasArg: 'Use type-based declaration instead of runtime declaration.',
      hasTypeArg: 'Use runtime declaration instead of type-based declaration.'
    },
    schema: [
      {
        enum: ['type-based', 'runtime']
      }
    ]
  },
  /** @param {RuleContext} context */
  create(context) {
    const scriptSetup = utils.getScriptSetupElement(context)
    if (!scriptSetup || !utils.hasAttribute(scriptSetup, 'lang', 'ts')) {
      return {}
    }

    const defineType = context.options[0] || 'type-based'
    return utils.defineScriptSetupVisitor(context, {
      onDefineEmitsEnter(node) {
        switch (defineType) {
          case 'type-based':
            if (node.arguments.length > 0) {
              context.report({
                node,
                messageId: 'hasArg'
              })
            }
            break

          case 'runtime':
            if (node.typeParameters && node.typeParameters.params.length > 0) {
              context.report({
                node,
                messageId: 'hasTypeArg'
              })
            }
            break
        }
      }
    })
  }
}
