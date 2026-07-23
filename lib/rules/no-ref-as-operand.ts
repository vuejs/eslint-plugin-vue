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

/**
 * Checks whether the given identifier reference has been initialized with a ref object.
 */
function isRefInit(
  data: RefObjectReferenceForIdentifier | null
): data is RefObjectReferenceForIdentifier {
  const init = data && data.variableDeclarator && data.variableDeclarator.init
  if (!init) {
    return false
  }
  return data.defineChain.includes(init as any)
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
        'Must use `.value` to read or write the value wrapped by `{{method}}()`.'
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

    function reportIfRefWrapped(node: Identifier) {
      const data = refReferences.get(node)
      if (!isRefInit(data)) {
        return
      }
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
    }

    function reportWrappedIdentifiers(node: CallExpression) {
      const nodes = node.arguments.filter((node) => node.type === 'Identifier')
      for (const node of nodes) {
        reportIfRefWrapped(node)
      }
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
        'IfStatement>Identifier'(node: Identifier) {
          reportIfRefWrapped(node)
        },
        // switch (refValue)
        'SwitchStatement>Identifier'(node: Identifier) {
          reportIfRefWrapped(node)
        },
        // -refValue, +refValue, !refValue, ~refValue, typeof refValue
        'UnaryExpression>Identifier'(node: Identifier) {
          reportIfRefWrapped(node)
        },
        // refValue++, refValue--
        'UpdateExpression>Identifier'(node: Identifier) {
          reportIfRefWrapped(node)
        },
        // refValue+1, refValue-1
        'BinaryExpression>Identifier'(node: Identifier) {
          reportIfRefWrapped(node)
        },
        // refValue+=1, refValue-=1, foo+=refValue, foo-=refValue
        'AssignmentExpression>Identifier'(
          node: Identifier & { parent: AssignmentExpression }
        ) {
          if (node.parent.operator === '=' && node.parent.left !== node) {
            return
          }
          reportIfRefWrapped(node)
        },
        // refValue || other, refValue && other. ignore: other || refValue
        'LogicalExpression>Identifier'(
          node: Identifier & { parent: LogicalExpression }
        ) {
          if (node.parent.left !== node) {
            return
          }
          // Report only constants.
          const data = refReferences.get(node)
          if (
            !data ||
            !data.variableDeclaration ||
            data.variableDeclaration.kind !== 'const'
          ) {
            return
          }
          reportIfRefWrapped(node)
        },
        // refValue ? x : y
        'ConditionalExpression>Identifier'(
          node: Identifier & { parent: ConditionalExpression }
        ) {
          if (node.parent.test !== node) {
            return
          }
          reportIfRefWrapped(node)
        },
        // `${refValue}`
        ':not(TaggedTemplateExpression)>TemplateLiteral>Identifier'(
          node: Identifier
        ) {
          reportIfRefWrapped(node)
        },
        // refValue.x
        'MemberExpression>Identifier'(
          node: Identifier & { parent: MemberExpression }
        ) {
          if (node.parent.object !== node) {
            return
          }
          const name = utils.getStaticPropertyName(node.parent)
          if (
            name === 'value' ||
            name == null ||
            // WritableComputedRef
            name === 'effect'
          ) {
            return
          }
          reportIfRefWrapped(node)
        }
      },
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
