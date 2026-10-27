/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
const BUILTIN_MODIFIERS = new Set(['lazy', 'number', 'trim'])

export default {
  supported: '>=3.0.0',
  createTemplateBodyVisitor(context: RuleContext): TemplateListener {
    return {
      "VAttribute[directive=true] > VDirectiveKey[name.name='model'][modifiers.length>0]"(
        node: VDirectiveKey
      ) {
        for (const modifier of node.modifiers) {
          if (!BUILTIN_MODIFIERS.has(modifier.name)) {
            context.report({
              node: modifier,
              messageId: 'forbiddenVModelCustomModifiers'
            })
          }
        }
      }
    }
  }
}
