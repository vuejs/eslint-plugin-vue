/**
 * @fileoverview Enforces props default values to be valid.
 * @author Armano
 */
import type {
  ComponentObjectProp,
  ComponentTypeProp,
  ComponentInferTypeProp,
  VueObjectData
} from '../utils/index.js'
import utils from '../utils/index.js'
import { capitalize } from '../utils/casing.ts'
import tsTypes from '../utils/ts-utils/ts-types.js'

const { inferRuntimeTypeFromTypeNode } = tsTypes

const NATIVE_TYPES = new Set([
  'String',
  'Number',
  'Boolean',
  'Function',
  'Object',
  'Array',
  'Symbol',
  'BigInt'
])

const FUNCTION_VALUE_TYPES = new Set(['Function', 'Object', 'Array'])

function getPropertyNode(obj: ObjectExpression, name: string): Property | null {
  for (const p of obj.properties) {
    if (
      p.type === 'Property' &&
      !p.computed &&
      p.key.type === 'Identifier' &&
      p.key.name === name
    ) {
      return p
    }
  }
  return null
}

function getTypes(targetNode: Expression): string[] {
  const node = utils.skipTSAsExpression(targetNode)
  if (node.type === 'Identifier') {
    return [node.name]
  } else if (node.type === 'ArrayExpression') {
    return node.elements
      .filter(
        (item): item is Identifier => item != null && item.type === 'Identifier'
      )
      .map((item) => item.name)
  }
  return []
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce props default values to be valid',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/require-valid-default-prop.html'
    },
    fixable: null,
    schema: [],
    messages: {
      invalidType:
        "Type of the default value for '{{name}}' prop must be a {{types}}."
    }
  },
  create(context: RuleContext) {
    interface StandardValueType {
      type: string
      function: false
    }

    interface FunctionExprValueType {
      type: 'Function'
      function: true
      expression: true
      functionBody: Expression
      returnType: string | null
    }

    interface FunctionValueType {
      type: 'Function'
      function: true
      expression: false
      functionBody: BlockStatement
      returnTypes: PropReturnType[]
    }

    type ComponentObjectDefineProp = ComponentObjectProp & {
      value: ObjectExpression
    }

    interface PropReturnType {
      type: string
      node: Expression
    }

    interface PropDefaultFunctionContext {
      prop: ComponentObjectProp | ComponentTypeProp | ComponentInferTypeProp
      types: Set<string>
      default: FunctionValueType
    }

    const vueObjectPropsContexts = new Map<
      ObjectExpression,
      PropDefaultFunctionContext[]
    >()
    const scriptSetupPropsContexts: {
      node: CallExpression
      props: PropDefaultFunctionContext[]
    }[] = []
    const defineModelPropsContexts: {
      node: CallExpression
      props: PropDefaultFunctionContext[]
    }[] = []

    interface ScopeStack {
      upper: ScopeStack | null
      body: BlockStatement | Expression
      returnTypes?: null | PropReturnType[]
    }

    let scopeStack: ScopeStack | null = null

    function onFunctionExit() {
      scopeStack = scopeStack && scopeStack.upper
    }

    function getValueType(
      targetNode: Expression
    ): StandardValueType | FunctionExprValueType | FunctionValueType | null {
      const node = utils.skipChainExpression(targetNode)
      switch (node.type) {
        case 'CallExpression': {
          // Symbol(), Number() ...
          if (
            node.callee.type === 'Identifier' &&
            NATIVE_TYPES.has(node.callee.name)
          ) {
            return {
              function: false,
              type: node.callee.name
            }
          }
          break
        }
        case 'TemplateLiteral': {
          // String
          return {
            function: false,
            type: 'String'
          }
        }
        case 'Literal': {
          // String, Boolean, Number
          if (node.value === null && !node.bigint) return null
          const type = node.bigint ? 'BigInt' : capitalize(typeof node.value)
          if (NATIVE_TYPES.has(type)) {
            return {
              function: false,
              type
            }
          }
          break
        }
        case 'ArrayExpression': {
          // Array
          return {
            function: false,
            type: 'Array'
          }
        }
        case 'ObjectExpression': {
          // Object
          return {
            function: false,
            type: 'Object'
          }
        }
        case 'FunctionExpression': {
          return {
            function: true,
            expression: false,
            type: 'Function',
            functionBody: node.body,
            returnTypes: []
          }
        }
        case 'ArrowFunctionExpression': {
          if (node.expression) {
            const valueType = getValueType(node.body)
            return {
              function: true,
              expression: true,
              type: 'Function',
              functionBody: node.body,
              returnType: valueType ? valueType.type : null
            }
          }

          return {
            function: true,
            expression: false,
            type: 'Function',
            functionBody: node.body,
            returnTypes: []
          }
        }
      }
      return null
    }

    function report(
      node: Expression,
      prop: ComponentObjectProp | ComponentTypeProp | ComponentInferTypeProp,
      expectedTypeNames: Iterable<string>
    ) {
      const propName =
        prop.propName == null
          ? `[${context.sourceCode.getText(prop.node.key)}]`
          : prop.propName
      context.report({
        node,
        messageId: 'invalidType',
        data: {
          name: propName,
          types: [...expectedTypeNames].join(' or ').toLowerCase()
        }
      })
    }

    interface DefaultDefine {
      expression: Expression
      src: 'assignment' | 'withDefaults' | 'defaultProperty'
    }

    function processPropDefs(
      props: (
        | ComponentObjectProp
        | ComponentTypeProp
        | ComponentInferTypeProp
      )[],
      otherDefaultProvider: (propName: string) => Iterable<DefaultDefine>
    ) {
      const propContexts: PropDefaultFunctionContext[] = []
      for (const prop of props) {
        let typeList
        const defaultList: DefaultDefine[] = []
        if (prop.type === 'object') {
          if (prop.value.type === 'ObjectExpression') {
            const type = getPropertyNode(prop.value, 'type')
            if (!type) continue

            typeList = getTypes(type.value)

            const def = getPropertyNode(prop.value, 'default')
            if (def) {
              defaultList.push({
                src: 'defaultProperty',
                expression: def.value
              })
            }
          } else {
            typeList = getTypes(prop.value)
          }
        } else {
          typeList = prop.types
        }
        if (prop.propName != null) {
          defaultList.push(...otherDefaultProvider(prop.propName))
        }

        if (defaultList.length === 0) continue

        const typeNames = new Set(
          typeList.filter((item) => NATIVE_TYPES.has(item))
        )
        // There is no native types detected
        if (typeNames.size === 0) continue

        for (const defaultDef of defaultList) {
          const defType = getValueType(defaultDef.expression)

          if (!defType) continue

          if (defType.function) {
            if (typeNames.has('Function')) {
              continue
            }
            if (defaultDef.src === 'assignment') {
              // Factory functions cannot be used in default definitions with initial value assignments.
              report(defaultDef.expression, prop, typeNames)
              continue
            }
            if (defType.expression) {
              if (!defType.returnType || typeNames.has(defType.returnType)) {
                continue
              }
              report(defType.functionBody, prop, typeNames)
            } else {
              propContexts.push({
                prop,
                types: typeNames,
                default: defType
              })
            }
          } else {
            if (typeNames.has(defType.type)) {
              if (defaultDef.src === 'assignment') {
                continue
              }
              if (!FUNCTION_VALUE_TYPES.has(defType.type)) {
                // For Array and Object, defaults must be defined in the factory function.
                continue
              }
            }
            report(
              defaultDef.expression,
              prop,
              defaultDef.src === 'assignment'
                ? typeNames
                : [...typeNames].map((type) =>
                    FUNCTION_VALUE_TYPES.has(type) ? 'Function' : type
                  )
            )
          }
        }
      }
      return propContexts
    }

    return utils.compositingVisitors(
      {
        ':function'(
          node:
            | FunctionExpression
            | FunctionDeclaration
            | ArrowFunctionExpression
        ) {
          scopeStack = {
            upper: scopeStack,
            body: node.body,
            returnTypes: null
          }
        },
        ReturnStatement(node: ReturnStatement) {
          if (!scopeStack) {
            return
          }
          if (scopeStack.returnTypes && node.argument) {
            const type = getValueType(node.argument)
            if (type) {
              scopeStack.returnTypes.push({
                type: type.type,
                node: node.argument
              })
            }
          }
        },
        ':function:exit': onFunctionExit
      },
      utils.defineVueVisitor(context, {
        onVueObjectEnter(obj) {
          const props: ComponentObjectDefineProp[] = utils
            .getComponentPropsFromOptions(obj)
            .filter((prop): prop is ComponentObjectDefineProp =>
              Boolean(
                prop.type === 'object' && prop.value.type === 'ObjectExpression'
              )
            )
          const propContexts = processPropDefs(props, () => [])
          vueObjectPropsContexts.set(obj, propContexts)
        },
        ':function'(
          node:
            | FunctionExpression
            | FunctionDeclaration
            | ArrowFunctionExpression,
          { node: vueNode }: VueObjectData
        ) {
          const data = vueObjectPropsContexts.get(vueNode)
          if (!data || !scopeStack) {
            return
          }

          for (const { default: defType } of data) {
            if (node.body === defType.functionBody) {
              scopeStack.returnTypes = defType.returnTypes
            }
          }
        },
        onVueObjectExit(obj) {
          const data = vueObjectPropsContexts.get(obj)
          if (!data) {
            return
          }
          for (const { prop, types: typeNames, default: defType } of data) {
            for (const returnType of defType.returnTypes) {
              if (typeNames.has(returnType.type)) continue

              report(returnType.node, prop, typeNames)
            }
          }
        }
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, baseProps) {
          const props = baseProps.filter(
            (
              prop
            ): prop is
              | ComponentObjectProp
              | ComponentInferTypeProp
              | ComponentTypeProp =>
              Boolean(
                prop.type === 'type' ||
                prop.type === 'infer-type' ||
                prop.type === 'object'
              )
          )
          const defaultsByWithDefaults =
            utils.getWithDefaultsPropExpressions(node)
          const defaultsByAssignmentPatterns =
            utils.getDefaultPropExpressionsForPropsDestructure(node)
          const propContexts = processPropDefs(
            props,
            function* (propName: string) {
              const withDefaults = defaultsByWithDefaults[propName]
              if (withDefaults) {
                yield { src: 'withDefaults', expression: withDefaults }
              }
              const assignmentPattern = defaultsByAssignmentPatterns[propName]
              if (assignmentPattern) {
                yield {
                  src: 'assignment',
                  expression: assignmentPattern.expression
                }
              }
            }
          )
          scriptSetupPropsContexts.push({ node, props: propContexts })
        },
        ':function'(
          node:
            | FunctionExpression
            | FunctionDeclaration
            | ArrowFunctionExpression
        ) {
          if (!scopeStack) {
            return
          }

          const propsData = scriptSetupPropsContexts.at(-1)
          if (propsData) {
            for (const { default: defType } of propsData.props) {
              if (node.body === defType.functionBody) {
                scopeStack.returnTypes = defType.returnTypes
              }
            }
          }
          const modelData = defineModelPropsContexts.at(-1)
          if (modelData) {
            for (const { default: defType } of modelData.props) {
              if (node.body === defType.functionBody) {
                scopeStack.returnTypes = defType.returnTypes
              }
            }
          }
        },
        onDefinePropsExit() {
          const data = scriptSetupPropsContexts.pop()
          if (!data) {
            return
          }
          for (const {
            prop,
            types: typeNames,
            default: defType
          } of data.props) {
            for (const returnType of defType.returnTypes) {
              if (typeNames.has(returnType.type)) continue

              report(returnType.node, prop, typeNames)
            }
          }
        },
        onDefineModelEnter(node, model) {
          let syntheticProp: ComponentObjectProp | ComponentInferTypeProp | null = null
          let defaultFromOptions: Property | null = null

          if (model.typeNode) {
            syntheticProp = {
              type: 'infer-type',
              propName: model.name.modelName,
              node: model.typeNode,
              required: false,
              types: inferRuntimeTypeFromTypeNode(context, model.typeNode)
            }
            if (model.options && model.options.type === 'ObjectExpression') {
              defaultFromOptions = getPropertyNode(model.options, 'default')
            }
          } else if (
            model.options &&
            model.options.type === 'ObjectExpression'
          ) {
            syntheticProp = {
              type: 'object',
              propName: model.name.modelName,
              key: model.options,
              value: model.options,
              // `node` is only accessed in report() when propName is null,
              // which never occurs here since propName is always modelName.
              node: node as any
            }
          }

          if (!syntheticProp) {
            return
          }

          const propContexts = processPropDefs([syntheticProp], function* () {
            if (defaultFromOptions) {
              yield {
                src: 'defaultProperty',
                expression: defaultFromOptions.value
              }
            }
          })
          defineModelPropsContexts.push({ node, props: propContexts })
        },
        onDefineModelExit() {
          const data = defineModelPropsContexts.pop()
          if (!data) {
            return
          }
          for (const {
            prop,
            types: typeNames,
            default: defType
          } of data.props) {
            for (const returnType of defType.returnTypes) {
              if (typeNames.has(returnType.type)) continue
              report(returnType.node, prop, typeNames)
            }
          }
        }
      })
    )
  }
}
