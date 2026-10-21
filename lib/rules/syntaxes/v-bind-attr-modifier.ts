/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
export default {
  supported: '>=3.2.0',
  createTemplateBodyVisitor(context: RuleContext): TemplateListener {
    /**
     * Reports `v-bind.attr` node
     */
    function report(mod: VIdentifier): void {
      context.report({
        node: mod,
        messageId: 'forbiddenVBindAttrModifier'
      })
    }

    return {
      "VAttribute[directive=true][key.name.name='bind']"(node) {
        const attrMod = node.key.modifiers.find((m) => m.name === 'attr')
        if (attrMod) {
          report(attrMod)
        }
      }
    }
  }
}
