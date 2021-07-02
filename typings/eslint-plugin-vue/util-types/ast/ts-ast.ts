/**
 * @see https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/typescript-estree/src/ts-estree/ts-estree.ts
 */
import { HasParentNode } from '../node'
import * as ES from './es-ast'
import { TSESTree } from '@typescript-eslint/types'
export type TSNode =
  | TSAsExpression
  | TSTypeParameterInstantiation
  | TSPropertySignature
  | TSMethodSignatureBase

export interface TSAsExpression extends HasParentNode {
  type: 'TSAsExpression'
  expression: ES.Expression
  typeAnnotation: any
}

export interface TSTypeParameterInstantiation extends HasParentNode {
  type: 'TSTypeParameterInstantiation'
  params: TSESTree.TypeNode[]
}

export type TSPropertySignature =
  | TSPropertySignatureComputedName
  | TSPropertySignatureNonComputedName
interface TSPropertySignatureBase extends HasParentNode {
  type: 'TSPropertySignature'
  key: TSESTree.PropertyName
  optional?: boolean
  computed: boolean
  typeAnnotation?: TSESTree.TSTypeAnnotation
  initializer?: Expression
  readonly?: boolean
  static?: boolean
  export?: boolean
  accessibility?: TSESTree.Accessibility
}
interface TSPropertySignatureComputedName extends TSPropertySignatureBase {
  key: TSESTree.PropertyNameComputed
  computed: true
}
interface TSPropertySignatureNonComputedName extends TSPropertySignatureBase {
  key: TSESTree.PropertyNameNonComputed
  computed: false
}

export type TSMethodSignature =
  | TSMethodSignatureComputedName
  | TSMethodSignatureNonComputedName
interface TSMethodSignatureBase extends HasParentNode {
  type: 'TSMethodSignature'
  key: TSESTree.PropertyName
  computed: boolean
  params: TSESTree.Parameter[]
  optional?: boolean
  returnType?: TSESTree.TSTypeAnnotation
  readonly?: boolean
  typeParameters?: TSESTree.TSTypeParameterDeclaration
  accessibility?: TSESTree.Accessibility
  export?: boolean
  static?: boolean
  kind: 'get' | 'method' | 'set'
}
interface TSMethodSignatureComputedName extends TSMethodSignatureBase {
  key: TSESTree.PropertyNameComputed
  computed: true
}
interface TSMethodSignatureNonComputedName extends TSMethodSignatureBase {
  key: TSESTree.PropertyNameNonComputed
  computed: false
}
