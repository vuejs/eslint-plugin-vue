/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
module.exports = {
  deprecated: '2.6.0',
  supported: '2.5.0',
  createTemplateBodyVisitor (context, { fixToUpgrade } = {}) {
    const sourceCode = context.getSourceCode()
    /**
     * Convert to `v-slot`.
     * @param {object} fixer fixer
     * @param {VAttribute | null} slotAttr node of `slot`
     * @param {VAttribute | null} scopeAttr node of `slot-scope`
     * @returns {*} fix data
     */
    function fixSlotToVSlot (fixer, slotAttr, scopeAttr) {
      const nameArgument = slotAttr && slotAttr.value && slotAttr && slotAttr.value.value
        ? `:${slotAttr.value.value}`
        : ''
      const scopeValue = scopeAttr && scopeAttr.value
        ? `=${sourceCode.getText(scopeAttr.value)}`
        : ''

      const replaceText = `v-slot${nameArgument}${scopeValue}`
      const fixers = [
        fixer.replaceText(slotAttr || scopeAttr, replaceText)
      ]
      if (slotAttr && scopeAttr) {
        fixers.push(fixer.remove(scopeAttr))
      }
      return fixers
    }
    /**
     * Reports `slot-scope` node
     * @param {VAttribute} scopeAttr node of `slot-scope`
     * @returns {void}
     */
    function reportSlotScope (scopeAttr) {
      context.report({
        node: scopeAttr.key,
        messageId: 'forbiddenSlotScopeAttribute',
        fix: fixToUpgrade
          // fix to use `v-slot`
          ? (fixer) => {
            const element = scopeAttr.parent
            const slotAttr = element.attributes
              .find(attr => attr.directive === false && attr.key.name === 'slot')
            return fixSlotToVSlot(fixer, slotAttr, scopeAttr)
          }
          : null
      })
    }

    return {
      "VAttribute[directive=true][key.name.name='slot-scope']": reportSlotScope
    }
  }
}
