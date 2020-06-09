/**
 * @see https://github.com/facebook/jsx/blob/master/AST.md
 * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/typescript-estree/src/ts-estree/ts-estree.ts
 */
import { HasParentNode } from '../node'
import * as ES from './es-ast'

export type JSXNode =
  | JSXAttribute
  | JSXClosingElement
  | JSXClosingFragment
  | JSXElement
  | JSXEmptyExpression
  | JSXExpressionContainer
  | JSXFragment
  | JSXIdentifier
  | JSXOpeningElement
  | JSXOpeningFragment
  | JSXSpreadAttribute
  | JSXSpreadChild
  | JSXMemberExpression
  | JSXText

export type JSXChild = JSXElement | JSXExpression | JSXFragment | JSXText
export type JSXExpression =
  | JSXEmptyExpression
  | JSXSpreadChild
  | JSXExpressionContainer
export type JSXTagNameExpression = JSXIdentifier | JSXMemberExpression

export interface JSXAttribute extends HasParentNode {
  type: 'JSXAttribute'
  name: JSXIdentifier
  value: ES.Literal | JSXExpression | null
}

export interface JSXClosingElement extends HasParentNode {
  type: 'JSXClosingElement'
  name: JSXTagNameExpression
}

export interface JSXClosingFragment extends HasParentNode {
  type: 'JSXClosingFragment'
}

export interface JSXElement extends HasParentNode {
  type: 'JSXElement'
  openingElement: JSXOpeningElement
  closingElement: JSXClosingElement | null
  children: JSXChild[]
}

export interface JSXEmptyExpression extends HasParentNode {
  type: 'JSXEmptyExpression'
}

export interface JSXExpressionContainer extends HasParentNode {
  type: 'JSXExpressionContainer'
  expression: ES.Expression | JSXEmptyExpression
}

export interface JSXFragment extends HasParentNode {
  type: 'JSXFragment'
  openingFragment: JSXOpeningFragment
  closingFragment: JSXClosingFragment
  children: JSXChild[]
}

export interface JSXIdentifier extends HasParentNode {
  type: 'JSXIdentifier'
  name: string
}

export interface JSXMemberExpression extends HasParentNode {
  type: 'JSXMemberExpression'
  object: JSXTagNameExpression
  property: JSXIdentifier
}

export interface JSXOpeningElement extends HasParentNode {
  type: 'JSXOpeningElement'
  // typeParameters?: TSTypeParameterInstantiation;
  selfClosing: boolean
  name: JSXTagNameExpression
  attributes: JSXAttribute[]
}

export interface JSXOpeningFragment extends HasParentNode {
  type: 'JSXOpeningFragment'
}

export interface JSXSpreadAttribute extends HasParentNode {
  type: 'JSXSpreadAttribute'
  argument: ES.Expression
}

export interface JSXSpreadChild extends HasParentNode {
  type: 'JSXSpreadChild'
  expression: ES.Expression | JSXEmptyExpression
}

export interface JSXText extends HasParentNode {
  type: 'JSXText'
  value: string
  raw: string
}
