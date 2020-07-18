/**
 * @see https://github.com/mysticatea/vue-eslint-parser/blob/master/docs/ast.md
 */
import { HasParentNode, BaseNode } from '../node'
import { Token, HTMLComment, HTMLBogusComment, Comment } from '../node'
import { ParseError } from '../errors'
import * as ES from './es-ast'

export type NS = {
  HTML: 'http://www.w3.org/1999/xhtml'
  MathML: 'http://www.w3.org/1998/Math/MathML'
  SVG: 'http://www.w3.org/2000/svg'
  XLink: 'http://www.w3.org/1999/xlink'
  XML: 'http://www.w3.org/XML/1998/namespace'
  XMLNS: 'http://www.w3.org/2000/xmlns/'
}
export type Namespace =
  | NS['HTML']
  | NS['MathML']
  | NS['SVG']
  | NS['XLink']
  | NS['XML']
  | NS['XMLNS']
export interface VVariable {
  id: ES.Identifier
  kind: 'v-for' | 'scope'
  references: VReference[]
}
export interface VReference {
  id: ES.Identifier
  mode: 'rw' | 'r' | 'w'
  variable: VVariable | null
}
export interface VForExpression extends HasParentNode {
  type: 'VForExpression'
  parent: VExpressionContainer
  left: ES.Pattern[]
  right: ES.Expression
}
export interface VOnExpression extends HasParentNode {
  type: 'VOnExpression'
  parent: VExpressionContainer
  body: ES.Statement[]
}
export interface VSlotScopeExpression extends HasParentNode {
  type: 'VSlotScopeExpression'
  parent: VExpressionContainer
  params: ES._FunctionParameter[]
}
export interface VFilterSequenceExpression extends HasParentNode {
  type: 'VFilterSequenceExpression'
  parent: VExpressionContainer
  expression: ES.Expression
  filters: VFilter[]
}
export interface VFilter extends HasParentNode {
  type: 'VFilter'
  parent: VFilterSequenceExpression
  callee: ES.Identifier
  arguments: (ES.Expression | ES.SpreadElement)[]
}
export type VNode =
  | VAttribute
  | VDirective
  | VDirectiveKey
  | VElement
  | VEndTag
  | VExpressionContainer
  | VIdentifier
  | VLiteral
  | VStartTag
  | VText
  | VDocumentFragment
  | VForExpression
  | VOnExpression
  | VSlotScopeExpression
  | VFilterSequenceExpression
  | VFilter

export interface VText extends HasParentNode {
  type: 'VText'
  parent: VDocumentFragment | VElement
  value: string
}
export interface VExpressionContainer extends HasParentNode {
  type: 'VExpressionContainer'
  parent: VDocumentFragment | VElement | VDirective | VDirectiveKey
  expression:
    | ES.Expression
    | VFilterSequenceExpression
    | VForExpression
    | VOnExpression
    | VSlotScopeExpression
    | null
  references: VReference[]
}
export interface VIdentifier extends HasParentNode {
  type: 'VIdentifier'
  parent: VAttribute | VDirectiveKey
  name: string
  rawName: string
}
export interface VDirectiveKey extends HasParentNode {
  type: 'VDirectiveKey'
  parent: VDirective
  name: VIdentifier
  argument: VExpressionContainer | VIdentifier | null
  modifiers: VIdentifier[]
}
export interface VLiteral extends HasParentNode {
  type: 'VLiteral'
  parent: VAttribute
  value: string
}
export interface VAttribute extends HasParentNode {
  type: 'VAttribute'
  parent: VStartTag
  directive: false
  key: VIdentifier
  value: VLiteral | null
}
export interface VDirective extends HasParentNode {
  type: 'VAttribute'
  parent: VStartTag
  directive: true
  key: VDirectiveKey
  value: VExpressionContainer | null
}
export interface VStartTag extends HasParentNode {
  type: 'VStartTag'
  parent: VElement
  selfClosing: boolean
  attributes: (VAttribute | VDirective)[]
}
export interface VEndTag extends HasParentNode {
  type: 'VEndTag'
  parent: VElement
}
interface HasConcreteInfo {
  tokens: Token[]
  comments: (HTMLComment | HTMLBogusComment | Comment)[]
  errors: ParseError[]
}
export interface VRootElement extends HasParentNode, HasConcreteInfo {
  type: 'VElement'
  parent: VDocumentFragment
  namespace: Namespace
  name: string
  rawName: string
  startTag: VStartTag
  children: (VElement | VText | VExpressionContainer)[]
  endTag: VEndTag | null
  variables: VVariable[]
}

interface VChildElement extends HasParentNode {
  type: 'VElement'
  parent: VRootElement | VElement
  namespace: Namespace
  name: string
  rawName: string
  startTag: VStartTag
  children: (VElement | VText | VExpressionContainer)[]
  endTag: VEndTag | null
  variables: VVariable[]
}

export type VElement = VChildElement | VRootElement

export interface VDocumentFragment extends BaseNode, HasConcreteInfo {
  type: 'VDocumentFragment'
  parent: null
  children: (VElement | VText | VExpressionContainer)[]
}
