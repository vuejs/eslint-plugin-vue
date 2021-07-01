import * as VNODE from './node'
import * as VAST from './ast'
import * as eslint from 'eslint'

type TemplateListenerBase = {
  [T in keyof VAST.VNodeListenerMap]?: (node: VAST.VNodeListenerMap[T]) => void
}
export interface TemplateListener
  extends TemplateListenerBase,
    eslint.Rule.NodeListener {
  [key: string]: ((node: VAST.ParamNode) => void) | undefined
}

export interface ParserServices {
  getTemplateBodyTokenStore: () => ParserServices.TokenStore
  defineTemplateBodyVisitor?: (
    templateBodyVisitor: TemplateListener,
    scriptVisitor?: eslint.Rule.RuleListener,
    options?: {
      templateBodyTriggerSelector: 'Program' | 'Program:exit'
    }
  ) => eslint.Rule.RuleListener
  getDocumentFragment?: () => VAST.VDocumentFragment | null
}
export namespace ParserServices {
  export interface TokenStore {
    getTokenByRangeStart(
      offset: number,
      options?: { includeComments: boolean }
    ): VNODE.Token | null
    getFirstToken(node: VNODE.HasLocation): VNODE.Token
    getFirstToken(node: VNODE.HasLocation, options: number): VNODE.Token
    getFirstToken(
      node: VNODE.HasLocation,
      options: eslint.SourceCode.CursorWithSkipOptions
    ): VNODE.Token | null
    getLastToken(node: VNODE.HasLocation): VNODE.Token
    getLastToken(node: VNODE.HasLocation, options: number): VNODE.Token
    getLastToken(
      node: VNODE.HasLocation,
      options: eslint.SourceCode.CursorWithSkipOptions
    ): VNODE.Token | null
    getTokenBefore(node: VNODE.HasLocation): VNODE.Token
    getTokenBefore(node: VNODE.HasLocation, options: number): VNODE.Token
    getTokenBefore(
      node: VNODE.HasLocation,
      options: { includeComments: boolean }
    ): VNODE.Token
    getTokenBefore(
      node: VNODE.HasLocation,
      options: eslint.SourceCode.CursorWithSkipOptions
    ): VNODE.Token | null
    getTokenAfter(node: VNODE.HasLocation): VNODE.Token
    getTokenAfter(node: VNODE.HasLocation, options: number): VNODE.Token
    getTokenAfter(
      node: VNODE.HasLocation,
      options: { includeComments: boolean }
    ): VNODE.Token
    getTokenAfter(
      node: VNODE.HasLocation,
      options: eslint.SourceCode.CursorWithSkipOptions
    ): VNODE.Token | null
    getFirstTokenBetween(
      left: VNODE.HasLocation,
      right: VNODE.HasLocation,
      options?: eslint.SourceCode.CursorWithSkipOptions
    ): VNODE.Token | null
    getLastTokenBetween(
      left: VNODE.HasLocation,
      right: VNODE.HasLocation,
      options?: eslint.SourceCode.CursorWithSkipOptions
    ): VNODE.Token | null
    getTokenOrCommentBefore(
      node: VNODE.HasLocation,
      skip?: number
    ): VNODE.Token | null
    getTokenOrCommentAfter(
      node: VNODE.HasLocation,
      skip?: number
    ): VNODE.Token | null
    getFirstTokens(
      node: VNODE.HasLocation,
      options?: eslint.SourceCode.CursorWithCountOptions
    ): VNODE.Token[]
    getLastTokens(
      node: VNODE.HasLocation,
      options?: eslint.SourceCode.CursorWithCountOptions
    ): VNODE.Token[]
    getTokensBefore(
      node: VNODE.HasLocation,
      options?: eslint.SourceCode.CursorWithCountOptions
    ): VNODE.Token[]
    getTokensAfter(
      node: VNODE.HasLocation,
      options?: eslint.SourceCode.CursorWithCountOptions
    ): VNODE.Token[]
    getFirstTokensBetween(
      left: VNODE.HasLocation,
      right: VNODE.HasLocation,
      options?: eslint.SourceCode.CursorWithCountOptions
    ): VNODE.Token[]
    getLastTokensBetween(
      left: VNODE.HasLocation,
      right: VNODE.HasLocation,
      options?: eslint.SourceCode.CursorWithCountOptions
    ): VNODE.Token[]
    getTokens(
      node: VNODE.HasLocation,
      beforeCount?: eslint.SourceCode.CursorWithCountOptions,
      afterCount?: number
    ): VNODE.Token[]
    getTokensBetween(
      left: VNODE.HasLocation,
      right: VNODE.HasLocation,
      padding?: eslint.SourceCode.CursorWithCountOptions
    ): VNODE.Token[]
    commentsExistBetween(
      left: VNODE.HasLocation,
      right: VNODE.HasLocation
    ): boolean
    getCommentsBefore(nodeOrToken: VNODE.HasLocation): VNODE.Token[]
    getCommentsAfter(nodeOrToken: VNODE.HasLocation): VNODE.Token[]
    getCommentsInside(node: VNODE.HasLocation): VNODE.Token[]
  }
}
