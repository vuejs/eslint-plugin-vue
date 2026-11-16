/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import { findVariable } from '@eslint-community/eslint-utils'
import { iterateDefineRefs } from '../utils/ref-object-references.ts'
import utils from '../utils/index.ts'

type FunctionNode = FunctionExpression | ArrowFunctionExpression
type LiteralNode = ObjectExpression | ArrayExpression

/** `{} as T`, `{} satisfies T`, `<T>{}` and `{}!` */
const TYPE_WRAPPERS = new Set([
  'TSAsExpression',
  'TSSatisfiesExpression',
  'TSTypeAssertion',
  'TSNonNullExpression'
])

/** Nodes whose `return` statements do not belong to the getter. */
const NESTED_SCOPES = new Set([
  'FunctionDeclaration',
  'FunctionExpression',
  'ArrowFunctionExpression',
  'ClassDeclaration',
  'ClassExpression'
])

function skipTypeWrappers(node: ESNode): ESNode {
  let current = node
  while (TYPE_WRAPPERS.has(current.type)) {
    current = (current as unknown as { expression: ESNode }).expression
  }
  return current
}

function asLiteral(node: ESNode | null | undefined): LiteralNode | null {
  if (!node) {
    return null
  }
  const expr = skipTypeWrappers(node)
  return expr.type === 'ObjectExpression' || expr.type === 'ArrayExpression'
    ? expr
    : null
}

function isFunction(node: ESNode): node is FunctionNode {
  return (
    node.type === 'FunctionExpression' ||
    node.type === 'ArrowFunctionExpression'
  )
}

/**
 * Finds the getter of `computed(getter)` or `computed({ get, set })`.
 */
function getGetter(computedCall: CallExpression): FunctionNode | null {
  const arg = computedCall.arguments[0]
  if (!arg) {
    return null
  }
  const expr = skipTypeWrappers(arg)
  if (isFunction(expr)) {
    return expr
  }
  if (expr.type === 'ObjectExpression') {
    const get = utils.findProperty(expr, 'get')
    if (get && isFunction(get.value)) {
      return get.value
    }
  }
  return null
}

/**
 * Collects the object and array literals returned by the getter.
 * Returns `null` if any return value is not such a literal,
 * e.g. `return store.user` or `return reactive({})`.
 */
function getReturnedLiterals(
  getter: FunctionNode,
  visitorKeys: Record<string, readonly string[] | undefined>
): LiteralNode[] | null {
  if (getter.body.type !== 'BlockStatement') {
    const literal = asLiteral(getter.body)
    return literal ? [literal] : null
  }

  const literals: LiteralNode[] = []
  let isAllLiterals = true
  const walk = (node: ESNode): void => {
    if (!isAllLiterals) {
      return
    }
    if (node.type === 'ReturnStatement') {
      const literal = asLiteral(node.argument)
      if (literal) {
        literals.push(literal)
      } else {
        isAllLiterals = false
      }
      return
    }
    if (NESTED_SCOPES.has(node.type)) {
      return
    }
    const keys = visitorKeys[node.type] ?? []
    for (const key of keys) {
      const child = (node as unknown as Record<string, unknown>)[key]
      if (Array.isArray(child)) {
        for (const c of child) {
          if (c && typeof c === 'object' && 'type' in c) {
            walk(c as ESNode)
          }
        }
      } else if (child && typeof child === 'object' && 'type' in child) {
        walk(child as ESNode)
      }
    }
  }
  walk(getter.body)

  return isAllLiterals && literals.length > 0 ? literals : null
}

/**
 * Checks whether following `path` from `literal` ends at another literal,
 * i.e. whether the mutated object is created by the getter itself.
 * e.g. for `{ form: { name: '' } }` and the path `form`, the mutated object
 * is the inner literal, but for `{ form: store.form }` it is `store.form`,
 * which may be reactive.
 */
function isLiteralAtPath(
  literal: LiteralNode,
  path: MemberExpression[]
): boolean {
  let current: LiteralNode = literal
  for (const member of path) {
    if (current.type !== 'ObjectExpression' || hasAccessor(current)) {
      return false
    }
    const name = utils.getStaticPropertyName(member)
    if (name == null) {
      return false
    }
    // The last matching property wins, unless a later spread may override it.
    let property: Property | SpreadElement | null = null
    for (const p of current.properties) {
      if (
        p.type === 'SpreadElement' ||
        utils.getStaticPropertyName(p) === name
      ) {
        property = p
      }
    }
    if (!property || property.type !== 'Property') {
      return false
    }
    const next = asLiteral(property.value)
    if (!next) {
      return false
    }
    current = next
  }
  return !hasAccessor(current)
}

/**
 * Objects with getters or setters can forward writes to reactive state.
 */
function hasAccessor(literal: LiteralNode): boolean {
  return (
    literal.type === 'ObjectExpression' &&
    literal.properties.some(
      (property) => property.type === 'Property' && property.kind !== 'init'
    )
  )
}

interface ComputedInfo {
  name: string
  literals: LiteralNode[]
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow mutating nested properties of computed refs whose getter returns a new object',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-deep-mutating-computed-ref.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected:
        'Unexpected mutation of a property of the computed ref "{{name}}". Its getter returns a new object, so the change is not reactive and is lost on the next evaluation.'
    }
  },
  create(context: RuleContext) {
    const sourceCode = context.sourceCode
    /** Computed refs declared at the top level of `<script setup>`, by name. */
    const scriptSetupComputeds = new Map<string, ComputedInfo>()

    function verifyMutation(
      info: ComputedInfo,
      start: Identifier | MemberExpression
    ) {
      const mutation = utils.findMutating(start)
      if (!mutation) {
        return
      }
      // `pathNodes` ends with the written property for assignments,
      // e.g. `obj.value.a.b = 1` mutates the object at `obj.value.a`.
      const path =
        mutation.kind === 'call'
          ? mutation.pathNodes
          : mutation.pathNodes.slice(0, -1)
      if (mutation.kind !== 'call' && mutation.pathNodes.length === 0) {
        // `obj.value = x` calls the setter.
        return
      }
      if (info.literals.every((literal) => isLiteralAtPath(literal, path))) {
        context.report({
          node: mutation.node,
          messageId: 'unexpected',
          data: { name: info.name }
        })
      }
    }

    function verifyVModel(info: ComputedInfo, expression: ESNode) {
      const [, ...members] = utils.getMemberChaining(expression)
      if (members.length === 0) {
        // `v-model="obj"` calls the setter.
        return
      }
      const path = members.slice(0, -1)
      if (info.literals.every((literal) => isLiteralAtPath(literal, path))) {
        context.report({
          node: expression,
          messageId: 'unexpected',
          data: { name: info.name }
        })
      }
    }

    const scriptVisitor: RuleListener = {
      Program() {
        const globalScope =
          sourceCode.scopeManager.globalScope ||
          sourceCode.scopeManager.scopes[0]
        const scriptSetup = utils.getScriptSetupElement(context)

        for (const { node, name } of iterateDefineRefs(globalScope)) {
          if (name !== 'computed') {
            continue
          }
          const declarator = node.parent
          if (
            declarator.type !== 'VariableDeclarator' ||
            declarator.init !== node ||
            declarator.id.type !== 'Identifier' ||
            declarator.parent.type !== 'VariableDeclaration' ||
            declarator.parent.kind !== 'const'
          ) {
            continue
          }
          const getter = getGetter(node)
          const literals =
            getter && getReturnedLiterals(getter, sourceCode.visitorKeys)
          if (!literals) {
            continue
          }
          const info: ComputedInfo = { name: declarator.id.name, literals }

          const variable = findVariable(
            utils.getScope(context, declarator.id),
            declarator.id
          )
          if (!variable) {
            continue
          }
          for (const reference of variable.references) {
            const id = reference.identifier as Identifier
            const member = id.parent
            if (
              member.type === 'MemberExpression' &&
              member.object === id &&
              utils.getStaticPropertyName(member) === 'value'
            ) {
              verifyMutation(info, member)
            }
          }

          if (
            scriptSetup &&
            utils.getScope(context, declarator.id).type === 'module' &&
            scriptSetup.range[0] <= declarator.range[0] &&
            declarator.range[1] <= scriptSetup.range[1]
          ) {
            scriptSetupComputeds.set(info.name, info)
          }
        }
      }
    }

    return utils.defineTemplateBodyVisitor(
      context,
      {
        'VExpressionContainer Identifier'(node: Identifier) {
          const info = scriptSetupComputeds.get(node.name)
          if (!info || !isTemplateReferenceToScope(node)) {
            return
          }
          // In the template, `obj` is unwrapped, so `obj.foo` is `obj.value.foo`.
          verifyMutation(info, node)
        },
        "VAttribute[directive=true][key.name.name='model'] > VExpressionContainer"(
          node: VExpressionContainer
        ) {
          const expression = node.expression
          if (!expression || expression.type !== 'MemberExpression') {
            return
          }
          const [first] = utils.getMemberChaining(expression)
          if (first.type !== 'Identifier') {
            return
          }
          const info = scriptSetupComputeds.get(first.name)
          if (info && isTemplateReferenceToScope(first)) {
            verifyVModel(info, expression)
          }
        }
      },
      scriptVisitor
    )
  }
}

/**
 * Checks whether the given template identifier refers to a variable
 * of `<script setup>`, not to a `v-for` / `v-slot` variable or a property key.
 */
function isTemplateReferenceToScope(node: Identifier): boolean {
  let container: ASTNode = node
  while (container.type !== 'VExpressionContainer') {
    container = container.parent as ASTNode
  }
  return container.references.some(
    (reference) => reference.id === node && reference.variable == null
  )
}
