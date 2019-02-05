/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
module.exports = {
  deprecated: '2.6.0',
  createTemplateBodyVisitor (context) {
    const sourceCode = context.getSourceCode()
    /**
     * Convert to `v-slot`.
     * @param {object} fixer fixer
     * @param {VAttribute | null} slotAttr node of `slot`
     * @param {VAttribute | null} scopeAttr node of `scope`
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
     * Reports `slot` node
     * @param {VAttribute} slotAttr node of `slot`
     * @returns {void}
     */
    function reportSlot (slotAttr) {
      context.report({
        node: slotAttr.key,
        messageId: 'forbiddenSlotAttribute',
        // fix to use `v-slot`
        fix (fixer) {
          const element = slotAttr.parent
          const scopeAttr = element.attributes
            .find(attr => attr.directive === true && attr.key.name && (
              attr.key.name.name === 'slot-scope' ||
              attr.key.name.name === 'scope'
            ))
          return fixSlotToVSlot(fixer, slotAttr, scopeAttr)
        }
      })
    }

    return {
      "VAttribute[directive=false][key.name='slot']": reportSlot
    }
  }
}
