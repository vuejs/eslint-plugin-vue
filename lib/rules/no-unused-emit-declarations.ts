/**
 * @author ItMaga
 * See LICENSE file in root directory for full license.
 */
import type { ComponentEmit, VueObjectData } from '../utils/index.js'
import { findVariable } from '@eslint-community/eslint-utils'
import utils from '../utils/index.js'
import { getScope } from '../utils/scope.ts'

interface SetupContext {
  contextReferenceIds: Set<Identifier>
  emitReferenceIds: Set<Identifier>
}

interface NameWithLoc {
  name: string
  loc: SourceLocation
  range: Range
}

/**
 * Get the name param node from the given CallExpression
 */
function getNameParamNode(node: CallExpression): NameWithLoc | null {
  const nameLiteralNode = node.arguments[0]
  if (nameLiteralNode && utils.isStringLiteral(nameLiteralNode)) {
    const name = utils.getStringLiteralValue(nameLiteralNode)
    if (name != null) {
      return { name, loc: nameLiteralNode.loc, range: nameLiteralNode.range }
    }
  }

  return null
}

/**
 * Check if the given node is a reference of setup context
 */
function hasReferenceId(
  value: Expression | Super | SpreadElement,
  setupContext: SetupContext
): boolean {
  const { contextReferenceIds, emitReferenceIds } = setupContext
  return (
    value.type === 'Identifier' &&
    (emitReferenceIds.has(value) || contextReferenceIds.has(value))
  )
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow unused emit declarations',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-unused-emit-declarations.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unused: '`{{name}}` is defined as emit but never used.'
    }
  },
  create(context: RuleContext) {
    const emitDeclarations = new Map<string, ComponentEmit>()
    const emitCalls = new Map<string, Expression>()
    const setupContexts = new Map<ObjectExpression | Program, SetupContext>()
    const programNode = context.sourceCode.ast
    let emitParamName = ''

    function addEmitCall(node: CallExpression) {
      const nameParamNode = getNameParamNode(node)
      if (nameParamNode) {
        emitCalls.set(nameParamNode.name, node)
      }
    }
    function clearEmits() {
      emitCalls.clear()
      emitDeclarations.clear()
    }

    function checkExpressionReference(
      expression: Expression | SpreadElement,
      setupContext: SetupContext
    ): boolean {
      if (expression.type === 'MemberExpression') {
        const memObject = utils.skipChainExpression(expression.object)
        if (hasReferenceId(memObject, setupContext)) {
          clearEmits()
          return true
        }
      }
      if (hasReferenceId(expression, setupContext)) {
        clearEmits()
        return true
      }
      return false
    }

    function verifyArgumentsReferences(
      args: (Expression | SpreadElement)[],
      setupContext: SetupContext
    ): boolean {
      for (const argument of args) {
        if (argument.type === 'ObjectExpression') {
          for (const property of argument.properties) {
            if (
              property.type === 'Property' &&
              checkExpressionReference(property.value, setupContext)
            ) {
              return true
            }
          }
        }

        if (argument.type === 'ArrayExpression') {
          for (const element of argument.elements) {
            if (!element) {
              continue
            }
            if (checkExpressionReference(element, setupContext)) {
              return true
            }
          }
        }

        if (checkExpressionReference(argument, setupContext)) {
          return true
        }
      }
      return false
    }

    function addEmitCallByReference(
      callee: Expression | Super,
      referenceIds: Set<Identifier>,
      node: CallExpression
    ) {
      if (callee.type === 'Identifier' && referenceIds.has(callee)) {
        addEmitCall(node)
      }
    }

    const callVisitor = {
      CallExpression(node: CallExpression, info?: VueObjectData) {
        const callee = utils.skipChainExpression(node.callee)

        let emit = null
        if (callee.type === 'MemberExpression') {
          const name = utils.getStaticPropertyName(callee)
          if (name === 'emit' || name === '$emit') {
            emit = { name, member: callee }
          }
        }

        const vueDefineNode = info ? info.node : programNode
        const setupContext = setupContexts.get(vueDefineNode)
        if (setupContext) {
          if (
            callee.parent.type === 'CallExpression' &&
            callee.parent.arguments &&
            verifyArgumentsReferences(callee.parent.arguments, setupContext)
          ) {
            // skip if the emit passed as argument
            return
          }

          const { contextReferenceIds, emitReferenceIds } = setupContext

          // verify setup(props,{emit}) {emit()}
          addEmitCallByReference(callee, emitReferenceIds, node)
          if (emit && emit.name === 'emit') {
            const memObject = utils.skipChainExpression(emit.member.object)
            // verify setup(props,context) {context.emit()}
            addEmitCallByReference(memObject, contextReferenceIds, node)
          }
        }

        if (emit && emit.name === '$emit') {
          const memObject = utils.skipChainExpression(emit.member.object)
          // verify this.$emit()
          if (utils.isThis(memObject, context)) {
            addEmitCall(node)
          }
        }

        // verify $emit() and defineEmits variable in template
        if (
          callee.type === 'Identifier' &&
          (callee.name === '$emit' || callee.name === emitParamName)
        ) {
          addEmitCall(node)
        }
      }
    }

    return utils.compositingVisitors(
      utils.defineTemplateBodyVisitor(context, callVisitor),
      utils.defineVueVisitor(context, {
        ...callVisitor,
        onVueObjectEnter(node) {
          for (const emit of utils.getComponentEmitsFromOptions(node)) {
            if (emit.emitName) {
              emitDeclarations.set(emit.emitName, emit)
            }
          }
        },
        onSetupFunctionEnter(node, { node: vueNode }) {
          const contextParam = node.params[1]
          if (
            !contextParam ||
            contextParam.type === 'RestElement' ||
            contextParam.type === 'ArrayPattern'
          ) {
            // no arguments or cannot check
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
                ? findVariable(getScope(context, emitParam), emitParam)
                : null
            if (!variable) {
              return
            }
            for (const reference of variable.references) {
              emitReferenceIds.add(reference.identifier)
            }
          } else if (contextParam.type === 'Identifier') {
            // `setup(props, context)`
            const variable = findVariable(
              getScope(context, contextParam),
              contextParam
            )
            for (const reference of variable.references) {
              contextReferenceIds.add(reference.identifier)
            }
          }

          setupContexts.set(vueNode, {
            contextReferenceIds,
            emitReferenceIds
          })
        }
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefineEmitsEnter(node, emits) {
          for (const emit of emits) {
            if (emit.emitName) {
              emitDeclarations.set(emit.emitName, emit)
            }
          }

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
          const variable = findVariable(getScope(context, emitParam), emitParam)
          if (!variable) {
            return
          }
          const emitReferenceIds = new Set<Identifier>()
          for (const reference of variable.references) {
            emitReferenceIds.add(reference.identifier)
          }
          setupContexts.set(programNode, {
            contextReferenceIds: new Set(),
            emitReferenceIds
          })
        },
        onDefineModelEnter(node, model) {
          if (
            node.parent &&
            node.parent.type === 'VariableDeclarator' &&
            node.parent.init === node
          ) {
            // If the return value of defineModel() is stored in a variable, we can mark the 'update:modelName' event as used if that that variable is used.
            // If that variable is unused, it will already be reported by `no-unused-var` rule.
            emitCalls.set(`update:${model.name.modelName}`, node)
          }
        },
        ...callVisitor
      }),
      {
        'Program:exit'() {
          for (const [name, emit] of emitDeclarations) {
            if (!emitCalls.has(name) && emit.node) {
              context.report({
                node: emit.node,
                loc: emit.node.loc,
                messageId: 'unused',
                data: { name }
              })
            }
          }
        }
      }
    )
  }
}
