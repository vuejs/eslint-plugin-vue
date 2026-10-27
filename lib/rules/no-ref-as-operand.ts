/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import type { VueObjectData } from '../utils/index.js'
import type {
  RefObjectReferences,
  RefObjectReferenceForIdentifier
} from '../utils/ref-object-references.ts'
import { findVariable } from '@eslint-community/eslint-utils'
import { extractRefObjectReferences } from '../utils/ref-object-references.ts'
import utils from '../utils/index.js'
import tsUtils from '../utils/ts-utils/index.js'

/**
 * Checks whether the given identifier reference has been initialized with a ref object.
 */
function isRefInit(
  data: RefObjectReferenceForIdentifier | null
): data is RefObjectReferenceForIdentifier {
  const init = data && data.variableDeclarator && data.variableDeclarator.init
  return init ? data.defineChain.includes(init as any) : false
}

/**
 * A nullish fallback can pass a ref through unchanged. Only unwrap it when
 * the surrounding expression actually consumes its value as an operand.
 */
function isLogicalExpressionUsedAsOperand(node: LogicalExpression): boolean {
  let target: Expression = node
  while (target.parent.type === 'LogicalExpression') {
    target = target.parent
  }
  const parent = target.parent
  switch (parent.type) {
    case 'IfStatement':
    case 'SwitchStatement':
    case 'BinaryExpression': {
      return true
    }
    case 'UnaryExpression': {
      return parent.operator !== 'delete'
    }
    case 'ConditionalExpression': {
      return parent.test === target
    }
    case 'TemplateLiteral': {
      return parent.parent.type !== 'TaggedTemplateExpression'
    }
    case 'VExpressionContainer': {
      const attribute = parent.parent
      return (
        attribute.type === 'VAttribute' &&
        attribute.directive &&
        ['if', 'else-if', 'show'].includes(attribute.key.name.name)
      )
    }
  }
  return false
}

/**
 * Get the callee member node from the given CallExpression
 */
function getNameParamNode(node: CallExpression) {
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
      description:
        'disallow use of value wrapped by `ref()` (Composition API) as an operand',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-ref-as-operand.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      requireDotValue:
        'Must use `.value` to read or write the value wrapped by `{{method}}()`.',
      requireDotValueOfRef:
        'Must use `.value` to read or write the value of a ref.'
    }
  },
  create(context: RuleContext) {
    let refReferences: RefObjectReferences
    const setupContexts = new Map()

    /**
     * Collect identifier id
     */
    function collectReferenceIds(
      node: Identifier,
      referenceIds: Set<Identifier>
    ) {
      const variable = findVariable(utils.getScope(context, node), node)
      if (!variable) {
        return
      }
      for (const reference of variable.references) {
        referenceIds.add(reference.identifier)
      }
    }

    function reportIfRefWrapped(
      node: Identifier | MemberExpression,
      shouldCheckType = true
    ) {
      const data = node.type === 'Identifier' ? refReferences.get(node) : null
      if (isRefInit(data)) {
        context.report({
          node,
          messageId: 'requireDotValue',
          data: {
            method: data.method
          },
          fix(fixer) {
            return fixer.insertTextAfter(node, '.value')
          }
        })
      } else if (shouldCheckType && tsUtils.isRefObjectType(context, node)) {
        context.report({
          node,
          messageId: 'requireDotValueOfRef',
          fix(fixer) {
            return fixer.insertTextAfter(node, '.value')
          }
        })
      }
    }

    function reportWrappedIdentifiers(node: CallExpression) {
      const nodes = node.arguments.filter((node) => node.type === 'Identifier')
      for (const node of nodes) {
        reportIfRefWrapped(node)
      }
    }

    function reportTemplateRef(node: MemberExpression) {
      if (!utils.isScriptSetup(context)) return
      const properties: string[] = []
      let root: Expression | Super = node
      while (root.type === 'MemberExpression') {
        if (root.optional) return
        const name = utils.getStaticPropertyName(root)
        if (name == null) return
        properties.unshift(name)
        root = root.object
      }
      if (root.type !== 'Identifier') return

      let container: ASTNode = node
      while (container.type !== 'VExpressionContainer') {
        if (!container.parent) return
        container = container.parent
      }
      // Template locals and function parameters do not refer to setup bindings.
      const reference = container.references.find((ref) => ref.id === root)
      if (!reference || reference.variable) return
      const globalScope = context.sourceCode.scopeManager.globalScope
      const moduleScope = globalScope?.childScopes.find(
        (scope) => scope.type === 'module'
      )
      const variable = moduleScope?.set.get(root.name)
      const id = variable?.identifiers[0]
      if (!id || !tsUtils.isRefObjectTypeInTemplate(context, id, properties))
        return
      context.report({
        node,
        messageId: 'requireDotValueOfRef',
        fix(fixer) {
          return fixer.insertTextAfter(node, '.value')
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
        if (!setupContext) {
          return
        }

        const { contextReferenceIds, emitReferenceIds } = setupContext
        if (
          node.callee.type === 'Identifier' &&
          emitReferenceIds.has(node.callee)
        ) {
          // verify setup(props,{emit}) {emit()}
          reportWrappedIdentifiers(node)
        } else {
          const emit = getCalleeMemberNode(node)
          if (
            emit &&
            emit.name === 'emit' &&
            emit.member.object.type === 'Identifier' &&
            contextReferenceIds.has(emit.member.object)
          ) {
            // verify setup(props,context) {context.emit()}
            reportWrappedIdentifiers(node)
          }
        }
      }
    }

    return utils.compositingVisitors(
      {
        Program() {
          refReferences = extractRefObjectReferences(context)
        },
        // if (refValue)
        'IfStatement>:matches(Identifier, MemberExpression)'(
          node: Identifier | MemberExpression
        ) {
          reportIfRefWrapped(node)
        },
        // switch (refValue)
        'SwitchStatement>:matches(Identifier, MemberExpression)'(
          node: Identifier | MemberExpression
        ) {
          reportIfRefWrapped(node)
        },
        // -refValue, +refValue, !refValue, ~refValue, typeof refValue
        'UnaryExpression[operator!="delete"]>:matches(Identifier, MemberExpression)'(
          node: Identifier | MemberExpression
        ) {
          reportIfRefWrapped(node)
        },
        // refValue++, refValue--
        'UpdateExpression>:matches(Identifier, MemberExpression)'(
          node: Identifier | MemberExpression
        ) {
          reportIfRefWrapped(node)
        },
        // refValue+1, refValue-1
        'BinaryExpression>:matches(Identifier, MemberExpression)'(
          node: Identifier | MemberExpression
        ) {
          reportIfRefWrapped(node)
        },
        // refValue+=1, refValue-=1, foo+=refValue, foo-=refValue
        'AssignmentExpression>:matches(Identifier, MemberExpression)'(
          node: (Identifier | MemberExpression) & {
            parent: AssignmentExpression
          }
        ) {
          if (node.parent.operator === '=') {
            if (node.parent.left !== node) {
              return
            }
            // Assigning another ref to a variable typed as a ref is valid
            reportIfRefWrapped(node, false)
            return
          }
          reportIfRefWrapped(node)
        },
        // refValue || other, refValue && other. ignore: other || refValue
        'LogicalExpression>:matches(Identifier, MemberExpression)'(
          node: (Identifier | MemberExpression) & { parent: LogicalExpression }
        ) {
          if (
            node.parent.left !== node ||
            (node.parent.operator === '??' &&
              !isLogicalExpressionUsedAsOperand(node.parent))
          ) {
            return
          }
          // Report only constant identifiers.
          const data =
            node.type === 'Identifier' ? refReferences.get(node) : null
          if (
            node.type === 'Identifier' &&
            (!data ||
              !data.variableDeclaration ||
              data.variableDeclaration.kind !== 'const')
          ) {
            return
          }
          reportIfRefWrapped(node)
        },
        // refValue ? x : y
        'ConditionalExpression>:matches(Identifier, MemberExpression)'(
          node: (Identifier | MemberExpression) & {
            parent: ConditionalExpression
          }
        ) {
          if (node.parent.test !== node) {
            return
          }
          reportIfRefWrapped(node)
        },
        // `${refValue}`
        ':not(TaggedTemplateExpression)>TemplateLiteral>:matches(Identifier, MemberExpression)'(
          node: Identifier | MemberExpression
        ) {
          reportIfRefWrapped(node)
        },
        // refValue.x
        'MemberExpression>:matches(Identifier, MemberExpression)'(
          node: (Identifier | MemberExpression) & { parent: MemberExpression }
        ) {
          if (node.parent.object !== node) {
            return
          }
          const name = utils.getStaticPropertyName(node.parent)
          if (
            name === 'value' ||
            name === 'effect' || // WritableComputedRef
            name == null
          ) {
            return
          }
          reportIfRefWrapped(node)
        }
      },
      utils.defineTemplateBodyVisitor(context, {
        'UnaryExpression[operator!="delete"] > MemberExpression':
          reportTemplateRef,
        'BinaryExpression > MemberExpression': reportTemplateRef,
        'ConditionalExpression > MemberExpression'(node: MemberExpression) {
          if (
            node.parent.type === 'ConditionalExpression' &&
            node.parent.test === node
          ) {
            reportTemplateRef(node)
          }
        },
        'LogicalExpression > MemberExpression'(node: MemberExpression) {
          if (
            node.parent.type === 'LogicalExpression' &&
            node.parent.left === node &&
            (node.parent.operator !== '??' ||
              isLogicalExpressionUsedAsOperand(node.parent))
          ) {
            reportTemplateRef(node)
          }
        },
        'MemberExpression > MemberExpression'(node: MemberExpression) {
          if (
            node.parent.type !== 'MemberExpression' ||
            node.parent.object !== node
          )
            return
          const name = utils.getStaticPropertyName(node.parent)
          if (name != null && name !== 'value' && name !== 'effect')
            reportTemplateRef(node)
        },
        'VAttribute[directive=true][key.name.name=/^(if|else-if|show)$/] > VExpressionContainer > MemberExpression':
          reportTemplateRef
      }),
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

          // const emit = defineEmits()
          const emitReferenceIds = new Set<Identifier>()
          collectReferenceIds(emitParam, emitReferenceIds)

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
          if (
            // no arguments
            !contextParam ||
            // cannot check
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

            // `setup(props, {emit})`
            collectReferenceIds(emitProperty.value, emitReferenceIds)
          } else {
            // `setup(props, context)`
            collectReferenceIds(contextParam, contextReferenceIds)
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
      })
    )
  }
}
