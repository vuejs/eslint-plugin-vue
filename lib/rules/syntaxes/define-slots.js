/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */

import { defineScriptSetupVisitor } from '../../utils/index.js'

export default {
  supported: '>=3.3.0',
  /** @param {RuleContext} context @returns {RuleListener} */
  createScriptVisitor(context) {
    return defineScriptSetupVisitor(context, {
      onDefineSlotsEnter(node) {
        context.report({
          node,
          messageId: 'forbiddenDefineSlots'
        })
      }
    })
  }
}
