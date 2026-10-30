/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
export default {
  supported: '>=3.1.0',
  createTemplateBodyVisitor(context: RuleContext): TemplateListener {
    return {
      "VAttribute[directive=false][key.name='is']"(node: VAttribute) {
        if (!node.value) {
          return
        }
        if (node.value.value.startsWith('vue:')) {
          context.report({
            node: node.value,
            messageId: 'forbiddenIsAttributeWithVuePrefix'
          })
        }
      }
    }
  }
}
