/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */
'use strict'
const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/**
 *
 * @param {VElement} node
 * @returns {{node: VAttribute | VDirective, value: string}}
 */
const getVText = (node) => {
  const vText = node.startTag.attributes.find(
    (attribute) =>
      attribute.key.type === 'VDirectiveKey' &&
      attribute.key.name.name === 'text'
  )

  if (!vText) return
  if (!vText.value) return
  if (vText.value.type !== 'VExpressionContainer') return
  if (!vText.value.expression) return
  if (vText.value.expression.type !== 'Identifier') return

  const vTextValue = vText.value.expression.name

  return {
    node: vText,
    value: vTextValue
  }
}

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
        const vText = getVText(node)
        if (!vText) return

        context.report({
          node: vText.node,
          loc: vText.loc,
          message: "Don't use 'v-text'.",
          fix(fixable) {
            if (node.startTag.selfClosing) return

            return [
              fixable.remove(vText.node),
              fixable.insertTextAfterRange(
                node.startTag.range,
                `{{${vText.value}}}`
              )
            ]
          }
        })
      }
    })
  }
}
