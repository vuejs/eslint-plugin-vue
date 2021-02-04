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
