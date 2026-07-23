/**
 * @author Jonathan Carle
 * See LICENSE file in root directory for full license.
 */
import domEvents from '../utils/dom-events.json' with { type: 'json' }
import { findVariable } from '@eslint-community/eslint-utils'
import utils, {
  type ComponentEmit,
  type VueObjectData
} from '../utils/index.js'
import { type NameWithLoc } from './require-explicit-emits.ts'
import { type Rule } from 'eslint'

interface VueTemplateDefineData {
  type: 'export' | 'mark' | 'definition' | 'setup'
  define: ObjectExpression | Program
  defineEmits?: CallExpression
}

/**
 * Get the name param node from the given CallExpression
 */
function getNameParamNode(node: CallExpression) {
  const nameLiteralNode = node.arguments[0]
  if (nameLiteralNode && utils.isStringLiteral(nameLiteralNode)) {
    const name = utils.getStringLiteralValue(nameLiteralNode)
    if (name != null) {
      return { name, loc: nameLiteralNode.loc, range: nameLiteralNode.range }
    }
  }

  // cannot check
  return null
}

/**
 * Check if the given name matches defineEmitsNode variable name
 */
function isEmitVariableName(
  name: string,
  defineEmitsNode: CallExpression | undefined
): boolean {
  const node = defineEmitsNode?.parent

  if (node?.type === 'VariableDeclarator' && node.id.type === 'Identifier') {
    return name === node.id.name
  }

  return false
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow the use of event names that collide with native web event names',
      url: 'https://eslint.vuejs.org/rules/no-shadow-native-events.html'
    },
    schema: [],
    messages: {
      violation:
        'Use a different emit name to avoid shadowing the native event with name "{{ name }}". Consider an emit name which communicates the users intent, if applicable.'
    }
  },
  create(context: RuleContext) {
    const setupContexts = new Map<
      ObjectExpression | Program,
      {
        contextReferenceIds: Set<Identifier>
        emitReferenceIds: Set<Identifier>
      }
    >()

    /**
     * Tracks violating emit definitions, so that calls of this emit are not reported additionally.
     *  */
    const definedAndReportedEmits = new Set<string>()

    let vueTemplateDefineData: VueTemplateDefineData | null = null

    const programNode = context.sourceCode.ast
    if (utils.isScriptSetup(context)) {
      // init
      vueTemplateDefineData = {
        type: 'setup',
        define: programNode
      }
    }

    /**
     * Verify if an emit call violates the rule of not using a native dom event name.
     */
    function verifyEmit(nameWithLoc: NameWithLoc) {
      const name = nameWithLoc.name.toLowerCase()
      if (!domEvents.includes(name) || definedAndReportedEmits.has(name)) {
        return
      }
      context.report({
        loc: nameWithLoc.loc,
        messageId: 'violation',
        data: {
          name
        }
      })
    }

    /**
     * Verify if an emit declaration violates the rule of not using a native dom event name.
     */
    const verifyEmitDeclaration = (emits: ComponentEmit[]) => {
      for (const { node, emitName } of emits) {
        if (!node || !emitName || !domEvents.includes(emitName.toLowerCase())) {
          continue
        }

        definedAndReportedEmits.add(emitName)
        context.report({
          messageId: 'violation',
          data: { name: emitName },
          loc: node.loc
        })
      }
    }

    const callVisitor = {
      CallExpression(node: CallExpression, info?: VueObjectData) {
        const callee = utils.skipChainExpression(node.callee)
        const nameWithLoc = getNameParamNode(node)
        if (!nameWithLoc) {
          // cannot check
          return
        }
        const vueDefineNode = info ? info.node : programNode

        let emit
        if (callee.type === 'MemberExpression') {
          const name = utils.getStaticPropertyName(callee)
          if (name === 'emit' || name === '$emit') {
            emit = { name, member: callee }
          }
        }

        // verify setup context
        const setupContext = setupContexts.get(vueDefineNode)
        if (setupContext) {
          const { contextReferenceIds, emitReferenceIds } = setupContext
          if (callee.type === 'Identifier' && emitReferenceIds.has(callee)) {
            // verify setup(props,{emit}) {emit()}
            verifyEmit(nameWithLoc)
          } else if (emit?.name === 'emit') {
            const memObject = utils.skipChainExpression(emit.member.object)
            if (
              memObject.type === 'Identifier' &&
              contextReferenceIds.has(memObject)
            ) {
              // verify setup(props,context) {context.emit()}
              verifyEmit(nameWithLoc)
            }
          }
        }

        // verify $emit
        if (emit?.name === '$emit') {
          const memObject = utils.skipChainExpression(emit.member.object)
          if (utils.isThis(memObject, context)) {
            // verify this.$emit()
            verifyEmit(nameWithLoc)
          }
        }
      }
    }

    return utils.compositingVisitors(
      utils.defineTemplateBodyVisitor(
        context,
        {
          CallExpression(node) {
            const callee = utils.skipChainExpression(node.callee)
            const nameWithLoc = getNameParamNode(node)
            if (!nameWithLoc) {
              // cannot check
              return
            }

            // e.g. $emit() / emit() in template
            if (
              callee.type === 'Identifier' &&
              (callee.name === '$emit' ||
                (vueTemplateDefineData?.defineEmits &&
                  isEmitVariableName(
                    callee.name,
                    vueTemplateDefineData.defineEmits
                  )))
            ) {
              verifyEmit(nameWithLoc)
            }
          }
        },
        utils.compositingVisitors(
          utils.defineScriptSetupVisitor(context, {
            onDefineEmitsEnter: (node, emits) => {
              verifyEmitDeclaration(emits)
              if (vueTemplateDefineData?.type === 'setup') {
                vueTemplateDefineData.defineEmits = node
              }

              if (
                node.parent?.type !== 'VariableDeclarator' ||
                node.parent.init !== node
              ) {
                return
              }

              const emitParam = node.parent.id
              const variable =
                emitParam.type === 'Identifier'
                  ? findVariable(utils.getScope(context, emitParam), emitParam)
                  : null
              if (!variable) {
                return
              }

              const emitReferenceIds = new Set<Identifier>()
              for (const reference of variable.references) {
                if (!reference.isRead()) {
                  continue
                }

                emitReferenceIds.add(reference.identifier)
              }
              setupContexts.set(programNode, {
                contextReferenceIds: new Set(),
                emitReferenceIds
              })
            },
            ...callVisitor
          }),
          utils.defineVueVisitor(context, {
            onSetupFunctionEnter(node, { node: vueNode }) {
              const contextParam = node.params[1]
              if (!contextParam) {
                // no arguments
                return
              }
              if (contextParam.type === 'RestElement') {
                // cannot check
                return
              }
              if (contextParam.type === 'ArrayPattern') {
                // cannot check
                return
              }
              const contextReferenceIds = new Set<Identifier>()
              const emitReferenceIds = new Set<Identifier>()
              if (contextParam.type === 'ObjectPattern') {
                const emitProperty = utils.findAssignmentProperty(
                  contextParam,
                  'emit'
                )
                if (!emitProperty) {
                  return
                }
                const emitParam = emitProperty.value
                // `setup(props, {emit})`
                const variable =
                  emitParam.type === 'Identifier'
                    ? findVariable(
                        utils.getScope(context, emitParam),
                        emitParam
                      )
                    : null
                if (!variable) {
                  return
                }
                for (const reference of variable.references) {
                  if (!reference.isRead()) {
                    continue
                  }

                  emitReferenceIds.add(reference.identifier)
                }
              } else if (contextParam.type === 'Identifier') {
                // `setup(props, context)`
                const variable = findVariable(
                  utils.getScope(context, contextParam),
                  contextParam
                )
                if (!variable) {
                  return
                }
                for (const reference of variable.references) {
                  if (!reference.isRead()) {
                    continue
                  }

                  contextReferenceIds.add(reference.identifier)
                }
              }
              setupContexts.set(vueNode, {
                contextReferenceIds,
                emitReferenceIds
              })
            },
            onVueObjectEnter(node) {
              const emits = utils.getComponentEmitsFromOptions(node)
              verifyEmitDeclaration(emits)
            },
            onVueObjectExit(node, { type }) {
              if (
                (!vueTemplateDefineData ||
                  (vueTemplateDefineData.type !== 'export' &&
                    vueTemplateDefineData.type !== 'setup')) &&
                (type === 'mark' || type === 'export' || type === 'definition')
              ) {
                vueTemplateDefineData = {
                  type,
                  define: node
                }
              }
              setupContexts.delete(node)
            },
            ...callVisitor
          })
        )
      )
    )
  }
} satisfies Rule.RuleModule
