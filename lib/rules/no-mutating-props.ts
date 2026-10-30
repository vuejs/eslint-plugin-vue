/**
 * @fileoverview disallow mutation component props
 * @author 2018 Armano
 */
import utils from '../utils/index.ts'
import { findVariable } from '@eslint-community/eslint-utils'

interface PropsInfo {
  name?: string
  set: Set<string>
}

// https://github.com/vuejs/vue-next/blob/7c11c58faf8840ab97b6449c98da0296a60dddd8/packages/shared/src/globalsWhitelist.ts
const GLOBALS_WHITE_LISTED = new Set([
  'Infinity',
  'undefined',
  'NaN',
  'isFinite',
  'isNaN',
  'parseFloat',
  'parseInt',
  'decodeURI',
  'decodeURIComponent',
  'encodeURI',
  'encodeURIComponent',
  'Math',
  'Number',
  'Date',
  'Array',
  'Object',
  'Boolean',
  'String',
  'RegExp',
  'Map',
  'Set',
  'JSON',
  'Intl',
  'BigInt'
])

function getVExpressionContainer(node: ASTNode): VExpressionContainer {
  let n = node
  while (n.type !== 'VExpressionContainer') {
    n = n.parent as ASTNode
  }
  return n
}

function isVmReference(node: ASTNode): node is Identifier {
  if (node.type !== 'Identifier') {
    return false
  }
  const parent = node.parent
  if (parent.type === 'MemberExpression') {
    if (parent.property === node) {
      // foo.id
      return false
    }
  } else if (
    parent.type === 'Property' &&
    parent.key === node &&
    !parent.computed
  ) {
    // {id: foo}
    return false
  }

  const exprContainer = getVExpressionContainer(node)

  for (const reference of exprContainer.references) {
    if (reference.variable != null) {
      // Not vm reference
      continue
    }
    if (reference.id === node) {
      return true
    }
  }
  return false
}

/**
 * @param options.shallowOnly Enables mutating the value of a prop but leaving the reference the same
 */
function parseOptions(options: { shallowOnly?: boolean } | undefined) {
  return Object.assign(
    {
      shallowOnly: false
    },
    options
  )
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow mutation of component props',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-mutating-props.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          shallowOnly: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpectedMutation: 'Unexpected mutation of "{{key}}" prop.'
    }
  },
  create(context: RuleContext) {
    const { shallowOnly } = parseOptions(context.options[0])
    const propsMap = new Map<ObjectExpression | CallExpression, PropsInfo>()
    let vueObjectData:
      | {
          type: 'export' | 'mark' | 'definition'
          object: ObjectExpression
        }
      | { type: 'setup'; object: CallExpression }
      | null = null

    function report(node: ASTNode, name: string) {
      context.report({
        node,
        messageId: 'unexpectedMutation',
        data: {
          key: name
        }
      })
    }

    function getPropertyNameText(
      node: MemberExpression | AssignmentProperty
    ): string {
      const name = utils.getStaticPropertyName(node)
      if (name) {
        return name
      }
      if (node.computed) {
        const expr = node.type === 'Property' ? node.key : node.property
        const str = context.sourceCode.getText(expr)
        return `[${str}]`
      }
      return '?unknown?'
    }

    function verifyMutating(
      props: MemberExpression | Identifier,
      name: string,
      isRootProps: boolean = false
    ) {
      const invalid = utils.findMutating(props)
      if (invalid && isShallowOnlyInvalid(invalid, isRootProps)) {
        report(invalid.node, name)
      }
    }

    function* iteratePatternProperties(
      param: Pattern,
      path: string[]
    ): Generator<{ node: Identifier; path: string[] }> {
      if (!param) {
        return
      }
      switch (param.type) {
        case 'Identifier': {
          yield { node: param, path }
          break
        }
        case 'RestElement': {
          yield* iteratePatternProperties(param.argument, path)
          break
        }
        case 'AssignmentPattern': {
          yield* iteratePatternProperties(param.left, path)
          break
        }
        case 'ObjectPattern': {
          for (const prop of param.properties) {
            if (prop.type === 'Property') {
              const name = getPropertyNameText(prop)
              yield* iteratePatternProperties(prop.value, [...path, name])
            } else if (prop.type === 'RestElement') {
              yield* iteratePatternProperties(prop.argument, path)
            }
          }
          break
        }
        case 'ArrayPattern': {
          for (let index = 0; index < param.elements.length; index++) {
            const element = param.elements[index]
            if (element)
              yield* iteratePatternProperties(element, [...path, String(index)])
          }
          break
        }
      }
    }

    function verifyPropVariable(prop: Identifier, path: string[]) {
      const variable = findVariable(utils.getScope(context, prop), prop)
      if (!variable) {
        return
      }

      for (const reference of variable.references) {
        if (!reference.isRead()) {
          continue
        }
        const id = reference.identifier

        const invalid = utils.findMutating(id)
        if (!invalid || !isShallowOnlyInvalid(invalid, path.length === 0)) {
          continue
        }
        let name
        if (path.length === 0) {
          if (invalid.pathNodes.length === 0) {
            continue
          }
          const mem = invalid.pathNodes[0]
          name = getPropertyNameText(mem)
        } else {
          if (invalid.pathNodes.length === 0 && invalid.kind !== 'call') {
            continue
          }
          name = path[0]
        }

        report(invalid.node, name)
      }
    }

    /**
     * Verifies that a `defineModel()` ref binding is not mutated through `.value`.
     *
     * `defineModel()` returns a ref that bridges a `modelValue` prop and an
     * `update:modelValue` emit. Reassigning the ref (`model.value = next`) goes
     * through the ref setter and emits the update, so it is the correct pattern and
     * is intentionally allowed. Mutating a nested property in place
     * (`model.value.foo = 1`, `model.value.items[0] = 1`, `model.value.items.push(1)`,
     * `Object.assign(model.value, {...})`) bypasses the setter, never emits, and
     * silently desyncs the parent, so it is reported.
     */
    function verifyModelVariable(defId: Identifier, name: string) {
      const variable = findVariable(utils.getScope(context, defId), defId)
      if (!variable) {
        return
      }

      for (const reference of variable.references) {
        if (!reference.isRead()) {
          continue
        }
        const id = reference.identifier
        const valueNode = id.parent
        if (
          !valueNode ||
          valueNode.type !== 'MemberExpression' ||
          valueNode.object !== id ||
          utils.getStaticPropertyName(valueNode) !== 'value'
        ) {
          continue
        }

        const invalid = utils.findMutating(valueNode)
        if (!invalid) {
          continue
        }
        // `model.value = next` (empty path, assignment/update) reassigns the ref and
        // is the required update pattern; only report mutation nested below `.value`
        // or in-place calls such as `push()`/`Object.assign()`.
        const isNestedMutation =
          invalid.pathNodes.length > 0 || invalid.kind === 'call'
        if (!isNestedMutation) {
          continue
        }
        // `shallowOnly` permits mutating the value while keeping the reference; for a
        // model ref that means nested mutation is allowed.
        if (shallowOnly) {
          continue
        }

        report(invalid.node, name)
      }
    }

    function* extractDefineVariableNames() {
      const globalScope = context.sourceCode.scopeManager.globalScope
      if (!globalScope) {
        return
      }
      for (const variable of globalScope.variables) {
        if (variable.defs.length > 0) {
          yield variable.name
        }
      }
      const moduleScope = globalScope.childScopes.find(
        (scope) => scope.type === 'module'
      )
      const moduleVariables = (moduleScope && moduleScope.variables) || []
      for (const variable of moduleVariables) {
        if (variable.defs.length > 0) {
          yield variable.name
        }
      }
    }

    /**
     * Is shallowOnly false or the prop reassigned
     */
    function isShallowOnlyInvalid(
      invalid: Exclude<ReturnType<typeof utils.findMutating>, null>,
      isRootProps: boolean
    ): boolean {
      return (
        !shallowOnly ||
        (invalid.pathNodes.length === (isRootProps ? 1 : 0) &&
          ['assignment', 'update'].includes(invalid.kind))
      )
    }

    return utils.compositingVisitors(
      {},
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, props) {
          const defineVariableNames = new Set(extractDefineVariableNames())

          const propsInfo = {
            name: '',
            set: new Set(
              props
                .map((p) => p.propName)
                .filter(
                  (propName): propName is string =>
                    utils.isDef(propName) &&
                    !GLOBALS_WHITE_LISTED.has(propName) &&
                    !defineVariableNames.has(propName)
                )
            )
          }
          propsMap.set(node, propsInfo)
          vueObjectData = {
            type: 'setup',
            object: node
          }

          let target = node
          if (
            target.parent &&
            target.parent.type === 'CallExpression' &&
            target.parent.arguments[0] === target &&
            target.parent.callee.type === 'Identifier' &&
            target.parent.callee.name === 'withDefaults'
          ) {
            target = target.parent
          }

          if (
            !target.parent ||
            target.parent.type !== 'VariableDeclarator' ||
            target.parent.init !== target
          ) {
            return
          }

          const patternProperties = iteratePatternProperties(
            target.parent.id,
            []
          )
          for (const { node: prop, path } of patternProperties) {
            if (path.length === 0) {
              propsInfo.name = prop.name
            } else {
              propsInfo.set.add(prop.name)
            }
            verifyPropVariable(prop, path)
          }
        },
        onDefineModelEnter(node, model) {
          const parent = node.parent
          if (
            !parent ||
            parent.type !== 'VariableDeclarator' ||
            parent.init !== node
          ) {
            return
          }
          const id = parent.id
          if (id.type === 'Identifier') {
            // `const model = defineModel()`
            verifyModelVariable(id, model.name.modelName)
          } else if (id.type === 'ArrayPattern') {
            // `const [model, modifiers] = defineModel()`. The first element is
            // the model ref; the second is the modifiers object.
            const modelRef = id.elements[0]
            if (modelRef && modelRef.type === 'Identifier') {
              verifyModelVariable(modelRef, model.name.modelName)
            }
          }
        }
      }),
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          propsMap.set(node, {
            set: new Set(
              utils
                .getComponentPropsFromOptions(node)
                .map((p) => p.propName)
                .filter(utils.isDef)
            )
          })
        },
        onVueObjectExit(node, { type }) {
          if (
            type !== 'instance' &&
            (!vueObjectData ||
              (vueObjectData.type !== 'export' &&
                vueObjectData.type !== 'setup'))
          ) {
            vueObjectData = {
              type,
              object: node
            }
          }
        },
        onSetupFunctionEnter(node) {
          const propsParam = node.params[0]
          if (
            // no arguments
            !propsParam ||
            // cannot check
            propsParam.type === 'RestElement' ||
            propsParam.type === 'ArrayPattern'
          ) {
            return
          }
          const patternProperties = iteratePatternProperties(propsParam, [])
          for (const { node: prop, path } of patternProperties) {
            verifyPropVariable(prop, path)
          }
        },
        'MemberExpression > :matches(Identifier, ThisExpression)'(
          node: (Identifier | ThisExpression) & { parent: MemberExpression },
          { node: vueNode }
        ) {
          if (!utils.isThis(node, context)) {
            return
          }
          const mem = node.parent
          if (mem.object !== node) {
            return
          }
          const name = utils.getStaticPropertyName(mem)
          if (name && (propsMap.get(vueNode) as PropsInfo).set.has(name)) {
            verifyMutating(mem, name)
          }
        }
      }),
      utils.defineTemplateBodyVisitor(context, {
        'VExpressionContainer MemberExpression > ThisExpression'(
          node: ThisExpression & { parent: MemberExpression }
        ) {
          if (!vueObjectData) {
            return
          }
          const mem = node.parent
          if (mem.object !== node) {
            return
          }
          const name = utils.getStaticPropertyName(mem)
          if (
            name &&
            (propsMap.get(vueObjectData.object) as PropsInfo).set.has(name)
          ) {
            verifyMutating(mem, name)
          }
        },
        'VExpressionContainer Identifier'(node: Identifier) {
          if (!vueObjectData || !isVmReference(node)) {
            return
          }
          const propsInfo = propsMap.get(vueObjectData.object) as PropsInfo
          const isRootProps = propsInfo.name === node.name
          const parent = node.parent
          const name =
            (isRootProps &&
              parent.type === 'MemberExpression' &&
              utils.getStaticPropertyName(parent)) ||
            node.name
          if (name && (isRootProps || propsInfo.set.has(name))) {
            verifyMutating(node, name, isRootProps)
          }
        },
        "VAttribute[directive=true]:matches([key.name.name='model'], [key.name.name='bind']) VExpressionContainer > *"(
          node: ESNode
        ) {
          if (!vueObjectData) {
            return
          }
          let attr = node.parent
          while (attr && attr.type !== 'VAttribute') {
            attr = attr.parent
          }
          if (
            attr &&
            attr.directive &&
            attr.key.name.name === 'bind' &&
            attr.key.modifiers.every((mod) => mod.name !== 'sync')
          ) {
            return
          }

          const propsInfo = propsMap.get(vueObjectData.object) as PropsInfo

          const nodes = utils.getMemberChaining(node)
          const first = nodes[0]
          let name
          if (isVmReference(first)) {
            if (first.name === propsInfo.name) {
              // props variable
              if (shallowOnly && nodes.length > 2) {
                return
              }
              name = (nodes[1] && getPropertyNameText(nodes[1])) || first.name
            } else {
              if (shallowOnly && nodes.length > 1) {
                return
              }
              name = first.name
              if (!name || !propsInfo.set.has(name)) {
                return
              }
            }
          } else if (first.type === 'ThisExpression') {
            if (shallowOnly && nodes.length > 2) {
              return
            }
            const mem = nodes[1]
            if (!mem) {
              return
            }
            name = utils.getStaticPropertyName(mem)
            if (!name || !propsInfo.set.has(name)) {
              return
            }
          } else {
            return
          }
          report(node, name)
        }
      })
    )
  }
}
