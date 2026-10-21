/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
export default {
  supported: '>=3.2.0 || >=2.6.0-beta.1 <=2.6.0-beta.3',
  createTemplateBodyVisitor(context: RuleContext): TemplateListener {
    /**
     * Reports `.prop` shorthand node
     */
    function reportPropModifierShorthand(
      bindPropKey: VDirectiveKey & { argument: VIdentifier }
    ): void {
      context.report({
        node: bindPropKey,
        messageId: 'forbiddenVBindPropModifierShorthand',
        // fix to use `:x.prop` (downgrade)
        fix: (fixer) =>
          fixer.replaceText(
            bindPropKey,
            `:${bindPropKey.argument.rawName}.prop`
          )
      })
    }

    return {
      "VAttribute[directive=true] > VDirectiveKey[name.name='bind'][name.rawName='.']":
        reportPropModifierShorthand
    }
  }
}
