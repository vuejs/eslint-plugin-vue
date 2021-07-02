import * as VAST from './ast'
export type VueObjectType = 'mark' | 'export' | 'definition' | 'instance'
export type VueObjectData = {
  node: ObjectExpression
  type: VueObjectType
  parent: VueObjectData | null
  functional: boolean
}
type VueVisitorBase = {
  [T in keyof NodeListenerMap]?: (
    node: NodeListenerMap[T],
    obj: VueObjectData
  ) => void
}
export interface VueVisitor extends VueVisitorBase {
  onVueObjectEnter?(node: ObjectExpression, obj: VueObjectData): void
  onVueObjectExit?(node: ObjectExpression, obj: VueObjectData): void
  onSetupFunctionEnter?(
    node: (FunctionExpression | ArrowFunctionExpression) & { parent: Property },
    obj: VueObjectData
  ): void
  onRenderFunctionEnter?(
    node: (FunctionExpression | ArrowFunctionExpression) & { parent: Property },
    obj: VueObjectData
  ): void
  [query: string]:
    | ((node: VAST.ParamNode, obj: VueObjectData) => void)
    | undefined
}

type ScriptSetupVisitorBase = {
  [T in keyof NodeListenerMap]?: (node: NodeListenerMap[T]) => void
}
export interface ScriptSetupVisitor extends ScriptSetupVisitorBase {
  onDefinePropsEnter?(
    node: CallExpression,
    props: (ComponentArrayProp | ComponentObjectProp)[]
  ): void
  onDefinePropsExit?(
    node: CallExpression,
    props: (ComponentArrayProp | ComponentObjectProp)[]
  ): void
  [query: string]:
    | ((node: VAST.ParamNode) => void)
    | ((
        node: CallExpression,
        props: (ComponentArrayProp | ComponentObjectProp)[]
      ) => void)
    | undefined
}

type ComponentArrayPropDetectName = {
  type: 'array'
  key: Literal | TemplateLiteral
  propName: string
  value: null
  node: Expression | SpreadElement
}
type ComponentArrayPropUnknownName = {
  type: 'array'
  key: null
  propName: null
  value: null
  node: Expression | SpreadElement
}
export type ComponentArrayProp =
  | ComponentArrayPropDetectName
  | ComponentArrayPropUnknownName

type ComponentObjectPropDetectName = {
  type: 'object'
  key: Expression
  propName: string
  value: Expression
  node: Property
}
type ComponentObjectPropUnknownName = {
  type: 'object'
  key: null
  propName: null
  value: Expression
  node: Property
}
export type ComponentObjectProp =
  | ComponentObjectPropDetectName
  | ComponentObjectPropUnknownName
