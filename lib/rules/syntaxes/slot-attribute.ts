/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import canConvertToVSlot from './utils/can-convert-to-v-slot.js'
import { toRegExpGroupMatcher } from '../../utils/regexp.ts'
import casing from '../../utils/casing.js'
import utils from '../../utils/index.js'

export default {
  deprecated: '2.6.0',
  supported: '<3.0.0',
  createTemplateBodyVisitor(context: RuleContext): TemplateListener {
    const options: { ignore: string[]; ignoreParents: string[] } =
      context.options[0] || {}
    const { ignore = [], ignoreParents = [] } = options
    const isAnyIgnored = toRegExpGroupMatcher(ignore)
    const isParentIgnored = toRegExpGroupMatcher(ignoreParents)

    const sourceCode = context.sourceCode
    const tokenStore =
      sourceCode.parserServices.getTemplateBodyTokenStore &&
      sourceCode.parserServices.getTemplateBodyTokenStore()

    /**
     * Checks whether the given node can convert to the `v-slot`.
     */
    function canConvertFromSlotToVSlot(slotAttr: VAttribute): boolean {
      if (!canConvertToVSlot(slotAttr.parent.parent, sourceCode, tokenStore)) {
        return false
      }
      if (!slotAttr.value) {
        return true
      }
      const slotName = slotAttr.value.value
      // If other than alphanumeric, underscore and hyphen characters are included it can not be converted.
      return !/[^\w\-]/u.test(slotName)
    }

    /**
     * Checks whether the given node can convert to the `v-slot`.
     */
    function canConvertFromVBindSlotToVSlot(slotAttr: VDirective): boolean {
      if (!canConvertToVSlot(slotAttr.parent.parent, sourceCode, tokenStore)) {
        return false
      }

      if (!slotAttr.value) {
        return true
      }

      if (!slotAttr.value.expression) {
        // parse error or empty expression
        return false
      }

      return slotAttr.value.expression.type === 'Identifier'
    }

    /**
     * Convert to `v-slot`.
     */
    function* fixSlotToVSlot(
      fixer: RuleFixer,
      slotAttr: VAttribute | VDirective,
      slotName: string | null,
      isVBind: boolean
    ): IterableIterator<Fix> {
      const startTag = slotAttr.parent
      const scopeAttr = startTag.attributes.find(
        (attr) =>
          attr.directive === true &&
          attr.key.name &&
          (attr.key.name.name === 'slot-scope' ||
            attr.key.name.name === 'scope')
      )
      let nameArgument = ''
      if (slotName) {
        nameArgument = isVBind ? `:[${slotName}]` : `:${slotName}`
      }
      const scopeValue =
        scopeAttr && scopeAttr.value
          ? `=${sourceCode.getText(scopeAttr.value)}`
          : ''

      const replaceText = `v-slot${nameArgument}${scopeValue}`

      const element = startTag.parent
      if (element.name === 'template') {
        yield fixer.replaceText(slotAttr || scopeAttr, replaceText)
        if (slotAttr && scopeAttr) {
          yield fixer.remove(scopeAttr)
        }
      } else {
        yield fixer.remove(slotAttr || scopeAttr)
        if (slotAttr && scopeAttr) {
          yield fixer.remove(scopeAttr)
        }

        const vFor = startTag.attributes.find(
          (attr) => attr.directive && attr.key.name.name === 'for'
        )
        const vForText = vFor ? `${sourceCode.getText(vFor)} ` : ''
        if (vFor) {
          yield fixer.remove(vFor)
        }

        yield fixer.insertTextBefore(
          element,
          `<template ${vForText}${replaceText}>\n`
        )
        yield fixer.insertTextAfter(element, `\n</template>`)
      }
    }
    /**
     * Reports `slot` node
     */
    function reportSlot(slotAttr: VAttribute): void {
      const component = slotAttr.parent.parent
      const componentName = component.rawName

      if (
        isAnyIgnored(
          componentName,
          casing.pascalCase(componentName),
          casing.kebabCase(componentName)
        )
      ) {
        return
      }

      const parent = component.parent
      const parentName = utils.isVElement(parent) ? parent.rawName : null
      if (parentName && isParentIgnored(parentName)) {
        return
      }

      context.report({
        node: slotAttr.key,
        messageId: 'forbiddenSlotAttribute',
        // fix to use `v-slot`
        *fix(fixer) {
          if (!canConvertFromSlotToVSlot(slotAttr)) {
            return
          }
          const slotName = slotAttr.value && slotAttr.value.value
          yield* fixSlotToVSlot(fixer, slotAttr, slotName, false)
        }
      })
    }
    /**
     * Reports `v-bind:slot` node
     */
    function reportVBindSlot(slotAttr: VDirective): void {
      context.report({
        node: slotAttr.key,
        messageId: 'forbiddenSlotAttribute',
        // fix to use `v-slot`
        *fix(fixer) {
          if (!canConvertFromVBindSlotToVSlot(slotAttr)) {
            return
          }
          const slotName =
            slotAttr.value &&
            slotAttr.value.expression &&
            sourceCode.getText(slotAttr.value.expression).trim()
          yield* fixSlotToVSlot(fixer, slotAttr, slotName, true)
        }
      })
    }

    return {
      "VAttribute[directive=false][key.name='slot']": reportSlot,
      "VAttribute[directive=true][key.name.name='bind'][key.argument.name='slot']":
        reportVBindSlot
    }
  }
}
