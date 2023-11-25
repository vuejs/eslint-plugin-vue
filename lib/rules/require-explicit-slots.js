/**
 * @author Mussin Benarbia
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require slots to be explicitly defined with defineSlots',
      categories: ['vue3-strongly-recommended'],
      url: 'https://eslint.vuejs.org/rules/require-explicit-slots.html'
    },
    fixable: null,
    schema: [],
    messages: {
      requireExplicitSlots:
        'Slots must be explicitly defined with the defineSlots macro.',
      alreadyDefinedSlot: 'Slot {{slotName}} is already defined.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const slotsDefined = new Set()

    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefineSlotsEnter(node) {
          const typeArgument = node.typeArguments.params[0]
          const slotsDefinitions = typeArgument.members

          for (const slotDefinition of slotsDefinitions) {
            const slotName = slotDefinition.key.name
            if (slotsDefined.has(slotName)) {
              context.report({
                node: slotDefinition,
                messageId: 'alreadyDefinedSlot',
                data: {
                  slotName
                }
              })
            } else {
              slotsDefined.add(slotName)
            }
          }
        }
      }),
      utils.defineTemplateBodyVisitor(context, {
        "VElement[name='slot']"(node) {
          let slotName = 'default'

          const slotNameAttr = node.startTag.attributes.find(
            (attribute) => attribute.key.name === 'name'
          )

          if (slotNameAttr) {
            slotName = slotNameAttr.value.value
          }

          if (!slotsDefined.has(slotName)) {
            context.report({
              node,
              messageId: 'requireExplicitSlots'
            })
          }
        }
      })
    )
  }
}
