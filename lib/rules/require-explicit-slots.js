/**
 * @author Mussin Benarbia
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef {import('@typescript-eslint/types').TSESTree.TypeNode} TypeNode
 * @typedef {import('@typescript-eslint/types').TSESTree.TypeElement} TypeElement
 */

/**
 * @param {TypeElement} node
 * @return {string | null}
 */
function getSlotsName(node) {
  if (
    node.type !== 'TSMethodSignature' &&
    node.type !== 'TSPropertySignature'
  ) {
    return null
  }

  const key = node.key
  if (key.type === 'Literal') {
    return typeof key.value === 'string' ? key.value : null
  }

  if (key.type === 'Identifier') {
    return key.name
  }

  return null
}

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
      /** @returns {element is VElement} */
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
              const slotName = getSlotsName(memberNode)
              if (!slotName) continue

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
          slotsProperty.value.type === 'TSAsExpression' &&
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
            const slotName = getSlotsName(memberNode)
            if (!slotName) continue

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
        /** @param {VElement} node */
        "VElement[name='slot']"(node) {
          const nameNode = node.startTag.attributes.find(
            (node) =>
              (!node.directive && node.key.name === 'name') ||
              (node.directive &&
                node.key.name.name === 'bind' &&
                node.key.argument?.type === 'VIdentifier' &&
                node.key.argument?.name === 'name')
          )

          /** @type {string | undefined} */
          let slotName
          if (!nameNode) {
            // If no slot name is declared, default to 'default'
            slotName = 'default'
          } else if (nameNode.directive) {
            // ignore attribute binding
            return
          } else {
            slotName = nameNode.value?.value
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
