/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../../utils/index.ts'

export default {
  supported: '>=3.3.0',
  createScriptVisitor(context: RuleContext): RuleListener {
    return utils.defineScriptSetupVisitor(context, {
      onDefineSlotsEnter(node) {
        context.report({
          node,
          messageId: 'forbiddenDefineSlots'
        })
      }
    })
  }
}
