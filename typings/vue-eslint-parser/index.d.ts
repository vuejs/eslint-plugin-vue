import { VisitorKeys } from 'eslint-visitor-keys'
import * as VAST from '../eslint-plugin-vue/util-types/ast'
export namespace AST {
  function getFallbackKeys(node: VAST.ASTNode): string[]
  export interface Visitor {
    visitorKeys?: VisitorKeys
    enterNode(node: VAST.ASTNode, parent: VAST.ASTNode | null): void
    leaveNode(node: VAST.ASTNode, parent: VAST.ASTNode | null): void
  }
  export function traverseNodes(node: VAST.ASTNode, visitor: Visitor): void
  export { getFallbackKeys }

  export const NS: VAST.NS
}
