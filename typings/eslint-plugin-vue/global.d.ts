import * as VAST from './util-types/ast'
import * as VNODE from './util-types/node'
import * as parserServices from './util-types/parser-services'
import * as eslint from 'eslint'

declare global {
  // **** Rule Helpers ****
  type RuleModule = eslint.Rule.RuleModule
  type RuleContext = eslint.Rule.RuleContext
  namespace Rule {
    type ReportDescriptor = eslint.Rule.ReportDescriptor
    type SuggestionReportDescriptor = eslint.Rule.SuggestionReportDescriptor
  }
  type SourceCode = eslint.SourceCode
  namespace SourceCode {
    type CursorWithSkipOptions = eslint.SourceCode.CursorWithSkipOptions
    type CursorWithCountOptions = eslint.SourceCode.CursorWithCountOptions
  }
  type RuleFixer = eslint.Rule.RuleFixer
  type Fix = eslint.Rule.Fix

  type NodeListener = eslint.Rule.NodeListener
  type RuleListener = eslint.Rule.RuleListener
  type TemplateListener = parserServices.TemplateListener
  type ParserServices = parserServices.ParserServices
  namespace ParserServices {
    type TokenStore = parserServices.ParserServices.TokenStore
  }

  // **** Node data ****

  type Range = VNODE.Range
  type Position = VNODE.Position
  type SourceLocation = VNODE.SourceLocation
  type Token = VNODE.Token
  type Comment = VNODE.Comment
  type HTMLComment = VNODE.HTMLComment
  type HTMLBogusComment = VNODE.HTMLBogusComment

  type NodeListenerMap = VAST.NodeListenerMap
  type VNodeListenerMap = VAST.VNodeListenerMap

  // **** AST nodes ****

  type ASTNode = VAST.ASTNode
  type ESNode = VAST.ESNode
  type VNode = VAST.VNode
  type TSNode = VAST.TSNode
  type JSXNode = VAST.JSXNode

  // ---- Vue Template Nodes ----

  type VAttribute = VAST.VAttribute
  type VDirective = VAST.VDirective
  type VDirectiveKey = VAST.VDirectiveKey
  type VDocumentFragment = VAST.VDocumentFragment
  type VElement = VAST.VElement
  type VRootElement = VAST.VRootElement
  type VEndTag = VAST.VEndTag
  type VExpressionContainer = VAST.VExpressionContainer
  type VIdentifier = VAST.VIdentifier
  type VLiteral = VAST.VLiteral
  type VStartTag = VAST.VStartTag
  type VText = VAST.VText
  type VForExpression = VAST.VForExpression
  type VOnExpression = VAST.VOnExpression
  type VSlotScopeExpression = VAST.VSlotScopeExpression
  type VFilterSequenceExpression = VAST.VFilterSequenceExpression
  type VFilter = VAST.VFilter

  // ---- ES Nodes ----

  type Identifier = VAST.Identifier
  type Literal = VAST.Literal
  type Program = VAST.Program
  type SwitchCase = VAST.SwitchCase
  type CatchClause = VAST.CatchClause
  type VariableDeclarator = VAST.VariableDeclarator
  type Statement = VAST.Statement
  type ExpressionStatement = VAST.ExpressionStatement
  type BlockStatement = VAST.BlockStatement
  type EmptyStatement = VAST.EmptyStatement
  type DebuggerStatement = VAST.DebuggerStatement
  type WithStatement = VAST.WithStatement
  type ReturnStatement = VAST.ReturnStatement
  type LabeledStatement = VAST.LabeledStatement
  type BreakStatement = VAST.BreakStatement
  type ContinueStatement = VAST.ContinueStatement
  type IfStatement = VAST.IfStatement
  type SwitchStatement = VAST.SwitchStatement
  type ThrowStatement = VAST.ThrowStatement
  type TryStatement = VAST.TryStatement
  type WhileStatement = VAST.WhileStatement
  type DoWhileStatement = VAST.DoWhileStatement
  type ForStatement = VAST.ForStatement
  type ForInStatement = VAST.ForInStatement
  type ForOfStatement = VAST.ForOfStatement
  type Declaration = VAST.Declaration
  type FunctionDeclaration = VAST.FunctionDeclaration
  type VariableDeclaration = VAST.VariableDeclaration
  type ClassDeclaration = VAST.ClassDeclaration
  type Expression = VAST.Expression
  type ThisExpression = VAST.ThisExpression
  type ArrayExpression = VAST.ArrayExpression
  type ObjectExpression = VAST.ObjectExpression
  type FunctionExpression = VAST.FunctionExpression
  type ArrowFunctionExpression = VAST.ArrowFunctionExpression
  type YieldExpression = VAST.YieldExpression
  type UnaryExpression = VAST.UnaryExpression
  type UpdateExpression = VAST.UpdateExpression
  type BinaryExpression = VAST.BinaryExpression
  type AssignmentExpression = VAST.AssignmentExpression
  type LogicalExpression = VAST.LogicalExpression
  type MemberExpression = VAST.MemberExpression
  type ConditionalExpression = VAST.ConditionalExpression
  type CallExpression = VAST.CallExpression
  type NewExpression = VAST.NewExpression
  type SequenceExpression = VAST.SequenceExpression
  type TemplateLiteral = VAST.TemplateLiteral
  type TaggedTemplateExpression = VAST.TaggedTemplateExpression
  type ClassExpression = VAST.ClassExpression
  type MetaProperty = VAST.MetaProperty
  type AwaitExpression = VAST.AwaitExpression
  type ChainExpression = VAST.ChainExpression
  type ChainElement = VAST.ChainElement
  type Property = VAST.Property
  type AssignmentProperty = VAST.AssignmentProperty
  type Super = VAST.Super
  type TemplateElement = VAST.TemplateElement
  type SpreadElement = VAST.SpreadElement
  type Pattern = VAST.Pattern
  type ObjectPattern = VAST.ObjectPattern
  type ArrayPattern = VAST.ArrayPattern
  type RestElement = VAST.RestElement
  type AssignmentPattern = VAST.AssignmentPattern
  type ClassBody = VAST.ClassBody
  type MethodDefinition = VAST.MethodDefinition
  type ModuleDeclaration = VAST.ModuleDeclaration
  type ImportDeclaration = VAST.ImportDeclaration
  type ExportNamedDeclaration = VAST.ExportNamedDeclaration
  type ExportDefaultDeclaration = VAST.ExportDefaultDeclaration
  type ExportAllDeclaration = VAST.ExportAllDeclaration
  type ModuleSpecifier = VAST.ModuleSpecifier
  type ImportSpecifier = VAST.ImportSpecifier
  type ImportDefaultSpecifier = VAST.ImportDefaultSpecifier
  type ImportNamespaceSpecifier = VAST.ImportNamespaceSpecifier
  type ExportSpecifier = VAST.ExportSpecifier
  type ImportExpression = VAST.ImportExpression

  // ---- TS Nodes ----

  type TSAsExpression = VAST.TSAsExpression

  // ---- JSX Nodes ----

  type JSXAttribute = VAST.JSXAttribute
  type JSXClosingElement = VAST.JSXClosingElement
  type JSXClosingFragment = VAST.JSXClosingFragment
  type JSXElement = VAST.JSXElement
  type JSXEmptyExpression = VAST.JSXEmptyExpression
  type JSXExpressionContainer = VAST.JSXExpressionContainer
  type JSXFragment = VAST.JSXFragment
  type JSXIdentifier = VAST.JSXIdentifier
  type JSXOpeningElement = VAST.JSXOpeningElement
  type JSXOpeningFragment = VAST.JSXOpeningFragment
  type JSXSpreadAttribute = VAST.JSXSpreadAttribute
  type JSXSpreadChild = VAST.JSXSpreadChild
  type JSXMemberExpression = VAST.JSXMemberExpression
  type JSXText = VAST.JSXText

  // **** Variables ****

  type VVariable = VAST.VVariable
  type VReference = VAST.VReference

  type Variable = eslint.Scope.Variable
  type Reference = eslint.Scope.Reference
}
