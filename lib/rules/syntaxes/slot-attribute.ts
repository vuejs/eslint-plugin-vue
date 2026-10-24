/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import canConvertToVSlot from './utils/can-convert-to-v-slot.ts'
import { toRegExpGroupMatcher } from '../../utils/regexp.ts'
import { pascalCase, kebabCase } from '../../utils/casing.ts'
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
      return (
        canConvertToVSlot(slotAttr.parent.parent, sourceCode, tokenStore) &&
        (!slotAttr.value || slotAttr.value.expression?.type === 'Identifier')
      )
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
     * Checks whether the element with the given slot attribute or its parent is ignored.
     */
    function isIgnored(slotAttr: VAttribute | VDirective): boolean {
      const component = slotAttr.parent.parent
      const componentName = component.rawName

      if (
        isAnyIgnored(
          componentName,
          pascalCase(componentName),
          kebabCase(componentName)
        )
      ) {
        return true
      }

      const parent = component.parent
      return utils.isVElement(parent) && isParentIgnored(parent.rawName)
    }
    /**
     * Reports `slot` node
     */
    function reportSlot(slotAttr: VAttribute): void {
      if (isIgnored(slotAttr)) {
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
      if (isIgnored(slotAttr)) {
        return
      }

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
