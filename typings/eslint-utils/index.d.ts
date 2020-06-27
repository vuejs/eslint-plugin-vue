import * as VAST from '../eslint-plugin-vue/util-types/ast'
import { ParserServices } from '../eslint-plugin-vue/util-types/parser-services'
import eslint from 'eslint'

export function findVariable(
  initialScope: eslint.Scope.Scope,
  nameOrNode: VAST.Identifier | string
): eslint.Scope.Variable

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
