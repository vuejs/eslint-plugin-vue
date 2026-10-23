/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
export default {
  supported: '>=3.0.0',
  createTemplateBodyVisitor(context: RuleContext): TemplateListener {
    return {
      "VAttribute[directive=true] > VDirectiveKey[name.name='model'][argument!=null]"(
        node: VDirectiveKey & { argument: VExpressionContainer | VIdentifier }
      ) {
        context.report({
          node: node.argument,
          messageId: 'forbiddenVModelArgument'
        })
      }
    }
  }
}
