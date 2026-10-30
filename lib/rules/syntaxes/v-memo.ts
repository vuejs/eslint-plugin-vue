/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
export default {
  supported: '>=3.2.0',
  createTemplateBodyVisitor(context: RuleContext): TemplateListener {
    /**
     * Reports `v-is` node
     */
    function reportVMemo(vMemoAttr: VDirective): void {
      context.report({
        node: vMemoAttr.key,
        messageId: 'forbiddenVMemo'
      })
    }

    return {
      "VAttribute[directive=true][key.name.name='memo']": reportVMemo
    }
  }
}
