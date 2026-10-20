/**
 * @author Amorites
 * See LICENSE file in root directory for full license.
 */
import type { TSESTree } from '@typescript-eslint/types'
import utils from '../utils/index.js'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce declaration style of `defineEmits`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/define-emits-declaration.html'
    },
    fixable: null,
    schema: [
      {
        enum: ['type-based', 'type-literal', 'runtime']
      }
    ],
    messages: {
      hasArg: 'Use type based declaration instead of runtime declaration.',
      hasTypeArg: 'Use runtime declaration instead of type based declaration.',
      hasTypeCallArg:
        'Use new type literal declaration instead of the old call signature declaration.'
    }
  },
  create(context: RuleContext) {
    const scriptSetup = utils.getScriptSetupElement(context)
    if (!scriptSetup || !utils.hasAttribute(scriptSetup, 'lang', 'ts')) {
      return {}
    }

    const defineType = context.options[0] || 'type-based'
    return utils.defineScriptSetupVisitor(context, {
      onDefineEmitsEnter(node) {
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

          case 'type-literal': {
            verifyTypeLiteral(node)
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
      }
    })

    function verifyTypeLiteral(node: CallExpression) {
      if (node.arguments.length > 0) {
        context.report({
          node,
          messageId: 'hasArg'
        })
        return
      }

      const typeArguments = node.typeArguments || node.typeParameters
      const param = typeArguments?.params[0] as TSESTree.TypeNode | undefined
      if (!param) return
      if (param.type === 'TSTypeLiteral') {
        for (const memberNode of param.members) {
          if (memberNode.type !== 'TSPropertySignature') {
            context.report({
              node: memberNode,
              messageId: 'hasTypeCallArg'
            })
          }
        }
      } else if (param.type === 'TSFunctionType') {
        context.report({
          node: param,
          messageId: 'hasTypeCallArg'
        })
      }
    }
  }
}
