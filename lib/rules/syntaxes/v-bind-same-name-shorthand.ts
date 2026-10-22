/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../../utils/index.ts'

export default {
  supported: '>=3.4.0',
  createTemplateBodyVisitor(context: RuleContext): TemplateListener {
    /**
     * Verify the directive node
     */
    function checkDirective(node: VDirective): void {
      if (utils.isVBindSameNameShorthand(node)) {
        context.report({
          node,
          messageId: 'forbiddenVBindSameNameShorthand',
          // fix to use `:x="x"` (downgrade)
          fix: (fixer) =>
            fixer.insertTextAfter(node, `="${node.value.expression.name}"`)
        })
      }
    }

    return {
      "VAttribute[directive=true][key.name.name='bind']": checkDirective
    }
  }
}
