import { HasLocation } from './locations'
import * as VAST from '../ast'

export interface BaseNode extends HasLocation {
  type: string
  parent: VAST.ASTNode | null
}

export interface HasParentNode extends BaseNode {
  parent: VAST.ASTNode
}
