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

const { getTSParserServices } = require('../utils/ts-utils/ts-types')

/** Map of Vue ref type names to the method name used in the error message. */
const REF_TYPE_NAMES: Record<string, string> = {
  Ref: 'ref',
  ComputedRef: 'computed',
  WritableComputedRef: 'computed',
  BaseComputedRef: 'computed',
  ShallowRef: 'shallowRef',
  ModelRef: 'defineModel',
  ToRef: 'toRef'
}

/**
 * Checks whether a TypeScript type symbol is declared in a Vue-related package.
 */
function isFromVuePackage(symbol: import('typescript').Symbol): boolean {
  const declarations = symbol.getDeclarations?.()
  if (!declarations?.length) return false
  return declarations.some((d) => {
    const fileName = d.getSourceFile().fileName
    return (
      fileName.includes('@vue/reactivity') ||
      fileName.includes('@vue/runtime-core') ||
      fileName.includes('@vue/runtime-dom') ||
      fileName.includes('/vue/')
    )
  })
}

/**
 * Checks the aliasSymbol of a type for Vue ref type names.
 */
function checkAliasSymbol(type: import('typescript').Type): string | null {
  const alias = type.aliasSymbol
  if (!alias) return null
  const name = alias.getName()
  if (name in REF_TYPE_NAMES && isFromVuePackage(alias)) {
    return REF_TYPE_NAMES[name]
  }
  return null
}

/**
 * Checks whether the given TypeScript type is a Vue Ref type and returns the
 * corresponding method name (e.g. 'ref', 'computed') or null.
 */
function getRefMethodFromType(
  type: import('typescript').Type,
  checker: import('typescript').TypeChecker,
  ts: typeof import('typescript'),
  seen = new Set<import('typescript').Type>()
): string | null {
  if (seen.has(type)) return null
  seen.add(type)

  // Handle union types: report only if ALL non-null/undefined constituents are refs
  if (type.isUnion()) {
    let refMethod: string | null = null
    let hasNonRefType = false
    for (const member of type.types) {
      if (
        (member.flags &
          (ts.TypeFlags.Null | ts.TypeFlags.Undefined | ts.TypeFlags.Void)) !==
        0
      ) {
        continue
      }
      const method = getRefMethodFromType(member, checker, ts, seen)
      if (method) {
        refMethod = refMethod || method
      } else {
        hasNonRefType = true
      }
    }
    return hasNonRefType ? null : refMethod
  }

  // Handle intersection types
  if (type.isIntersection()) {
    // Check aliasSymbol first (e.g. ShallowRef = Ref & { marker })
    const aliasMethod = checkAliasSymbol(type)
    if (aliasMethod) return aliasMethod

    for (const member of type.types) {
      const method = getRefMethodFromType(member, checker, ts, seen)
      if (method) return method
    }
    return null
  }

  // Check aliasSymbol (for type aliases like ShallowRef, ToRef)
  const aliasMethod = checkAliasSymbol(type)
  if (aliasMethod) return aliasMethod

  // Check the type's own symbol
  const symbol = type.getSymbol()
  if (symbol) {
    const name = symbol.getName()
    if (name in REF_TYPE_NAMES && isFromVuePackage(symbol)) {
      return REF_TYPE_NAMES[name]
    }
  }

  // Check base types recursively
  if ((type.flags & ts.TypeFlags.Object) !== 0) {
    const baseTypes = (
      type as import('typescript').InterfaceType
    ).getBaseTypes?.()
    if (baseTypes) {
      for (const base of baseTypes) {
        const method = getRefMethodFromType(base, checker, ts, seen)
        if (method) return method
      }
    }
  }

  return null
}

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

    /** TypeScript services, or null if unavailable. */
    let tsServices: {
      ts: typeof import('typescript')
      tsNodeMap: Map<any, import('typescript').Node>
      checker: import('typescript').TypeChecker
    } | null = null

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

    /**
     * Attempts to determine the Vue ref method from TypeScript type information.
     */
    function getVueRefMethodFromType(node: Identifier): string | null {
      if (!tsServices) return null
      const { ts, tsNodeMap, checker } = tsServices
      const tsNode = tsNodeMap.get(node)
      if (!tsNode) return null
      const type = checker.getTypeAtLocation(tsNode)
      if (!type) return null
      return getRefMethodFromType(type, checker, ts)
    }

    function reportIfRefWrapped(node: Identifier) {
      const data = refReferences.get(node)
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
        return
      }

      const tsMethod = getVueRefMethodFromType(node)
      if (tsMethod) {
        context.report({
          node,
          messageId: 'requireDotValue',
          data: {
            method: tsMethod
          },
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
          tsServices = getTSParserServices(context)
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
          // For AST-based detection, report only constants.
          const data = refReferences.get(node)
          if (
            data &&
            data.variableDeclaration &&
            data.variableDeclaration.kind === 'const'
          ) {
            reportIfRefWrapped(node)
            return
          }
          // For TS-based detection, we skip the const check since we
          // cannot easily determine declaration kind from the type system.
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
