/**
 * @fileoverview Don't introduce side effects in computed properties
 * @author Michał Sajnóg
 */
import { ReferenceTracker, findVariable } from '@eslint-community/eslint-utils'
import utils from '../utils/index.ts'
import type {
  ComponentComputedProperty,
  VueObjectData
} from '../utils/index.ts'

const ITERATION_METHODS = new Set([
  'forEach',
  'each',
  'map',
  'flatMap',
  'filter',
  'find',
  'findIndex',
  'findLast',
  'findLastIndex',
  'some',
  'every',
  'reduce',
  'reduceRight'
])

/**
 * Checks whether the value of the given expression is discarded,
 * e.g. `foo()` as a statement, `void foo()` or `a && foo()` as a statement.
 */
function isResultUnused(node: Expression): boolean {
  const parent = node.parent
  switch (parent.type) {
    case 'ExpressionStatement': {
      return true
    }
    case 'ChainExpression': {
      return isResultUnused(parent)
    }
    case 'UnaryExpression': {
      return parent.operator === 'void'
    }
    case 'SequenceExpression': {
      return parent.expressions.at(-1) !== node || isResultUnused(parent)
    }
    case 'LogicalExpression': {
      return parent.right === node && isResultUnused(parent)
    }
    case 'ConditionalExpression': {
      return parent.test !== node && isResultUnused(parent)
    }
    default: {
      return false
    }
  }
}

/**
 * Iteration calls such as `forEach()` only run their callback,
 * and callbacks are not checked by this rule.
 */
function isIterationCall(node: CallExpression): boolean {
  const callee = utils.skipChainExpression(node.callee)
  if (callee.type === 'Identifier') {
    return ITERATION_METHODS.has(callee.name)
  }
  if (callee.type !== 'MemberExpression') {
    return false
  }
  const name = utils.getStaticPropertyName(callee)
  return Boolean(name && ITERATION_METHODS.has(name))
}

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
    const computedCallNodes: Array<
      FunctionExpression | ArrowFunctionExpression
    > = []
    const setupRanges: [number, number][] = []
    const reportedNodes = new Set<ASTNode>()

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
      scopeStack &&= scopeStack.upper
    }

    /**
     * Checks whether the given call only changes a variable declared inside
     * the computed getter, e.g. `list.push(x)` or `Object.assign(obj, x)`
     * with `const list = []` and `const obj = {}`.
     */
    function isCalledOnLocalVariable(
      node: CallExpression,
      getterBody: BlockStatement | Expression
    ): boolean {
      let target: ESNode = utils.isObjectAssignCall(node, node.arguments[0])
        ? node.arguments[0]
        : node.callee
      while (true) {
        target = utils.skipChainExpression(target)
        if (target.type === 'MemberExpression') {
          target = target.object
        } else if (target.type === 'CallExpression') {
          target = target.callee
        } else {
          break
        }
      }
      if (target.type !== 'Identifier') {
        return false
      }
      const variable = findVariable(utils.getScope(context, target), target)
      return Boolean(
        variable &&
        variable.defs.some((def) => utils.isInRange(getterBody, def.node))
      )
    }

    const nodeVisitor = {
      ':function': onFunctionEnter,
      ':function:exit': onFunctionExit,

      'CallExpression:exit'(
        node: CallExpression,
        info?: VueObjectData | undefined
      ) {
        const targetBody = scopeStack?.body
        if (
          !targetBody ||
          reportedNodes.has(node) ||
          !isResultUnused(node) ||
          isIterationCall(node)
        ) {
          return
        }

        const computedProperty = (
          info ? computedPropertiesMap.get(info.node) || [] : []
        ).find((cp) => targetBody === cp.value)
        const isComputedFunction = computedCallNodes.some(
          (c) => targetBody === c.body
        )
        if (
          (!computedProperty && !isComputedFunction) ||
          isCalledOnLocalVariable(node, targetBody)
        ) {
          return
        }

        context.report(
          computedProperty
            ? {
                node,
                messageId: 'unexpectedSideEffectInProperty',
                data: { key: computedProperty.key || 'Unknown' }
              }
            : { node, messageId: 'unexpectedSideEffectInFunction' }
        )
      },

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
            utils.isInRange(cp.value, node) &&
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
            reportedNodes.add(isVueSet ? mem.parent : invalid.node)
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
          (c) => utils.isInRange(c, node) && targetBody === c.body
        )
        if (!computedFunction) {
          return
        }

        const mem = node.parent
        if (mem.object !== node) {
          return
        }

        const variable = findVariable(utils.getScope(context, node), node)
        if (!variable || variable.defs.length !== 1) {
          return
        }

        const def = variable.defs[0]
        if (
          ['ImplicitGlobalVariable', 'TDZ', 'ImportBinding'].includes(def.type)
        ) {
          return
        }

        const isDeclaredInsideSetup = setupRanges.some(([start, end]) =>
          utils.isInRange([start, end], def.node)
        )
        if (
          !isDeclaredInsideSetup ||
          // mutating local variables are accepted
          utils.isInRange(computedFunction, def.node)
        ) {
          return
        }

        const invalid = utils.findMutating(node)
        if (!invalid) {
          return
        }
        reportedNodes.add(invalid.node)
        context.report({
          node: invalid.node,
          messageId: 'unexpectedSideEffectInFunction'
        })
      }
    }
    const scriptSetupNode = utils.getScriptSetupElement(context)
    if (scriptSetupNode) {
      setupRanges.push(scriptSetupNode.range)
    }
    return utils.compositingVisitors(
      {
        Program(program: Program) {
          const tracker = new ReferenceTracker(utils.getScope(context, program))

          const computedRefs = utils.iterateReferencesTraceMap(tracker, {
            computed: {
              [ReferenceTracker.CALL]: true
            }
          })
          for (const { node } of computedRefs) {
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
