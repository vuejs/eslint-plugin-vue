import type { TSESTree } from '@typescript-eslint/types'
import type * as ESTree from 'estree'
type TSNodeWithoutES = Exclude<TSESTree.Node, { type: ESTree.Node['type'] }>
type TSNodeListenerMap<T extends TSNodeWithoutES = TSNodeWithoutES> = {
  [key in TSNodeWithoutES['type']]: T extends { type: key } ? T : never
}

type TSNodeListenerBase = {
  [T in keyof TSNodeListenerMap]?: (node: TSNodeListenerMap[T]) => void
}
type ParamNode = never // You specify the node type in JSDoc.
export interface TSNodeListener extends TSNodeListenerBase {
  [key: string]: ((node: ParamNode) => void) | undefined
}
