/**
 * @author Mussin Benarbia
 * See LICENSE file in root directory for full license.
 */
import type { TSESTree } from '@typescript-eslint/types'
import utils from '../utils/index.ts'

function getSlotsName(node: TSESTree.TypeElement): string | null {
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

  return key.type === 'Identifier' ? key.name : null
}

function getSlotNameNode(node: VElement): VAttribute | VDirective | undefined {
  return node.startTag.attributes.find(
    (node) =>
      (!node.directive && node.key.name === 'name') ||
      (node.directive &&
        node.key.name.name === 'bind' &&
        node.key.argument?.type === 'VIdentifier' &&
        node.key.argument?.name === 'name')
  )
}

export default {
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
  create(context: RuleContext) {
    const sourceCode = context.sourceCode
    const documentFragment =
      sourceCode.parserServices.getDocumentFragment &&
      sourceCode.parserServices.getDocumentFragment()
    if (!documentFragment) {
      return {}
    }
    const scripts = documentFragment.children.filter(
      (element): element is VElement =>
        utils.isVElement(element) && element.name === 'script'
    )
    if (scripts.every((script) => !utils.hasAttribute(script, 'lang', 'ts'))) {
      return {}
    }
    const slotsDefined = new Set()

    function reportMissingSlot(node: VElement, slotName: string | undefined) {
      if (!slotsDefined.has(slotName)) {
        context.report({
          node,
          messageId: 'requireExplicitSlots'
        })
      }
    }

    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefineSlotsEnter(_node, slots) {
          for (const slot of slots) {
            if (!slot.slotName) {
              continue
            }

            if (slotsDefined.has(slot.slotName)) {
              context.report({
                node: slot.node,
                messageId: 'alreadyDefinedSlot',
                data: {
                  slotName: slot.slotName
                }
              })
            } else {
              slotsDefined.add(slot.slotName)
            }
          }
        }
      }),
      utils.executeOnVue(context, (obj) => {
        const slotsProperty = utils.findProperty(obj, 'slots')
        if (!slotsProperty) return

        const slotsTypeHelper =
          slotsProperty.value.type === 'TSAsExpression' &&
          slotsProperty.value.typeAnnotation?.type === 'TSTypeReference' &&
          slotsProperty.value.typeAnnotation.typeName.type === 'Identifier' &&
          slotsProperty.value.typeAnnotation.typeName.name === 'SlotsType' &&
          slotsProperty.value.typeAnnotation
        if (!slotsTypeHelper) return

        const typeArguments =
          'typeArguments' in slotsTypeHelper
            ? slotsTypeHelper.typeArguments
            : slotsTypeHelper.typeParameters
        const param = typeArguments?.params[0] as TSESTree.TypeNode | undefined
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
        "VElement[name='slot']"(node: VElement) {
          const nameNode = getSlotNameNode(node)

          // if no slot name is declared, default to 'default'
          if (!nameNode) {
            reportMissingSlot(node, 'default')
            return
          }

          if (nameNode.directive) {
            const expression = nameNode.value?.expression
            // ignore attribute binding except string literal
            if (!expression || !utils.isStringLiteral(expression)) {
              return
            }

            const name = utils.getStringLiteralValue(expression) || undefined
            reportMissingSlot(node, name)
          } else {
            reportMissingSlot(node, nameNode.value?.value)
          }
        }
      })
    )
  }
}
