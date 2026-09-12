/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */

import { getScriptSetupElement, getAttribute } from '../../utils/index.js'

export default {
  supported: '>=2.7.0',
  /** @param {RuleContext} context @returns {TemplateListener} */
  createScriptVisitor(context) {
    const scriptSetup = getScriptSetupElement(context)
    if (!scriptSetup) {
      return {}
    }
    const reportNode =
      getAttribute(scriptSetup, 'setup') || scriptSetup.startTag
    return {
      Program() {
        context.report({
          node: reportNode,
          messageId: 'forbiddenScriptSetup'
        })
      }
    }
  }
}
