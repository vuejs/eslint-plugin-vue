import {
  Rule as ESLintRule,
  RuleTester as ESLintRuleTester,
  Linter as ESLintLinter
} from '../../node_modules/@types/eslint'
import * as VAST from '../eslint-plugin-vue/util-types/ast'
import * as VNODE from '../eslint-plugin-vue/util-types/node'
import * as parserServices from '../eslint-plugin-vue/util-types/parser-services'

export namespace AST {
  type Token = VNODE.Token
  type Range = VNODE.Range
  type SourceLocation = VNODE.SourceLocation
  type Program = VAST.Program
}
export namespace Scope {
  interface ScopeManager {
    scopes: Scope[]
    globalScope: Scope | null
    acquire(node: VAST.ESNode | VAST.Program, inner?: boolean): Scope | null
    getDeclaredVariables(node: VAST.ESNode): Variable[]
  }
  interface Scope {
    type:
      | 'block'
      | 'catch'
      | 'class'
      | 'for'
      | 'function'
      | 'function-expression-name'
      | 'global'
      | 'module'
      | 'switch'
      | 'with'
      | 'TDZ'
    isStrict: boolean
    upper: Scope | null
    childScopes: Scope[]
    variableScope: Scope
    block: VAST.ESNode
    variables: Variable[]
    set: Map<string, Variable>
    references: Reference[]
    through: Reference[]
    functionExpressionScope: boolean
  }
  interface Variable {
    name: string
    identifiers: VAST.Identifier[]
    references: Reference[]
    defs: Definition[]
  }
  interface Reference {
    identifier: VAST.Identifier
    from: Scope
    resolved: Variable | null
    writeExpr: VAST.ESNode | null
    init: boolean
    isWrite(): boolean
    isRead(): boolean
    isWriteOnly(): boolean
    isReadOnly(): boolean
    isReadWrite(): boolean
  }
  type DefinitionType =
    | { type: 'CatchClause'; node: VAST.CatchClause; parent: null }
    | {
        type: 'ClassName'
        node: VAST.ClassDeclaration | VAST.ClassExpression
        parent: null
      }
    | {
        type: 'FunctionName'
        node: VAST.FunctionDeclaration | VAST.FunctionExpression
        parent: null
      }
    | { type: 'ImplicitGlobalVariable'; node: VAST.Program; parent: null }
    | {
        type: 'ImportBinding'
        node:
          | VAST.ImportSpecifier
          | VAST.ImportDefaultSpecifier
          | VAST.ImportNamespaceSpecifier
        parent: VAST.ImportDeclaration
      }
    | {
        type: 'Parameter'
        node:
          | VAST.FunctionDeclaration
          | VAST.FunctionExpression
          | VAST.ArrowFunctionExpression
        parent: null
      }
    | { type: 'TDZ'; node: any; parent: null }
    | {
        type: 'Variable'
        node: VAST.VariableDeclarator
        parent: VAST.VariableDeclaration
      }
  type Definition = DefinitionType & { name: VAST.Identifier }
}

export class SourceCode /*extends ESLintSourceCode*/ {
  text: string
  ast: AST.Program
  lines: string[]
  hasBOM: boolean
  parserServices: SourceCode.ParserServices
  scopeManager: Scope.ScopeManager
  visitorKeys: SourceCode.VisitorKeys

  static splitLines(text: string): string[]

  getText(
    node?: VNODE.HasLocation,
    beforeCount?: number,
    afterCount?: number
  ): string
  getLines(): string[]
  getAllComments(): VNODE.Comment[]
  getComments(
    node: VAST.ESNode
  ): { leading: VNODE.Comment[]; trailing: VNODE.Comment[] }
  getJSDocComment(node: VAST.ESNode): AST.Token | null
  getNodeByRangeIndex(index: number): VAST.ESNode | VAST.JSXNode
  isSpaceBetweenTokens(first: AST.Token, second: AST.Token): boolean
  getLocFromIndex(index: number): VNODE.Position
  getIndexFromLoc(location: VNODE.Position): number

  getTokenByRangeStart(
    offset: number,
    options?: { includeComments?: boolean }
  ): AST.Token | null
  getFirstToken(node: VNODE.HasLocation): AST.Token
  getFirstToken(node: VNODE.HasLocation, options: number): AST.Token
  getFirstToken(
    node: VNODE.HasLocation,
    options: SourceCode.CursorWithSkipOptions
  ): AST.Token | null
  getFirstTokens(
    node: VNODE.HasLocation,
    options?: SourceCode.CursorWithCountOptions
  ): AST.Token[]
  getLastToken(node: VNODE.HasLocation): AST.Token
  getLastToken(node: VNODE.HasLocation, options: number): AST.Token
  getLastToken(
    node: VNODE.HasLocation,
    optionss: SourceCode.CursorWithSkipOptions
  ): AST.Token | null
  getLastTokens(
    node: VNODE.HasLocation,
    options?: SourceCode.CursorWithCountOptions
  ): AST.Token[]
  getTokenBefore(node: VNODE.HasLocation): AST.Token
  getTokenBefore(node: VNODE.HasLocation, options: number): AST.Token
  getTokenBefore(
    node: VNODE.HasLocation,
    options: { includeComments: boolean }
  ): AST.Token
  getTokenBefore(
    node: VNODE.HasLocation,
    options?: SourceCode.CursorWithSkipOptions
  ): AST.Token | null
  getTokensBefore(
    node: VNODE.HasLocation,
    options?: SourceCode.CursorWithCountOptions
  ): AST.Token[]
  getTokenAfter(node: VNODE.HasLocation): AST.Token
  getTokenAfter(node: VNODE.HasLocation, options: number): AST.Token
  getTokenAfter(
    node: VNODE.HasLocation,
    options: { includeComments: boolean }
  ): AST.Token
  getTokenAfter(
    node: VNODE.HasLocation,
    options: SourceCode.CursorWithSkipOptions
  ): AST.Token | null
  getTokensAfter(
    node: VNODE.HasLocation,
    options?: SourceCode.CursorWithCountOptions
  ): AST.Token[]
  getFirstTokenBetween(
    left: VNODE.HasLocation,
    right: VNODE.HasLocation,
    options?: SourceCode.CursorWithSkipOptions
  ): AST.Token | null
  getFirstTokensBetween(
    left: VNODE.HasLocation,
    right: VNODE.HasLocation,
    options?: SourceCode.CursorWithCountOptions
  ): AST.Token[]
  getLastTokenBetween(
    left: VNODE.HasLocation,
    right: VNODE.HasLocation,
    options?: SourceCode.CursorWithSkipOptions
  ): AST.Token | null
  getLastTokensBetween(
    left: VNODE.HasLocation,
    right: VNODE.HasLocation,
    options?: SourceCode.CursorWithCountOptions
  ): AST.Token[]
  getTokensBetween(
    left: VNODE.HasLocation,
    right: VNODE.HasLocation,
    padding?:
      | number
      | SourceCode.FilterPredicate
      | SourceCode.CursorWithCountOptions
  ): AST.Token[]
  getTokens(
    node: VNODE.HasLocation,
    beforeCount?: number,
    afterCount?: number
  ): AST.Token[]
  getTokens(
    node: VNODE.HasLocation,
    options: SourceCode.FilterPredicate | SourceCode.CursorWithCountOptions
  ): AST.Token[]
  commentsExistBetween(
    left: VNODE.HasLocation,
    right: VNODE.HasLocation
  ): boolean
  getCommentsBefore(nodeOrToken: VNODE.HasLocation): VNODE.Comment[]
  getCommentsAfter(nodeOrToken: VNODE.HasLocation): VNODE.Comment[]
  getCommentsInside(node: VNODE.HasLocation): VNODE.Comment[]
}
export namespace SourceCode {
  interface Config {
    text: string
    ast: AST.Program
    parserServices?: ParserServices
    scopeManager?: Scope.ScopeManager
    visitorKeys?: VisitorKeys
  }

  type ParserServices = parserServices.ParserServices

  interface VisitorKeys {
    [nodeType: string]: string[]
  }

  type FilterPredicate = (tokenOrComment: AST.Token) => boolean

  type CursorWithSkipOptions =
    | number
    | FilterPredicate
    | {
        includeComments?: boolean
        filter?: FilterPredicate
        skip?: number
      }

  type CursorWithCountOptions =
    | number
    | FilterPredicate
    | {
        includeComments?: boolean
        filter?: FilterPredicate
        count?: number
      }
}

export namespace Rule {
  interface RuleModule /*extends ESLintRule.RuleModule*/ {
    meta: RuleMetaData
    create(context: RuleContext): Rule.RuleListener
  }

  type NodeTypes = VAST.ESNode['type']

  type NodeListenerBase = {
    [T in keyof VAST.NodeListenerMap]?: (node: VAST.NodeListenerMap[T]) => void
  }
  interface NodeListener extends NodeListenerBase {
    [key: string]: ((node: VAST.ParamNode) => void) | undefined
  }

  interface RuleListener extends NodeListenerBase {
    onCodePathStart?(codePath: CodePath, node: VAST.ParamNode): void
    onCodePathEnd?(codePath: CodePath, node: VAST.ParamNode): void
    onCodePathSegmentStart?(
      segment: CodePathSegment,
      node: VAST.ParamNode
    ): void
    onCodePathSegmentEnd?(segment: CodePathSegment, node: VAST.ParamNode): void
    onCodePathSegmentLoop?(
      fromSegment: CodePathSegment,
      toSegment: CodePathSegment,
      node: VAST.ParamNode
    ): void
    [key: string]:
      | ((codePath: CodePath, node: VAST.ParamNode) => void)
      | ((segment: CodePathSegment, node: VAST.ParamNode) => void)
      | ((
          fromSegment: CodePathSegment,
          toSegment: CodePathSegment,
          node: VAST.ParamNode
        ) => void)
      | ((node: VAST.ParamNode) => void)
      | undefined
  }
  interface CodePath extends ESLintRule.CodePath {}
  interface CodePathSegment extends ESLintRule.CodePathSegment {}

  interface RuleMetaData extends ESLintRule.RuleMetaData {
    docs: Required<ESLintRule.RuleMetaData>['docs']
  }

  interface RuleContext {
    id: string
    options: ESLintRule.RuleContext['options']
    settings: { [name: string]: any }
    parserPath: string
    parserOptions: any
    parserServices: parserServices.ParserServices

    getAncestors(): VAST.ESNode[]

    getDeclaredVariables(node: VAST.ESNode): Scope.Variable[]
    getFilename(): string
    getScope(): Scope.Scope
    getSourceCode(): SourceCode
    markVariableAsUsed(name: string): boolean
    report(descriptor: ReportDescriptor): void
  }

  type ReportDescriptor =
    | ReportDescriptor1
    | ReportDescriptor2
    | ReportDescriptor3
    | ReportDescriptor4

  type SuggestionReportDescriptor =
    | SuggestionReportDescriptor1
    | SuggestionReportDescriptor2

  interface RuleFixer {
    insertTextAfter(nodeOrToken: VNODE.HasLocation, text: string): Fix
    insertTextAfterRange(range: AST.Range, text: string): Fix
    insertTextBefore(nodeOrToken: VNODE.HasLocation, text: string): Fix
    insertTextBeforeRange(range: AST.Range, text: string): Fix
    remove(nodeOrToken: VNODE.HasLocation): Fix
    removeRange(range: AST.Range): Fix
    replaceText(nodeOrToken: VNODE.HasLocation, text: string): Fix
    replaceTextRange(range: AST.Range, text: string): Fix
  }

  interface Fix {
    range: AST.Range
    text: string
  }
}

export class RuleTester extends ESLintRuleTester {}

export namespace Linter {
  type LintMessage = ESLintLinter.LintMessage
  type LintOptions = ESLintLinter.LintOptions
}

interface ReportDescriptorOptionsBase {
  data?: {
    [key: string]: string | number
  }
  fix?:
    | null
    | ((
        fixer: Rule.RuleFixer
      ) => null | Rule.Fix | IterableIterator<Rule.Fix> | Rule.Fix[])
}

interface SuggestionReportDescriptor1 extends ReportDescriptorOptionsBase {
  desc: string
}

interface SuggestionReportDescriptor2 extends ReportDescriptorOptionsBase {
  messageId: string
}
interface ReportDescriptorOptions extends ReportDescriptorOptionsBase {
  suggest?: Rule.SuggestionReportDescriptor[] | null
}

interface ReportSourceLocation1 {
  start: VNODE.Position
  end: VNODE.Position
  line?: undefined
  column?: undefined
}

interface ReportSourceLocation2 extends VNODE.Position {
  start?: undefined
  end?: undefined
}

type ReportSourceLocation = ReportSourceLocation1 | ReportSourceLocation2

interface ReportDescriptor1 extends ReportDescriptorOptions {
  message: string
  messageId?: string
  node: VNODE.HasLocation
  loc?: ReportSourceLocation
}
interface ReportDescriptor2 extends ReportDescriptorOptions {
  message: string
  messageId?: string
  node?: VNODE.HasLocation
  loc: ReportSourceLocation
}
interface ReportDescriptor3 extends ReportDescriptorOptions {
  message?: string
  messageId: string
  node: VNODE.HasLocation
  loc?: ReportSourceLocation
}
interface ReportDescriptor4 extends ReportDescriptorOptions {
  message?: string
  messageId: string
  node?: VNODE.HasLocation
  loc: ReportSourceLocation
}
