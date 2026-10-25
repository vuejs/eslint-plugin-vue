/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
export default {
  supported: '>=2.6.0',
  createTemplateBodyVisitor(context: RuleContext): TemplateListener {
    /**
     * Reports dynamic argument node
     */
    function reportDynamicArgument(
      dynamicArgument: VExpressionContainer
    ): void {
      context.report({
        node: dynamicArgument,
        messageId: 'forbiddenDynamicDirectiveArguments'
      })
    }

    return {
      'VAttribute[directive=true] > VDirectiveKey > VExpressionContainer':
        reportDynamicArgument
    }
  }
}
