/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
module.exports = {
  supported: '2.6.0',
  createTemplateBodyVisitor (context) {
    const sourceCode = context.getSourceCode()
    /**
     * Convert to `slot` and `slot-scope`.
     * @param {object} fixer fixer
     * @param {VAttribute} vSlotAttr node of `v-slot`
     * @returns {*} fix data
     */
    function fixVSlotToSlot (fixer, vSlotAttr) {
      const key = vSlotAttr.key
      if (key.modifiers.length) {
        // unknown modifiers
        return null
      }
      const name = key.argument ? key.argument.rawName : null
      const scopedValueNode = vSlotAttr.value

      const attrs = []
      if (name) {
        attrs.push(`slot="${name}"`)
      }
      if (scopedValueNode) {
        attrs.push(
          `slot-scope=${sourceCode.getText(scopedValueNode)}`
        )
      }
      if (!attrs.length) {
        attrs.push('slot') // useless
      }
      return fixer.replaceText(vSlotAttr, attrs.join(' '))
    }
    /**
     * Reports `v-slot` node
     * @param {VAttribute} vSlotAttr node of `v-slot`
     * @returns {void}
     */
    function reportVSlot (vSlotAttr) {
      context.report({
        node: vSlotAttr.key,
        messageId: 'forbiddenVSlot',
        // fix to use `slot` (downgrade)
        fix: fixer => fixVSlotToSlot(fixer, vSlotAttr)
      })
    }

    return {
      "VAttribute[directive=true][key.name.name='slot']": reportVSlot
    }
  }
}
