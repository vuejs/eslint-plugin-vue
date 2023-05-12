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
  onSetupFunctionExit?(
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
  onDefinePropsEnter?(node: CallExpression, props: ComponentProp[]): void
  onDefinePropsExit?(node: CallExpression, props: ComponentProp[]): void
  onDefineEmitsEnter?(node: CallExpression, emits: ComponentEmit[]): void
  onDefineEmitsExit?(node: CallExpression, emits: ComponentEmit[]): void
  onDefineOptionsEnter?(node: CallExpression): void
  onDefineOptionsExit?(node: CallExpression): void
  onDefineSlotsEnter?(node: CallExpression): void
  onDefineSlotsExit?(node: CallExpression): void
  [query: string]:
    | ((node: VAST.ParamNode) => void)
    | ((node: CallExpression, props: ComponentProp[]) => void)
    | ((node: CallExpression, emits: ComponentEmit[]) => void)
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

export type ComponentUnknownProp = {
  type: 'unknown'
  key: null
  propName: null
  value: null
  node: Expression | SpreadElement | null
}

export type ComponentTypeProp = {
  type: 'type'
  key: Identifier | Literal
  propName: string
  value: null
  node: TSPropertySignature | TSMethodSignature

  required: boolean
  types: string[]
}

export type ComponentProp =
  | ComponentArrayProp
  | ComponentObjectProp
  | ComponentTypeProp
  | ComponentUnknownProp

type ComponentArrayEmitDetectName = {
  type: 'array'
  key: Literal | TemplateLiteral
  emitName: string
  value: null
  node: Expression | SpreadElement
}
type ComponentArrayEmitUnknownName = {
  type: 'array'
  key: null
  emitName: null
  value: null
  node: Expression | SpreadElement
}
export type ComponentArrayEmit =
  | ComponentArrayEmitDetectName
  | ComponentArrayEmitUnknownName
type ComponentObjectEmitDetectName = {
  type: 'object'
  key: Expression
  emitName: string
  value: Expression
  node: Property
}
type ComponentObjectEmitUnknownName = {
  type: 'object'
  key: null
  emitName: null
  value: Expression
  node: Property
}

export type ComponentObjectEmit =
  | ComponentObjectEmitDetectName
  | ComponentObjectEmitUnknownName

export type ComponentUnknownEmit = {
  type: 'unknown'
  key: null
  emitName: null
  value: null
  node: Expression | SpreadElement | null
}

export type ComponentTypeEmit = {
  type: 'type'
  key: TSLiteralType
  emitName: string
  value: null
  node: TSCallSignatureDeclaration | TSFunctionType
}

export type ComponentEmit =
  | ComponentArrayEmit
  | ComponentObjectEmit
  | ComponentTypeEmit
  | ComponentUnknownEmit
