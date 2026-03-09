/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { findVariable } from '@eslint-community/eslint-utils'
import utils from '../utils/index.js'
import { getScope } from '../utils/scope.ts'

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
    type: 'problem',
    docs: {
      description: 'disallow asynchronously registered `expose`',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-expose-after-await.html'
    },
    fixable: null,
    schema: [],
    messages: {
      forbidden: '`{{name}}` is forbidden after an `await` expression.'
    }
  },
  create(context: RuleContext) {
    interface SetupScopeData {
      afterAwait: boolean
      range: Range
      isExposeReferenceId: (
        node: Identifier,
        callNode: CallExpression
      ) => boolean
      isContextReferenceId: (node: Identifier) => boolean
    }
    interface ScopeStack {
      upper: ScopeStack | null
      scopeNode:
        | FunctionDeclaration
        | FunctionExpression
        | ArrowFunctionExpression
        | Program
    }

    const setupScopes = new Map<
      | FunctionDeclaration
      | FunctionExpression
      | ArrowFunctionExpression
      | Program,
      SetupScopeData
    >()

    let scopeStack: ScopeStack | null = null

    return utils.compositingVisitors(
      {
        Program(node: Program) {
          scopeStack = {
            upper: scopeStack,
            scopeNode: node
          }
        }
      },
      {
        ':function'(node) {
          scopeStack = {
            upper: scopeStack,
            scopeNode: node
          }
        },
        ':function:exit'() {
          scopeStack = scopeStack && scopeStack.upper
        },
        AwaitExpression(node) {
          if (!scopeStack) {
            return
          }
          const setupScope = setupScopes.get(scopeStack.scopeNode)
          if (!setupScope || !utils.inRange(setupScope.range, node)) {
            return
          }
          setupScope.afterAwait = true
        },
        CallExpression(node) {
          if (!scopeStack) {
            return
          }
          const setupScope = setupScopes.get(scopeStack.scopeNode)
          if (
            !setupScope ||
            !setupScope.afterAwait ||
            !utils.inRange(setupScope.range, node)
          ) {
            return
          }
          const { isContextReferenceId, isExposeReferenceId } = setupScope
          if (
            node.callee.type === 'Identifier' &&
            isExposeReferenceId(node.callee, node)
          ) {
            // setup(props,{expose}) {expose()}
            context.report({
              node,
              messageId: 'forbidden',
              data: {
                name: node.callee.name
              }
            })
          } else {
            const expose = getCalleeMemberNode(node)
            if (
              expose &&
              expose.name === 'expose' &&
              expose.member.object.type === 'Identifier' &&
              isContextReferenceId(expose.member.object)
            ) {
              // setup(props,context) {context.emit()}
              context.report({
                node,
                messageId: 'forbidden',
                data: {
                  name: expose.name
                }
              })
            }
          }
        }
      },
      (() => {
        const scriptSetup = utils.getScriptSetupElement(context)
        if (!scriptSetup) {
          return {}
        }
        return {
          Program(node) {
            setupScopes.set(node, {
              afterAwait: false,
              range: scriptSetup.range,
              isExposeReferenceId: (id, callNode) =>
                callNode.parent.type === 'ExpressionStatement' &&
                callNode.parent.parent === node &&
                id.name === 'defineExpose',
              isContextReferenceId: () => false
            })
          }
        }
      })(),
      utils.defineVueVisitor(context, {
        onSetupFunctionEnter(node) {
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
          const exposeReferenceIds = new Set<Identifier>()
          if (contextParam.type === 'ObjectPattern') {
            const exposeProperty = utils.findAssignmentProperty(
              contextParam,
              'expose'
            )
            if (!exposeProperty) {
              return
            }
            const exposeParam = exposeProperty.value
            // `setup(props, {emit})`
            const variable =
              exposeParam.type === 'Identifier'
                ? findVariable(getScope(context, exposeParam), exposeParam)
                : null
            if (!variable) {
              return
            }
            for (const reference of variable.references) {
              if (!reference.isRead()) {
                continue
              }
              exposeReferenceIds.add(reference.identifier)
            }
          } else if (contextParam.type === 'Identifier') {
            // `setup(props, context)`
            const variable = findVariable(
              getScope(context, contextParam),
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
          setupScopes.set(node, {
            afterAwait: false,
            range: node.range,
            isExposeReferenceId: (id) => exposeReferenceIds.has(id),
            isContextReferenceId: (id) => contextReferenceIds.has(id)
          })
        },
        onSetupFunctionExit(node) {
          setupScopes.delete(node)
        }
      })
    )
  }
}
