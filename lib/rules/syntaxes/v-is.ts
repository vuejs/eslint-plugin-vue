/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
export default {
  deprecated: '3.1.0',
  supported: '>=3.0.0',
  createTemplateBodyVisitor(context: RuleContext): TemplateListener {
    /**
     * Reports `v-is` node
     */
    function reportVIs(vIsAttr: VDirective): void {
      context.report({
        node: vIsAttr.key,
        messageId: 'forbiddenVIs'
      })
    }

    return {
      "VAttribute[directive=true][key.name.name='is']": reportVIs
    }
  }
}
