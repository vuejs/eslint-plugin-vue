/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../../utils')

module.exports = {
  supported: '>=3.3.0',
  /** @param {RuleContext} context @returns {TemplateListener} */
  createScriptVisitor(context) {
    const scriptSetup = utils.getScriptSetupElement(context)
    if (!scriptSetup) {
      return {}
    }
    return {
      Program() {
        for (const attr of scriptSetup.startTag.attributes) {
          if (
            attr.directive &&
            attr.value &&
            attr.value.expression &&
            attr.value.expression.type === 'VGenericExpression'
          )
            context.report({
              node: attr,
              messageId: 'forbiddenGenericAttribute'
            })
        }
      }
    }
  }
}
