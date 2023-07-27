import * as VAST from '../../eslint-plugin-vue/util-types/ast'
import { Token, Comment } from '../../eslint-plugin-vue/util-types/node'
import { ParserServices } from '../../eslint-plugin-vue/util-types/parser-services'
import eslint from 'eslint'

export function findVariable(
  initialScope: eslint.Scope.Scope,
  nameOrNode: VAST.Identifier | string
): eslint.Scope.Variable

export function getStaticValue(
  node: VAST.ESNode,
  initialScope?: eslint.Scope.Scope
): { value: any } | null

export function isParenthesized(
  num: number,
  node: VAST.ESNode,
  sourceCode: eslint.SourceCode | ParserServices.TokenStore
): boolean
export function isParenthesized(
  node: VAST.ESNode,
  sourceCode: eslint.SourceCode | ParserServices.TokenStore
): boolean

export namespace TYPES {
  type TraceKind = {
    [ReferenceTracker.READ]?: boolean
    [ReferenceTracker.CALL]?: boolean
    [ReferenceTracker.CONSTRUCT]?: boolean
    [ReferenceTracker.ESM]?: boolean
  }
  type TraceMap = {
    [key: string]: TraceKind & TraceMap
  }
}

export class ReferenceTracker {
  constructor(
    globalScope: eslint.Scope.Scope,
    options?: {
      mode?: 'legacy' | 'strict'
      globalObjectNames?: ('global' | 'globalThis' | 'self' | 'window')[]
    }
  )

  iterateGlobalReferences(
    traceMap: TYPES.TraceMap
  ): IterableIterator<{
    node: VAST.ESNode
    path: string[]
    type: symbol
    info: any
  }>
  iterateCjsReferences(
    traceMap: TYPES.TraceMap
  ): IterableIterator<{
    node: VAST.ESNode
    path: string[]
    type: symbol
    info: any
  }>
  iterateEsmReferences(
    traceMap: TYPES.TraceMap
  ): IterableIterator<{
    node: VAST.ESNode
    path: string[]
    type: symbol
    info: any
  }>
}

export namespace ReferenceTracker {
  const READ: unique symbol
  const CALL: unique symbol
  const CONSTRUCT: unique symbol
  const ESM: unique symbol
}

export function isArrowToken(token: Token): boolean
export function isCommaToken(token: Token): boolean
export function isSemicolonToken(token: Token): boolean
export function isColonToken(token: Token): boolean
export function isOpeningParenToken(token: Token): boolean
export function isClosingParenToken(token: Token): boolean
export function isOpeningBracketToken(token: Token): boolean
export function isClosingBracketToken(token: Token): boolean
export function isOpeningBraceToken(token: Token): boolean
export function isClosingBraceToken(token: Token): boolean
export function isCommentToken(token: Token): token is Comment
export function isNotArrowToken(token: Token): boolean
export function isNotCommaToken(token: Token): boolean
export function isNotSemicolonToken(token: Token): boolean
export function isNotColonToken(token: Token): boolean
export function isNotOpeningParenToken(token: Token): boolean
export function isNotClosingParenToken(token: Token): boolean
export function isNotOpeningBracketToken(token: Token): boolean
export function isNotClosingBracketToken(token: Token): boolean
export function isNotOpeningBraceToken(token: Token): boolean
export function isNotClosingBraceToken(token: Token): boolean
export function isNotCommentToken(token: Token): boolean
