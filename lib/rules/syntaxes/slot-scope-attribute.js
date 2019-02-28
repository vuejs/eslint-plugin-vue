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
     * Checks whether the given node can convert to the `v-slot`.
     * @param {VAttribute | null} slotAttr node of `slot`
     * @param {VElement} slotAttr node of `slot`
     * @returns {boolean} `true` if the given node can convert to the `v-slot`
     */
    function canConvertToVSlot (slotAttr, element) {
      if (slotAttr) {
        if (!slotAttr.value) {
          return true
        }
        const slotName = slotAttr.value.value
        // If non-Latin characters are included it can not be converted.
        return !/[^a-z]/i.test(slotName)
      }

      const vBindSlotAttr = element.attributes
        .find(attr =>
          attr.directive === true &&
          attr.key.name.name === 'bind' &&
          attr.key.argument &&
          attr.key.argument.name === 'slot')
      // if the element have `v-bind:slot` it can not be converted.
      // Conversion of `v-bind:slot` is done with `vue/no-deprecated-slot-attribute`.
      return !vBindSlotAttr
    }

    /**
     * Convert to `v-slot`.
     * @param {object} fixer fixer
     * @param {VAttribute | null} slotAttr node of `slot`
     * @param {VAttribute | null} scopeAttr node of `slot-scope`
     * @returns {*} fix data
     */
    function fixSlotToVSlot (fixer, slotAttr, scopeAttr) {
      const nameArgument = slotAttr && slotAttr.value && slotAttr.value.value
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
            if (!canConvertToVSlot(slotAttr, element)) {
              return null
            }
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
