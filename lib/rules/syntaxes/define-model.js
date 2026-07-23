/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */

import utils from '../../utils/index.js'

export default {
  supported: '>=3.4.0',
  /** @param {RuleContext} context @returns {RuleListener} */
  createScriptVisitor(context) {
    return utils.defineScriptSetupVisitor(context, {
      onDefineModelEnter(node) {
        context.report({
          node,
          messageId: 'forbiddenDefineModel'
        })
      }
    })
  }
}
