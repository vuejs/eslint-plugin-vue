/**
 * @author Mussin Benarbia
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef {import('@typescript-eslint/types').TSESTree.TypeNode} TypeNode
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require slots to be explicitly defined',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-explicit-slots.html'
    },
    fixable: null,
    schema: [],
    messages: {
      requireExplicitSlots: 'Slots must be explicitly defined.',
      alreadyDefinedSlot: 'Slot {{slotName}} is already defined.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const sourceCode = context.getSourceCode()
    const documentFragment =
      sourceCode.parserServices.getDocumentFragment &&
      sourceCode.parserServices.getDocumentFragment()
    if (!documentFragment) {
      return {}
    }
    const scripts = documentFragment.children.filter(
      (element) => utils.isVElement(element) && element.name === 'script'
    )
    if (scripts.every((script) => !utils.hasAttribute(script, 'lang', 'ts'))) {
      return {}
    }
    const slotsDefined = new Set()

    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefineSlotsEnter(node) {
          const typeArguments =
            'typeArguments' in node ? node.typeArguments : node.typeParameters
          const param = /** @type {TypeNode|undefined} */ (
            typeArguments?.params[0]
          )
          if (!param) return

          if (param.type === 'TSTypeLiteral') {
            for (const memberNode of param.members) {
              const slotName = memberNode.key.name
              if (slotsDefined.has(slotName)) {
                context.report({
                  node: memberNode,
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
        }
      }),
      utils.executeOnVue(context, (obj) => {
        const slotsProperty = utils.findProperty(obj, 'slots')
        if (!slotsProperty) return

        const slotsTypeHelper =
          slotsProperty.value.typeAnnotation?.typeName.name === 'SlotsType' &&
          slotsProperty.value.typeAnnotation
        if (!slotsTypeHelper) return

        const typeArguments =
          'typeArguments' in slotsTypeHelper
            ? slotsTypeHelper.typeArguments
            : slotsTypeHelper.typeParameters
        const param = /** @type {TypeNode|undefined} */ (
          typeArguments?.params[0]
        )
        if (!param) return

        if (param.type === 'TSTypeLiteral') {
          for (const memberNode of param.members) {
            const slotName = memberNode.key.name
            if (slotsDefined.has(slotName)) {
              context.report({
                node: memberNode,
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

          const slotNameAttr = utils.getAttribute(node, 'name')

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
