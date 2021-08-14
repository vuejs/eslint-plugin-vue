/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */
'use strict'
const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow use of v-text',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-v-text.html'
    },
    fixable: 'code',
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.defineTemplateBodyVisitor(context, {
      /** @param {VElement} node */
      "VElement:has(VAttribute[directive=true][key.name.name='text'])"(node) {
        const vText = utils.getDirective(node, 'text')

        if (!vText) return

        const vTextValue = vText.value.expression.name

        context.report({
          node: vText,
          loc: vText.loc,
          message: "Don't use 'v-text'.",
          fix(fixable) {
            if (node.startTag.selfClosing) return

            return [
              fixable.remove(vText),
              fixable.insertTextAfterRange(
                node.startTag.range,
                `{{${vTextValue}}}`
              )
            ]
          }
        })
      }
    })
  }
}
