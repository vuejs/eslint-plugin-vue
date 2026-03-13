/**
 * @author Flo Edelmann
 * See LICENSE file in root directory for full license.
 */
import { findVariable } from '@eslint-community/eslint-utils'
import utils from '../utils/index.js'

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
      description:
        'enforce passing a single argument to custom event emissions',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/prefer-single-event-payload.html'
    },
    fixable: null,
    hasSuggestions: false,
    schema: [],
    messages: {
      preferSinglePayload:
        'Pass a single payload object instead of multiple arguments when emitting the "{{name}}" event.'
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

    function verify(node: CallExpression) {
      // arguments[0] is the event name; if there are more than 2 arguments
      // total there are multiple payload values
      if (node.arguments.length <= 2) {
        return
      }

      const eventNameArg = node.arguments[0]
      const name = utils.isStringLiteral(eventNameArg)
        ? utils.getStringLiteralValue(eventNameArg)
        : null

      context.report({
        node,
        messageId: 'preferSinglePayload',
        data: { name: name ?? 'unknown' }
      })
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {
        CallExpression(node) {
          const callee = node.callee
          if (callee.type === 'Identifier' && callee.name === '$emit') {
            verify(node)
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
            const variable = findVariable(
              utils.getScope(context, emitParam),
              emitParam
            )
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
            const programNode = context.sourceCode.ast
            setupContexts.set(programNode, {
              contextReferenceIds: new Set<Identifier>(),
              emitReferenceIds
            })
          },
          CallExpression(node) {
            const callee = utils.skipChainExpression(node.callee)
            const programNode = context.sourceCode.ast
            const setupContext = setupContexts.get(programNode)
            if (
              setupContext &&
              callee.type === 'Identifier' &&
              setupContext.emitReferenceIds.has(callee)
            ) {
              verify(node)
            }
          }
        }),
        utils.defineVueVisitor(context, {
          onSetupFunctionEnter(node, { node: vueNode }) {
            const contextParam = utils.skipDefaultParamValue(node.params[1])
            if (!contextParam) {
              return
            }
            if (
              contextParam.type === 'RestElement' ||
              contextParam.type === 'ArrayPattern'
            ) {
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
          CallExpression(node, { node: vueNode }) {
            const callee = utils.skipChainExpression(node.callee)
            const setupContext = setupContexts.get(vueNode)
            if (setupContext) {
              const { contextReferenceIds, emitReferenceIds } = setupContext
              if (
                callee.type === 'Identifier' &&
                emitReferenceIds.has(callee)
              ) {
                // setup(props, {emit}) { emit() }
                verify(node)
              } else {
                const emit = getCalleeMemberNode(node)
                if (
                  emit &&
                  emit.name === 'emit' &&
                  emit.member.object.type === 'Identifier' &&
                  contextReferenceIds.has(emit.member.object)
                ) {
                  // setup(props, context) { context.emit() }
                  verify(node)
                }
              }
            }
          },
          onVueObjectExit(node) {
            setupContexts.delete(node)
          }
        }),
        {
          CallExpression(node) {
            const emit = getCalleeMemberNode(node)
            if (emit && emit.name === '$emit') {
              // this.$emit()
              verify(node)
            }
          }
        }
      )
    )
  }
}
