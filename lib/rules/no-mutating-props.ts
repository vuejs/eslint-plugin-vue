/**
 * @fileoverview disallow mutation component props
 * @author 2018 Armano
 */
import utils from '../utils/index.js'
import { getScope } from '../utils/scope.ts'
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

function parseOptions(options: {
  /** Enables mutating the value of a prop but leaving the reference the same */
  shallowOnly: boolean
}) {
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
      | { type: 'export' | 'mark' | 'definition'; object: ObjectExpression }
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
              yield* iteratePatternProperties(element, [...path, `${index}`])
          }
          break
        }
      }
    }

    function verifyPropVariable(prop: Identifier, path: string[]) {
      const variable = findVariable(getScope(context, prop), prop)
      if (!variable) {
        return
      }

      for (const reference of variable.references) {
        if (!reference.isRead()) {
          continue
        }
        const id = reference.identifier

        const invalid = utils.findMutating(id)
        if (!invalid) {
          continue
        }
        let name
        if (!isShallowOnlyInvalid(invalid, path.length === 0)) {
          continue
        }
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

    function* extractDefineVariableNames() {
      const globalScope = context.sourceCode.scopeManager.globalScope
      if (globalScope) {
        for (const variable of globalScope.variables) {
          if (variable.defs.length > 0) {
            yield variable.name
          }
        }
        const moduleScope = globalScope.childScopes.find(
          (scope) => scope.type === 'module'
        )
        for (const variable of (moduleScope && moduleScope.variables) || []) {
          if (variable.defs.length > 0) {
            yield variable.name
          }
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

          for (const { node: prop, path } of iteratePatternProperties(
            target.parent.id,
            []
          )) {
            if (path.length === 0) {
              propsInfo.name = prop.name
            } else {
              propsInfo.set.add(prop.name)
            }
            verifyPropVariable(prop, path)
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
            (!vueObjectData ||
              (vueObjectData.type !== 'export' &&
                vueObjectData.type !== 'setup')) &&
            type !== 'instance'
          ) {
            vueObjectData = {
              type,
              object: node
            }
          }
        },
        onSetupFunctionEnter(node) {
          const propsParam = node.params[0]
          if (!propsParam) {
            // no arguments
            return
          }
          if (
            propsParam.type === 'RestElement' ||
            propsParam.type === 'ArrayPattern'
          ) {
            // cannot check
            return
          }
          for (const { node: prop, path } of iteratePatternProperties(
            propsParam,
            []
          )) {
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
          if (name && propsMap.get(vueNode)!.set.has(name)) {
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
          if (name && propsMap.get(vueObjectData.object)!.set.has(name)) {
            verifyMutating(mem, name)
          }
        },
        'VExpressionContainer Identifier'(node: Identifier) {
          if (!vueObjectData) {
            return
          }
          if (!isVmReference(node)) {
            return
          }
          const propsInfo = propsMap.get(vueObjectData.object)!
          const isRootProps = !!node.name && propsInfo.name === node.name
          const parent = node.parent
          const name =
            (isRootProps &&
              parent.type === 'MemberExpression' &&
              utils.getStaticPropertyName(parent)) ||
            node.name
          if (name && (propsInfo.set.has(name) || isRootProps)) {
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
            !attr.key.modifiers.some((mod) => mod.name === 'sync')
          ) {
            return
          }

          const propsInfo = propsMap.get(vueObjectData.object)!

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
