/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { defineScriptSetupVisitor } = require('../../utils/index.ts')

module.exports = {
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
