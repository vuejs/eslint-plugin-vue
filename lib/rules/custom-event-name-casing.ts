/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import type { VueObjectData } from '../utils/index.js'
import { findVariable } from '@eslint-community/eslint-utils'
import utils from '../utils/index.js'
import { getChecker } from '../utils/casing.ts'
import { toRegExpGroupMatcher } from '../utils/regexp.ts'

const ALLOWED_CASE_OPTIONS = ['kebab-case', 'camelCase']
const DEFAULT_CASE = 'camelCase'

interface NameWithLoc {
  name: string
  loc: SourceLocation
}

/**
 * Get the name param node from the given CallExpression
 */
function getNameParamNode(node: CallExpression): NameWithLoc | null {
  const nameLiteralNode = node.arguments[0]
  if (nameLiteralNode && utils.isStringLiteral(nameLiteralNode)) {
    const name = utils.getStringLiteralValue(nameLiteralNode)
    if (name != null) {
      return { name, loc: nameLiteralNode.loc }
    }
  }

  // cannot check
  return null
}
/**
 * Get the callee member node from the given CallExpression
 */
function getCalleeMemberNode(node: CallExpression) {
  const callee = utils.skipChainExpression(node.callee)

  if (callee.type === 'MemberExpression') {
    const name = utils.getStaticPropertyName(callee)
    if (name) {
      return { name, member: callee }
    }
  }
  return null
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce specific casing for custom event name',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/custom-event-name-casing.html'
    },
    fixable: null,
    schema: [
      {
        enum: ALLOWED_CASE_OPTIONS
      },
      {
        type: 'object',
        properties: {
          ignores: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpected: "Custom event name '{{name}}' must be {{caseType}}."
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
    let emitParamName = ''
    const caseType = context.options[0] || DEFAULT_CASE
    const objectOption = context.options[1] || {}
    const caseChecker = getChecker(caseType)
    const isIgnored = toRegExpGroupMatcher(objectOption.ignores)

    /**
     * Check whether the given event name is valid.
     */
    function isValidEventName(name: string): boolean {
      return caseChecker(name) || name.startsWith('update:')
    }

    function verify(nameWithLoc: NameWithLoc) {
      const name = nameWithLoc.name
      if (isValidEventName(name) || isIgnored(name)) {
        return
      }
      context.report({
        loc: nameWithLoc.loc,
        messageId: 'unexpected',
        data: {
          name,
          caseType
        }
      })
    }

    const programNode = context.sourceCode.ast

    const callVisitor = {
      CallExpression(node: CallExpression, info?: VueObjectData) {
        const nameWithLoc = getNameParamNode(node)
        if (!nameWithLoc) {
          // cannot check
          return
        }

        // verify setup context
        const setupContext = setupContexts.get(info ? info.node : programNode)
        if (setupContext) {
          const { contextReferenceIds, emitReferenceIds } = setupContext
          if (
            node.callee.type === 'Identifier' &&
            emitReferenceIds.has(node.callee)
          ) {
            // verify setup(props,{emit}) {emit()}
            verify(nameWithLoc)
          } else {
            const emit = getCalleeMemberNode(node)
            if (
              emit &&
              emit.name === 'emit' &&
              emit.member.object.type === 'Identifier' &&
              contextReferenceIds.has(emit.member.object)
            ) {
              // verify setup(props,context) {context.emit()}
              verify(nameWithLoc)
            }
          }
        }
      }
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {
        CallExpression(node) {
          const callee = node.callee
          const nameWithLoc = getNameParamNode(node)
          if (!nameWithLoc) {
            // cannot check
            return
          }

          if (
            callee.type === 'Identifier' &&
            (callee.name === '$emit' || callee.name === emitParamName)
          ) {
            verify(nameWithLoc)
          }
        }
      },
      utils.compositingVisitors(
        utils.defineScriptSetupVisitor(context, {
          onDefineEmitsEnter(node) {
            if (
              !node.parent ||
              node.parent.type !== 'VariableDeclarator' ||
              node.parent.init !== node
            ) {
              return
            }

            const emitParam = node.parent.id
            if (emitParam.type !== 'Identifier') {
              return
            }
            emitParamName = emitParam.name

            // const emit = defineEmits()
            const variable = findVariable(
              utils.getScope(context, emitParam),
              emitParam
            )
            if (!variable) {
              return
            }
            const emitReferenceIds = new Set<Identifier>()
            for (const reference of variable.references) {
              emitReferenceIds.add(reference.identifier)
            }
            setupContexts.set(programNode, {
              contextReferenceIds: new Set<Identifier>(),
              emitReferenceIds
            })
          },
          ...callVisitor
        }),
        utils.defineVueVisitor(context, {
          onSetupFunctionEnter(node, { node: vueNode }) {
            const contextParam = utils.skipDefaultParamValue(node.params[1])
            if (!contextParam) {
              // no arguments
              return
            }
            if (
              contextParam.type === 'RestElement' ||
              contextParam.type === 'ArrayPattern'
            ) {
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
              if (!emitProperty || emitProperty.value.type !== 'Identifier') {
                return
              }
              const emitParam = emitProperty.value
              // `setup(props, {emit})`
              const variable = findVariable(
                utils.getScope(context, emitParam),
                emitParam
              )
              if (!variable) {
                return
              }
              for (const reference of variable.references) {
                emitReferenceIds.add(reference.identifier)
              }
            } else {
              // `setup(props, context)`
              const variable = findVariable(
                utils.getScope(context, contextParam),
                contextParam
              )
              if (!variable) {
                return
              }
              for (const reference of variable.references) {
                contextReferenceIds.add(reference.identifier)
              }
            }
            setupContexts.set(vueNode, {
              contextReferenceIds,
              emitReferenceIds
            })
          },
          ...callVisitor,
          onVueObjectExit(node) {
            setupContexts.delete(node)
          }
        }),
        {
          CallExpression(node) {
            const nameLiteralNode = getNameParamNode(node)
            if (!nameLiteralNode) {
              // cannot check
              return
            }
            const emit = getCalleeMemberNode(node)
            // verify $emit
            if (emit && emit.name === '$emit') {
              // verify this.$emit()
              verify(nameLiteralNode)
            }
          }
        }
      )
    )
  }
}
