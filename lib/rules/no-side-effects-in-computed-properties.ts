/**
 * @fileoverview Don't introduce side effects in computed properties
 * @author Michał Sajnóg
 */
import type {
  ComponentComputedProperty,
  VueObjectData
} from '../utils/index.js'
import { ReferenceTracker, findVariable } from '@eslint-community/eslint-utils'
import utils from '../utils/index.js'
import { getScope } from '../utils/scope.ts'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow side effects in computed properties',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-side-effects-in-computed-properties.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpectedSideEffectInFunction:
        'Unexpected side effect in computed function.',
      unexpectedSideEffectInProperty:
        'Unexpected side effect in "{{key}}" computed property.'
    }
  },
  create(context: RuleContext) {
    const computedPropertiesMap = new Map<
      ObjectExpression,
      ComponentComputedProperty[]
    >()
    const computedCallNodes: (FunctionExpression | ArrowFunctionExpression)[] =
      []
    const setupRanges: Range[] = []

    interface ScopeStack {
      upper: ScopeStack | null
      body: BlockStatement | Expression | null
    }

    let scopeStack: ScopeStack | null = null

    function onFunctionEnter(
      node: FunctionExpression | ArrowFunctionExpression | FunctionDeclaration
    ) {
      scopeStack = {
        upper: scopeStack,
        body: node.body
      }
    }

    function onFunctionExit() {
      scopeStack = scopeStack && scopeStack.upper
    }

    const nodeVisitor = {
      ':function': onFunctionEnter,
      ':function:exit': onFunctionExit,

      'MemberExpression > :matches(Identifier, ThisExpression)'(
        node: (Identifier | ThisExpression) & { parent: MemberExpression },
        info?: VueObjectData | undefined
      ) {
        if (!scopeStack) {
          return
        }
        const targetBody = scopeStack.body

        const computedProperty = (
          info ? computedPropertiesMap.get(info.node) || [] : []
        ).find(
          (cp) =>
            cp.value &&
            cp.value.range[0] <= node.range[0] &&
            node.range[1] <= cp.value.range[1] &&
            targetBody === cp.value
        )
        if (computedProperty) {
          const mem = node.parent
          if (mem.object !== node) {
            return
          }

          const isThis = utils.isThis(node, context)
          const isVue = node.type === 'Identifier' && node.name === 'Vue'

          const isVueSet =
            mem.parent.type === 'CallExpression' &&
            mem.property.type === 'Identifier' &&
            ((isThis && mem.property.name === '$set') ||
              (isVue && mem.property.name === 'set'))

          const invalid = isVueSet
            ? { node: mem.property }
            : isThis && utils.findMutating(mem)

          if (invalid) {
            context.report({
              node: invalid.node,
              messageId: 'unexpectedSideEffectInProperty',
              data: { key: computedProperty.key || 'Unknown' }
            })
          }
          return
        }

        // ignore `this` for computed functions
        if (node.type === 'ThisExpression') {
          return
        }

        const computedFunction = computedCallNodes.find(
          (c) =>
            c.range[0] <= node.range[0] &&
            node.range[1] <= c.range[1] &&
            targetBody === c.body
        )
        if (!computedFunction) {
          return
        }

        const mem = node.parent
        if (mem.object !== node) {
          return
        }

        const variable = findVariable(getScope(context, node), node)
        if (!variable || variable.defs.length !== 1) {
          return
        }

        const def = variable.defs[0]
        if (
          def.type === 'ImplicitGlobalVariable' ||
          def.type === 'TDZ' ||
          def.type === 'ImportBinding'
        ) {
          return
        }

        const isDeclaredInsideSetup = setupRanges.some(
          ([start, end]) =>
            start <= def.node.range[0] && def.node.range[1] <= end
        )
        if (!isDeclaredInsideSetup) {
          return
        }

        if (
          computedFunction.range[0] <= def.node.range[0] &&
          def.node.range[1] <= computedFunction.range[1]
        ) {
          // mutating local variables are accepted
          return
        }

        const invalid = utils.findMutating(node)
        if (invalid) {
          context.report({
            node: invalid.node,
            messageId: 'unexpectedSideEffectInFunction'
          })
        }
      }
    }
    const scriptSetupNode = utils.getScriptSetupElement(context)
    if (scriptSetupNode) {
      setupRanges.push(scriptSetupNode.range)
    }
    return utils.compositingVisitors(
      {
        Program(program: Program) {
          const tracker = new ReferenceTracker(getScope(context, program))

          for (const { node } of utils.iterateReferencesTraceMap(tracker, {
            computed: {
              [ReferenceTracker.CALL]: true
            }
          })) {
            if (node.type !== 'CallExpression') {
              continue
            }

            const getterBody = utils.getGetterBodyFromComputedFunction(node)
            if (getterBody) {
              computedCallNodes.push(getterBody)
            }
          }
        }
      },
      scriptSetupNode
        ? utils.defineScriptSetupVisitor(context, nodeVisitor)
        : utils.defineVueVisitor(context, {
            onVueObjectEnter(node) {
              computedPropertiesMap.set(node, utils.getComputedProperties(node))
            },
            onSetupFunctionEnter(node) {
              setupRanges.push(node.body.range)
            },
            ...nodeVisitor
          })
    )
  }
}
