/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
export default {
  deprecated: '2.5.0',
  supported: '<3.0.0',
  createTemplateBodyVisitor(context: RuleContext): TemplateListener {
    /**
     * Reports `scope` node
     */
    function reportScope(scopeKey: VDirectiveKey): void {
      context.report({
        node: scopeKey,
        messageId: 'forbiddenScopeAttribute',
        // fix to use `slot-scope`
        fix: (fixer) => fixer.replaceText(scopeKey, 'slot-scope')
      })
    }

    return {
      "VAttribute[directive=true] > VDirectiveKey[name.name='scope']":
        reportScope
    }
  }
}
