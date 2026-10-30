/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */
import eslintUtils from '@eslint-community/eslint-utils'
import utils from '../utils/index.ts'
import type { ComponentObjectPropertyData, GroupName } from '../utils/index.ts'

interface CallMember {
  name: string
  node: CallExpression
}

const GROUPS = new Set<GroupName>(['data', 'props', 'computed', 'methods'])

const NATIVE_NOT_FUNCTION_TYPES = new Set([
  'String',
  'Number',
  'BigInt',
  'Boolean',
  'Object',
  'Array',
  'Symbol'
])

function resolvedExpressions(
  context: RuleContext,
  node: Expression
): Set<Expression> {
  const resolvedMap = new Map<Expression, Set<Expression>>()

  return resolvedExpressionsInternal(node)

  function resolvedExpressionsInternal(node: Expression): Set<Expression> {
    let resolvedSet = resolvedMap.get(node)
    if (!resolvedSet) {
      resolvedSet = new Set()
      resolvedMap.set(node, resolvedSet)
      for (const e of extractResolvedExpressions(node)) {
        resolvedSet.add(e)
      }
    }

    if (resolvedSet.size === 0) {
      resolvedSet.add(node)
    }

    return resolvedSet
  }
  function* extractResolvedExpressions(node: Expression): Iterable<Expression> {
    switch (node.type) {
      case 'Identifier': {
        const variable = utils.findVariableByIdentifier(context, node)
        if (variable) {
          for (const ref of variable.references) {
            const id = ref.identifier
            if (id.parent.type === 'VariableDeclarator') {
              if (id.parent.id === id && id.parent.init) {
                yield* resolvedExpressionsInternal(id.parent.init)
              }
            } else if (
              id.parent.type === 'AssignmentExpression' &&
              id.parent.left === id
            ) {
              yield* resolvedExpressionsInternal(id.parent.right)
            }
          }
        }

        break
      }
      case 'ConditionalExpression': {
        yield* resolvedExpressionsInternal(node.consequent)
        yield* resolvedExpressionsInternal(node.alternate)

        break
      }
      case 'LogicalExpression': {
        yield* resolvedExpressionsInternal(node.left)
        yield* resolvedExpressionsInternal(node.right)

        break
      }
    }
  }
}

/**
 * Get type of props item.
 * Can't consider array props like: props: {propsA: [String, Number, Function]}
 *
 * @example
 * props: {
 *   propA: String, // => String
 *   propB: {
 *     type: Number // => Number
 *   },
 * }
 */
function getComponentPropsTypes(
  context: RuleContext,
  prop: ComponentObjectPropertyData
): string[] | null {
  const result: string[] = []
  for (const expr of resolvedExpressions(context, prop.property.value)) {
    const types = getComponentPropsTypesFromExpression(expr)
    if (types == null) {
      return null
    }
    result.push(...types)
  }
  return result

  function getComponentPropsTypesFromExpression(expr: Expression) {
    let typeExprs
    /**
     * Check object props `props: { objectProps: {...} }`
     */
    if (expr.type === 'ObjectExpression') {
      const type = utils.findProperty(expr, 'type')
      if (type == null) return null

      typeExprs = resolvedExpressions(context, type.value)
    } else {
      typeExprs = [expr]
    }

    const result: string[] = []
    for (const typeExpr of typeExprs) {
      const types = getComponentPropsTypesFromTypeExpression(typeExpr)
      if (types == null) {
        return null
      }
      result.push(...types)
    }
    return result
  }

  function getComponentPropsTypesFromTypeExpression(typeExpr: Expression) {
    if (typeExpr.type === 'Identifier') {
      return [typeExpr.name]
    }
    if (typeExpr.type === 'ArrayExpression') {
      const types: string[] = []
      for (const element of typeExpr.elements) {
        if (!element) {
          continue
        }
        if (element.type === 'SpreadElement') {
          return null
        }
        for (const elementExpr of resolvedExpressions(context, element)) {
          if (elementExpr.type !== 'Identifier') {
            return null
          }
          types.push(elementExpr.name)
        }
      }
      return types
    }
    return null
  }
}

/** Expression types that can never resolve to a function. */
const NON_FUNCTION_EXPRESSION_TYPES = new Set([
  'ObjectExpression',
  'ArrayExpression',
  'Literal',
  'TemplateLiteral',
  'BinaryExpression',
  'UnaryExpression',
  'UpdateExpression'
])

/**
 * Check whether given expression may be a function.
 */
function canBeFunction(context: RuleContext, node: Expression): boolean {
  for (const expr of resolvedExpressions(context, node)) {
    if (
      NON_FUNCTION_EXPRESSION_TYPES.has(expr.type) ||
      (expr.type === 'ConditionalExpression' &&
        !canBeFunction(context, expr.consequent) &&
        !canBeFunction(context, expr.alternate))
    ) {
      continue
    }
    const evaluated = eslintUtils.getStaticValue(
      expr,
      utils.getScope(context, expr)
    )
    // If we don't know what it is, it could be a function
    if (!evaluated || typeof evaluated.value === 'function') {
      return true
    }
  }
  return false
}

class FunctionData {
  context: RuleContext
  name: string
  kind: 'methods' | 'computed'
  node: FunctionExpression | ArrowFunctionExpression
  returnValues: (Expression | null)[]
  cacheMaybeReturnFunction: boolean | null

  constructor(
    name: string,
    kind: 'methods' | 'computed',
    node: FunctionExpression | ArrowFunctionExpression,
    context: RuleContext
  ) {
    this.context = context
    this.name = name
    this.kind = kind
    this.node = node
    this.returnValues = []
    this.cacheMaybeReturnFunction = null
  }

  addReturnValue(node: Expression | null) {
    this.returnValues.push(node)
  }

  maybeReturnFunction(component: ComponentStack) {
    if (this.cacheMaybeReturnFunction != null) {
      return this.cacheMaybeReturnFunction
    }
    // Avoid infinite recursion.
    this.cacheMaybeReturnFunction = true

    return (this.cacheMaybeReturnFunction = this.returnValues.some(
      (returnValue) =>
        returnValue && component.maybeFunctionExpression(returnValue)
    ))
  }
}

/** Component information class. */
class ComponentStack {
  node: ObjectExpression
  context: RuleContext
  /** Upper scope component */
  upper: ComponentStack | null
  maybeFunctions: Map<string, boolean>
  functions: FunctionData[]
  callMembers: CallMember[]
  cacheMaybeFunctionExpressions: Map<Expression, boolean>

  constructor(
    node: ObjectExpression,
    context: RuleContext,
    upper: ComponentStack | null
  ) {
    this.node = node
    this.context = context
    this.upper = upper

    const maybeFunctions = new Map<string, boolean>()
    const functions: FunctionData[] = []

    function collectProperty(property: ComponentObjectPropertyData) {
      switch (property.groupName) {
        case 'data': {
          maybeFunctions.set(
            property.name,
            canBeFunction(context, property.property.value)
          )
          break
        }
        case 'props': {
          const types = getComponentPropsTypes(context, property)
          maybeFunctions.set(
            property.name,
            !types || types.some((type) => !NATIVE_NOT_FUNCTION_TYPES.has(type))
          )
          break
        }
        case 'computed': {
          let value = property.property.value
          if (value.type === 'ObjectExpression') {
            const getProp = utils.findProperty(value, 'get')
            if (getProp) {
              value = getProp.value
            }
          }
          processFunction(property.name, value, 'computed')
          break
        }
        case 'methods': {
          const value = property.property.value
          processFunction(property.name, value, 'methods')
          maybeFunctions.set(property.name, true)
          break
        }
      }
    }

    // Extract properties
    for (const property of utils.iterateProperties(node, GROUPS)) {
      if (property.type !== 'array') {
        collectProperty(property)
      }
    }
    this.maybeFunctions = maybeFunctions
    this.functions = functions
    this.callMembers = []
    this.cacheMaybeFunctionExpressions = new Map()

    function processFunction(
      name: string,
      value: Expression,
      kind: 'methods' | 'computed'
    ) {
      if (value.type === 'FunctionExpression') {
        functions.push(new FunctionData(name, kind, value, context))
      } else if (value.type === 'ArrowFunctionExpression') {
        const data = new FunctionData(name, kind, value, context)
        if (value.expression) {
          data.addReturnValue(value.body)
        }
        functions.push(data)
      }
    }
  }

  /**
   * Adds the given return statement to the return value of the function.
   */
  addReturnStatement(
    scopeFunction:
      FunctionExpression | ArrowFunctionExpression | FunctionDeclaration,
    returnNode: ReturnStatement
  ) {
    for (const data of this.functions) {
      if (data.node === scopeFunction) {
        data.addReturnValue(returnNode.argument)
        break
      }
    }
  }

  verifyComponent() {
    for (const call of this.callMembers) {
      this.verifyCallMember(call)
    }
  }

  verifyCallMember(call: CallMember) {
    const fnData = this.functions.find(
      (data) => data.name === call.name && data.kind === 'computed'
    )
    if (!fnData || fnData.maybeReturnFunction(this)) {
      return
    }

    const prefix = call.node.callee.type === 'MemberExpression' ? 'this.' : ''
    this.context.report({
      node: call.node,
      messageId: 'unexpected',
      data: {
        likeProperty: `${prefix}${call.name}`,
        likeMethod: `${prefix}${call.name}()`
      }
    })
  }

  /**
   * Check whether given expression may be a function.
   */
  maybeFunctionExpression(node: Expression): boolean {
    const cache = this.cacheMaybeFunctionExpressions.get(node)
    if (cache != null) {
      return cache
    }
    // Avoid infinite recursion.
    this.cacheMaybeFunctionExpressions.set(node, true)

    const result = maybeFunctionExpressionWithoutCache.call(this)
    this.cacheMaybeFunctionExpressions.set(node, result)
    return result

    function maybeFunctionExpressionWithoutCache(this: ComponentStack) {
      for (const expr of resolvedExpressions(this.context, node)) {
        if (!canBeFunction(this.context, expr)) {
          continue
        }
        if (this.expressionCouldBeFunction(expr)) {
          // It could be a function because we don't know what it is.
          return true
        }
      }
      return false
    }
  }

  /**
   * Check whether the given expression could be a function.
   */
  expressionCouldBeFunction(expr: Expression): boolean {
    switch (expr.type) {
      case 'MemberExpression': {
        if (utils.isThis(expr.object, this.context)) {
          const name = utils.getStaticPropertyName(expr)
          if (name && !this.maybeFunctionProperty(name)) {
            return false
          }
        }
        return true
      }
      case 'CallExpression': {
        if (
          expr.callee.type === 'MemberExpression' &&
          utils.isThis(expr.callee.object, this.context)
        ) {
          const name = utils.getStaticPropertyName(expr.callee)
          const fnData = this.functions.find((data) => data.name === name)
          if (
            fnData &&
            fnData.kind === 'methods' &&
            !fnData.maybeReturnFunction(this)
          ) {
            return false
          }
        }
        return true
      }
      case 'ConditionalExpression': {
        return (
          this.maybeFunctionExpression(expr.consequent) ||
          this.maybeFunctionExpression(expr.alternate)
        )
      }
      default: {
        return true
      }
    }
  }

  /**
   * Check whether given property name may be a function.
   */
  maybeFunctionProperty(name: string): boolean {
    const cache = this.maybeFunctions.get(name)
    if (cache != null) {
      return cache
    }
    // Avoid infinite recursion.
    this.maybeFunctions.set(name, true)

    const result = maybeFunctionPropertyWithoutCache.call(this)
    this.maybeFunctions.set(name, result)
    return result

    function maybeFunctionPropertyWithoutCache(this: ComponentStack) {
      const fnData = this.functions.find((data) => data.name === name)
      return fnData && fnData.kind === 'computed'
        ? fnData.maybeReturnFunction(this)
        : true
    }
  }
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow use computed property like method',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-use-computed-property-like-method.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Use {{ likeProperty }} instead of {{ likeMethod }}.'
    }
  },
  create(context: RuleContext) {
    interface ScopeStack {
      upper: ScopeStack | null
      scopeNode:
        FunctionDeclaration | FunctionExpression | ArrowFunctionExpression
    }
    let scopeStack: ScopeStack | null = null

    let componentStack: ComponentStack | null = null
    let templateComponent: ComponentStack | null = null

    return utils.compositingVisitors(
      {},
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          componentStack = new ComponentStack(node, context, componentStack)
          if (!templateComponent && utils.isInExportDefault(node)) {
            templateComponent = componentStack
          }
        },
        onVueObjectExit() {
          if (!componentStack) {
            return
          }

          componentStack.verifyComponent()
          componentStack = componentStack.upper
        },
        ':function'(
          node:
            FunctionExpression | FunctionDeclaration | ArrowFunctionExpression
        ) {
          scopeStack = {
            upper: scopeStack,
            scopeNode: node
          }
        },
        ReturnStatement(node) {
          if (scopeStack && componentStack) {
            componentStack.addReturnStatement(scopeStack.scopeNode, node)
          }
        },
        ':function:exit'() {
          scopeStack &&= scopeStack.upper
        },

        'ThisExpression, Identifier'(node: ThisExpression | Identifier) {
          if (
            !componentStack ||
            node.parent.type !== 'MemberExpression' ||
            node.parent.object !== node ||
            node.parent.parent.type !== 'CallExpression' ||
            node.parent.parent.callee !== node.parent ||
            !utils.isThis(node, context)
          ) {
            return
          }
          const name = utils.getStaticPropertyName(node.parent)
          if (name) {
            componentStack.callMembers.push({
              name,
              node: node.parent.parent
            })
          }
        }
      }),
      utils.defineTemplateBodyVisitor(context, {
        VExpressionContainer(node: VExpressionContainer) {
          if (!templateComponent) {
            return
          }
          for (const ref of node.references) {
            if (ref.variable != null) {
              continue
            }
            const id = ref.id
            if (
              id.parent.type !== 'CallExpression' ||
              id.parent.callee !== id
            ) {
              continue
            }
            templateComponent.verifyCallMember({
              name: id.name,
              node: id.parent
            })
          }
        }
      })
    )
  }
}
