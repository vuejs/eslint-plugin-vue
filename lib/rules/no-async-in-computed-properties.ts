/**
 * @fileoverview Check if there are no asynchronous actions inside computed properties.
 * @author Armano
 */
import { ReferenceTracker } from '@eslint-community/eslint-utils'
import utils from '../utils/index.js'
import type {
  ComponentComputedProperty,
  VueObjectData
} from '../utils/index.js'

const PROMISE_FUNCTIONS = new Set(['then', 'catch', 'finally'])

const PROMISE_METHODS = new Set([
  'all',
  'allSettled',
  'any',
  'race',
  'reject',
  'resolve',
  'try',
  'withResolvers'
])

const TIMED_FUNCTIONS = new Set([
  'setTimeout',
  'setInterval',
  'setImmediate',
  'requestAnimationFrame'
])

function isTimedFunction(node: CallExpression) {
  const callee = utils.skipChainExpression(node.callee)
  return (
    ((callee.type === 'Identifier' && TIMED_FUNCTIONS.has(callee.name)) ||
      (callee.type === 'MemberExpression' &&
        callee.object.type === 'Identifier' &&
        callee.object.name === 'window' &&
        TIMED_FUNCTIONS.has(utils.getStaticPropertyName(callee) || ''))) &&
    node.arguments.length > 0
  )
}

function skipWrapper(node: any): any {
  while (node && node.expression) {
    node = node.expression
  }
  return node
}

/**
 * Resolve a single step of the member expression chain walk.
 */
function resolveRootObjectStep(
  current: any
): { done: true; name: string | null } | { done: false; next: any } {
  switch (current.type) {
    case 'MemberExpression': {
      return { done: false, next: skipWrapper(current.object) }
    }
    case 'CallExpression': {
      const calleeExpr = skipWrapper(current.callee)
      if (calleeExpr.type === 'MemberExpression') {
        return { done: false, next: skipWrapper(calleeExpr.object) }
      }
      return {
        done: true,
        name: calleeExpr.type === 'Identifier' ? calleeExpr.name : null
      }
    }
    case 'Identifier': {
      return { done: true, name: current.name }
    }
    default: {
      return { done: true, name: null }
    }
  }
}

/**
 * Get the root object name from a member expression chain
 */
function getRootObjectName(memberExpr: MemberExpression): string | null {
  let current = skipWrapper(memberExpr.object)

  while (current) {
    const step = resolveRootObjectStep(current)
    if (step.done) {
      return step.name
    }
    current = step.next
  }

  return null
}

function isPromiseMethod(name: string, callee: MemberExpression): boolean {
  return (
    // hello.PROMISE_FUNCTION()
    PROMISE_FUNCTIONS.has(name) ||
    // Promise.PROMISE_METHOD()
    (callee.object.type === 'Identifier' &&
      callee.object.name === 'Promise' &&
      PROMISE_METHODS.has(name))
  )
}

function isPromise(node: CallExpression, ignoredObjectNames: Set<string>) {
  const callee = utils.skipChainExpression(node.callee)
  if (callee.type === 'MemberExpression') {
    const name = utils.getStaticPropertyName(callee)
    if (!name || !isPromiseMethod(name, callee)) {
      return false
    }

    const rootObjectName = getRootObjectName(callee)
    return !rootObjectName || !ignoredObjectNames.has(rootObjectName)
  }
  return false
}

function isNextTick(node: CallExpression, context: RuleContext) {
  const callee = utils.skipChainExpression(node.callee)
  if (callee.type === 'MemberExpression') {
    const name = utils.getStaticPropertyName(callee)
    return (
      (utils.isThis(callee.object, context) && name === '$nextTick') ||
      (callee.object.type === 'Identifier' &&
        callee.object.name === 'Vue' &&
        name === 'nextTick')
    )
  }
  return false
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow asynchronous actions in computed properties',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-async-in-computed-properties.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          ignoredObjectNames: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpectedInFunction:
        'Unexpected {{expressionName}} in computed function.',
      unexpectedInProperty:
        'Unexpected {{expressionName}} in "{{propertyName}}" computed property.'
    }
  },
  create(context: RuleContext) {
    const options = context.options[0] || {}
    const ignoredObjectNames = new Set<string>(options.ignoredObjectNames || [])

    const computedPropertiesMap = new Map<
      ObjectExpression,
      ComponentComputedProperty[]
    >()
    const computedFunctionNodes: (
      FunctionExpression | ArrowFunctionExpression
    )[] = []

    interface ScopeStack {
      upper: ScopeStack | null
      body: BlockStatement | Expression
    }
    let scopeStack: ScopeStack | null = null

    const expressionTypes = {
      promise: 'asynchronous action',
      nextTick: 'asynchronous action',
      await: 'await operator',
      async: 'async function declaration',
      new: 'Promise object',
      timed: 'timed function'
    }

    function onFunctionEnter(
      node: FunctionExpression | FunctionDeclaration | ArrowFunctionExpression,
      info?: VueObjectData | undefined
    ) {
      if (node.async) {
        verify(
          node,
          node.body,
          'async',
          info ? computedPropertiesMap.get(info.node) : null
        )
      }

      scopeStack = {
        upper: scopeStack,
        body: node.body
      }
    }

    function onFunctionExit() {
      scopeStack &&= scopeStack.upper
    }

    function verify(
      node: ESNode,
      targetBody: BlockStatement | Expression,
      type: keyof typeof expressionTypes,
      computedProperties: ComponentComputedProperty[] | undefined | null
    ) {
      const properties = computedProperties || []
      for (const cp of properties) {
        if (
          cp.value &&
          node.loc.start.line >= cp.value.loc.start.line &&
          node.loc.end.line <= cp.value.loc.end.line &&
          targetBody === cp.value
        ) {
          context.report({
            node,
            messageId: 'unexpectedInProperty',
            data: {
              expressionName: expressionTypes[type],
              propertyName: cp.key || 'unknown'
            }
          })
          return
        }
      }

      for (const cf of computedFunctionNodes) {
        if (
          node.loc.start.line >= cf.body.loc.start.line &&
          node.loc.end.line <= cf.body.loc.end.line &&
          targetBody === cf.body
        ) {
          context.report({
            node,
            messageId: 'unexpectedInFunction',
            data: {
              expressionName: expressionTypes[type]
            }
          })
          return
        }
      }
    }
    const nodeVisitor = {
      ':function': onFunctionEnter,
      ':function:exit': onFunctionExit,

      NewExpression(node: NewExpression, info?: VueObjectData | undefined) {
        if (!scopeStack) {
          return
        }
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'Promise'
        ) {
          verify(
            node,
            scopeStack.body,
            'new',
            info ? computedPropertiesMap.get(info.node) : null
          )
        }
      },

      CallExpression(node: CallExpression, info?: VueObjectData | undefined) {
        if (!scopeStack) {
          return
        }
        if (isPromise(node, ignoredObjectNames)) {
          verify(
            node,
            scopeStack.body,
            'promise',
            info ? computedPropertiesMap.get(info.node) : null
          )
        } else if (isTimedFunction(node)) {
          verify(
            node,
            scopeStack.body,
            'timed',
            info ? computedPropertiesMap.get(info.node) : null
          )
        } else if (isNextTick(node, context)) {
          verify(
            node,
            scopeStack.body,
            'nextTick',
            info ? computedPropertiesMap.get(info.node) : null
          )
        }
      },

      AwaitExpression(node: AwaitExpression, info?: VueObjectData | undefined) {
        if (!scopeStack) {
          return
        }
        verify(
          node,
          scopeStack.body,
          'await',
          info ? computedPropertiesMap.get(info.node) : null
        )
      }
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

            const getter = utils.getGetterBodyFromComputedFunction(node)
            if (getter) {
              computedFunctionNodes.push(getter)
            }
          }
        }
      },
      utils.isScriptSetup(context)
        ? utils.defineScriptSetupVisitor(context, nodeVisitor)
        : utils.defineVueVisitor(context, {
            onVueObjectEnter(node) {
              computedPropertiesMap.set(node, utils.getComputedProperties(node))
            },
            ...nodeVisitor
          })
    )
  }
}
