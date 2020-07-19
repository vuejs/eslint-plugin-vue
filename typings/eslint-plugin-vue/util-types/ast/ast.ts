import * as ES from './es-ast'
import * as V from './v-ast'
import * as TS from './ts-ast'
import * as JSX from './jsx-ast'

export type ASTNode = ES.ESNode | V.VNode | TS.TSNode | JSX.JSXNode

export type ParamNode = never // You specify the node type in JSDoc.

export type VNodeListenerMap = {
  VAttribute: V.VAttribute | V.VDirective
  'VAttribute:exit': V.VAttribute | V.VDirective
  'VAttribute[directive=false]': V.VAttribute
  'VAttribute[directive=false]:exit': V.VAttribute
  "VAttribute[directive=true][key.name.name='bind']": V.VDirective & {
    value:
      | (V.VExpressionContainer & {
          expression: ES.Expression | V.VFilterSequenceExpression | null
        })
      | null
  }
  "VAttribute[directive=true][key.name.name='bind']:exit": V.VDirective & {
    value:
      | (V.VExpressionContainer & {
          expression: ES.Expression | V.VFilterSequenceExpression | null
        })
      | null
  }
  "VAttribute[directive=true][key.name.name='cloak']": V.VDirective
  "VAttribute[directive=true][key.name.name='cloak']:exit": V.VDirective
  "VAttribute[directive=true][key.name.name='else-if']": V.VDirective & {
    value:
      | (V.VExpressionContainer & { expression: ES.Expression | null })
      | null
  }
  "VAttribute[directive=true][key.name.name='else-if']:exit": V.VDirective & {
    value:
      | (V.VExpressionContainer & { expression: ES.Expression | null })
      | null
  }
  "VAttribute[directive=true][key.name.name='else']": V.VDirective
  "VAttribute[directive=true][key.name.name='else']:exit": V.VDirective
  "VAttribute[directive=true][key.name.name='for']": V.VDirective & {
    value:
      | (V.VExpressionContainer & { expression: V.VForExpression | null })
      | null
  }
  "VAttribute[directive=true][key.name.name='for']:exit": V.VDirective & {
    value:
      | (V.VExpressionContainer & { expression: V.VForExpression | null })
      | null
  }
  "VAttribute[directive=true][key.name.name='html']": V.VDirective
  "VAttribute[directive=true][key.name.name='html']:exit": V.VDirective
  "VAttribute[directive=true][key.name.name='if']": V.VDirective & {
    value:
      | (V.VExpressionContainer & { expression: ES.Expression | null })
      | null
  }
  "VAttribute[directive=true][key.name.name='if']:exit": V.VDirective & {
    value:
      | (V.VExpressionContainer & { expression: ES.Expression | null })
      | null
  }
  "VAttribute[directive=true][key.name.name='is']": V.VDirective
  "VAttribute[directive=true][key.name.name='is']:exit": V.VDirective
  "VAttribute[directive=true][key.name.name='model']": V.VDirective & {
    value:
      | (V.VExpressionContainer & { expression: ES.Expression | null })
      | null
  }
  "VAttribute[directive=true][key.name.name='model']:exit": V.VDirective & {
    value:
      | (V.VExpressionContainer & { expression: ES.Expression | null })
      | null
  }
  "VAttribute[directive=true][key.name.name='on']": V.VDirective & {
    value:
      | (V.VExpressionContainer & {
          expression: ES.Expression | V.VOnExpression | null
        })
      | null
  }
  "VAttribute[directive=true][key.name.name='on']:exit": V.VDirective & {
    value:
      | (V.VExpressionContainer & {
          expression: ES.Expression | V.VOnExpression | null
        })
      | null
  }
  "VAttribute[directive=true][key.name.name='once']": V.VDirective
  "VAttribute[directive=true][key.name.name='once']:exit": V.VDirective
  "VAttribute[directive=true][key.name.name='pre']": V.VDirective
  "VAttribute[directive=true][key.name.name='pre']:exit": V.VDirective
  "VAttribute[directive=true][key.name.name='show']": V.VDirective & {
    value:
      | (V.VExpressionContainer & { expression: ES.Expression | null })
      | null
  }
  "VAttribute[directive=true][key.name.name='show']:exit": V.VDirective & {
    value:
      | (V.VExpressionContainer & { expression: ES.Expression | null })
      | null
  }
  "VAttribute[directive=true][key.name.name='slot']": V.VDirective & {
    value:
      | (V.VExpressionContainer & { expression: V.VSlotScopeExpression | null })
      | null
  }
  "VAttribute[directive=true][key.name.name='slot']:exit": V.VDirective & {
    value:
      | (V.VExpressionContainer & { expression: V.VSlotScopeExpression | null })
      | null
  }
  "VAttribute[directive=true][key.name.name='text']": V.VDirective
  "VAttribute[directive=true][key.name.name='text']:exit": V.VDirective
  'VAttribute[value!=null]':
    | (V.VAttribute & { value: VLiteral })
    | (V.VDirective & { value: VExpressionContainer })
  // VDirective: V.VDirective
  // 'VDirective:exit': V.VDirective
  VDirectiveKey: V.VDirectiveKey
  'VDirectiveKey:exit': V.VDirectiveKey
  VElement: V.VElement
  'VElement:exit': V.VElement
  VEndTag: V.VEndTag
  'VEndTag:exit': V.VEndTag
  VExpressionContainer: V.VExpressionContainer
  'VExpressionContainer:exit': V.VExpressionContainer
  VIdentifier: V.VIdentifier
  'VIdentifier:exit': V.VIdentifier
  VLiteral: V.VLiteral
  'VLiteral:exit': V.VLiteral
  VStartTag: V.VStartTag
  'VStartTag:exit': V.VStartTag
  VText: V.VText
  'VText:exit': V.VText
  VForExpression: V.VForExpression
  'VForExpression:exit': V.VForExpression
  VOnExpression: V.VOnExpression
  'VOnExpression:exit': V.VOnExpression
  VSlotScopeExpression: V.VSlotScopeExpression
  'VSlotScopeExpression:exit': V.VSlotScopeExpression
  VFilterSequenceExpression: V.VFilterSequenceExpression
  'VFilterSequenceExpression:exit': V.VFilterSequenceExpression
  VFilter: V.VFilter
  'VFilter:exit': V.VFilter
} & ESNodeListenerMap
export type NodeListenerMap = {
  JSXAttribute: JSX.JSXAttribute
  'JSXAttribute:exit': JSX.JSXAttribute
  JSXClosingElement: JSX.JSXClosingElement
  'JSXClosingElement:exit': JSX.JSXClosingElement
  JSXClosingFragment: JSX.JSXClosingFragment
  'JSXClosingFragment:exit': JSX.JSXClosingFragment
  JSXElement: JSX.JSXElement
  'JSXElement:exit': JSX.JSXElement
  JSXEmptyExpression: JSX.JSXEmptyExpression
  'JSXEmptyExpression:exit': JSX.JSXEmptyExpression
  JSXExpressionContainer: JSX.JSXExpressionContainer
  'JSXExpressionContainer:exit': JSX.JSXExpressionContainer
  JSXFragment: JSX.JSXFragment
  'JSXFragment:exit': JSX.JSXFragment
  JSXIdentifier: JSX.JSXIdentifier
  'JSXIdentifier:exit': JSX.JSXIdentifier
  JSXOpeningElement: JSX.JSXOpeningElement
  'JSXOpeningElement:exit': JSX.JSXOpeningElement
  JSXOpeningFragment: JSX.JSXOpeningFragment
  'JSXOpeningFragment:exit': JSX.JSXOpeningFragment
  JSXSpreadAttribute: JSX.JSXSpreadAttribute
  'JSXSpreadAttribute:exit': JSX.JSXSpreadAttribute
  JSXSpreadChild: JSX.JSXSpreadChild
  'JSXSpreadChild:exit': JSX.JSXSpreadChild
  JSXMemberExpression: JSX.JSXMemberExpression
  'JSXMemberExpression:exit': JSX.JSXMemberExpression
  JSXText: JSX.JSXText
  'JSXText:exit': JSX.JSXText
} & ESNodeListenerMap
export type ESNodeListenerMap = {
  Identifier: ES.Identifier
  'Identifier:exit': ES.Identifier
  Literal: ES.Literal
  'Literal:exit': ES.Literal
  Program: ES.Program
  'Program:exit': ES.Program
  SwitchCase: ES.SwitchCase
  'SwitchCase:exit': ES.SwitchCase
  CatchClause: ES.CatchClause
  'CatchClause:exit': ES.CatchClause
  VariableDeclarator: ES.VariableDeclarator
  'VariableDeclarator:exit': ES.VariableDeclarator
  ':statement': ES.Statement
  ':statement:exit': ES.Statement
  ExpressionStatement: ES.ExpressionStatement
  'ExpressionStatement:exit': ES.ExpressionStatement
  BlockStatement: ES.BlockStatement
  'BlockStatement:exit': ES.BlockStatement
  EmptyStatement: ES.EmptyStatement
  'EmptyStatement:exit': ES.EmptyStatement
  DebuggerStatement: ES.DebuggerStatement
  'DebuggerStatement:exit': ES.DebuggerStatement
  WithStatement: ES.WithStatement
  'WithStatement:exit': ES.WithStatement
  ReturnStatement: ES.ReturnStatement
  'ReturnStatement:exit': ES.ReturnStatement
  LabeledStatement: ES.LabeledStatement
  'LabeledStatement:exit': ES.LabeledStatement
  BreakStatement: ES.BreakStatement
  'BreakStatement:exit': ES.BreakStatement
  ContinueStatement: ES.ContinueStatement
  'ContinueStatement:exit': ES.ContinueStatement
  IfStatement: ES.IfStatement
  'IfStatement:exit': ES.IfStatement
  SwitchStatement: ES.SwitchStatement
  'SwitchStatement:exit': ES.SwitchStatement
  ThrowStatement: ES.ThrowStatement
  'ThrowStatement:exit': ES.ThrowStatement
  TryStatement: ES.TryStatement
  'TryStatement:exit': ES.TryStatement
  WhileStatement: ES.WhileStatement
  'WhileStatement:exit': ES.WhileStatement
  DoWhileStatement: ES.DoWhileStatement
  'DoWhileStatement:exit': ES.DoWhileStatement
  ForStatement: ES.ForStatement
  'ForStatement:exit': ES.ForStatement
  ForInStatement: ES.ForInStatement
  'ForInStatement:exit': ES.ForInStatement
  ForOfStatement: ES.ForOfStatement
  'ForOfStatement:exit': ES.ForOfStatement
  ':declaration': ES.Declaration
  ':declaration:exit': ES.Declaration
  FunctionDeclaration: ES.FunctionDeclaration
  'FunctionDeclaration:exit': ES.FunctionDeclaration
  VariableDeclaration: ES.VariableDeclaration
  'VariableDeclaration:exit': ES.VariableDeclaration
  ClassDeclaration: ES.ClassDeclaration
  'ClassDeclaration:exit': ES.ClassDeclaration
  ':expression': ES.Expression
  ':expression:exit': ES.Expression
  ThisExpression: ES.ThisExpression
  'ThisExpression:exit': ES.ThisExpression
  ArrayExpression: ES.ArrayExpression
  'ArrayExpression:exit': ES.ArrayExpression
  ObjectExpression: ES.ObjectExpression
  'ObjectExpression:exit': ES.ObjectExpression
  ':function':
    | ES.FunctionExpression
    | ES.ArrowFunctionExpression
    | ES.FunctionDeclaration
  ':function:exit':
    | ES.FunctionExpression
    | ES.ArrowFunctionExpression
    | ES.FunctionDeclaration
  FunctionExpression: ES.FunctionExpression
  'FunctionExpression:exit': ES.FunctionExpression
  ArrowFunctionExpression: ES.ArrowFunctionExpression
  'ArrowFunctionExpression:exit': ES.ArrowFunctionExpression
  YieldExpression: ES.YieldExpression
  'YieldExpression:exit': ES.YieldExpression
  UnaryExpression: ES.UnaryExpression
  'UnaryExpression:exit': ES.UnaryExpression
  UpdateExpression: ES.UpdateExpression
  'UpdateExpression:exit': ES.UpdateExpression
  BinaryExpression: ES.BinaryExpression
  'BinaryExpression:exit': ES.BinaryExpression
  AssignmentExpression: ES.AssignmentExpression
  'AssignmentExpression:exit': ES.AssignmentExpression
  LogicalExpression: ES.LogicalExpression
  'LogicalExpression:exit': ES.LogicalExpression
  MemberExpression: ES.MemberExpression
  'MemberExpression:exit': ES.MemberExpression
  ConditionalExpression: ES.ConditionalExpression
  'ConditionalExpression:exit': ES.ConditionalExpression
  CallExpression: ES.CallExpression
  'CallExpression:exit': ES.CallExpression
  NewExpression: ES.NewExpression
  'NewExpression:exit': ES.NewExpression
  SequenceExpression: ES.SequenceExpression
  'SequenceExpression:exit': ES.SequenceExpression
  TemplateLiteral: ES.TemplateLiteral
  'TemplateLiteral:exit': ES.TemplateLiteral
  TaggedTemplateExpression: ES.TaggedTemplateExpression
  'TaggedTemplateExpression:exit': ES.TaggedTemplateExpression
  ClassExpression: ES.ClassExpression
  'ClassExpression:exit': ES.ClassExpression
  MetaProperty: ES.MetaProperty
  'MetaProperty:exit': ES.MetaProperty
  AwaitExpression: ES.AwaitExpression
  'AwaitExpression:exit': ES.AwaitExpression
  Property: ES.Property | ES.AssignmentProperty
  'Property:exit': ES.Property | ES.AssignmentProperty
  'ObjectExpression>Property': ES.Property
  'ObjectExpression>Property:exit': ES.Property
  'ObjectExpression > Property': ES.Property
  'ObjectExpression > Property:exit': ES.Property
  'ObjectPattern>Property': ES.AssignmentProperty
  'ObjectPattern>Property:exit': ES.AssignmentProperty
  'ObjectPattern > Property': ES.AssignmentProperty
  'ObjectPattern > Property:exit': ES.AssignmentProperty
  Super: ES.Super
  'Super:exit': ES.Super
  TemplateElement: ES.TemplateElement
  'TemplateElement:exit': ES.TemplateElement
  SpreadElement: ES.SpreadElement
  'SpreadElement:exit': ES.SpreadElement
  ':pattern': ES.Pattern
  ':pattern:exit': ES.Pattern
  ObjectPattern: ES.ObjectPattern
  'ObjectPattern:exit': ES.ObjectPattern
  ArrayPattern: ES.ArrayPattern
  'ArrayPattern:exit': ES.ArrayPattern
  RestElement: ES.RestElement
  'RestElement:exit': ES.RestElement
  AssignmentPattern: ES.AssignmentPattern
  'AssignmentPattern:exit': ES.AssignmentPattern
  ClassBody: ES.ClassBody
  'ClassBody:exit': ES.ClassBody
  MethodDefinition: ES.MethodDefinition
  'MethodDefinition:exit': ES.MethodDefinition
  ImportDeclaration: ES.ImportDeclaration
  'ImportDeclaration:exit': ES.ImportDeclaration
  ExportNamedDeclaration: ES.ExportNamedDeclaration
  'ExportNamedDeclaration:exit': ES.ExportNamedDeclaration
  ExportDefaultDeclaration: ES.ExportDefaultDeclaration
  'ExportDefaultDeclaration:exit': ES.ExportDefaultDeclaration
  ExportAllDeclaration: ES.ExportAllDeclaration
  'ExportAllDeclaration:exit': ES.ExportAllDeclaration
  ImportSpecifier: ES.ImportSpecifier
  'ImportSpecifier:exit': ES.ImportSpecifier
  ImportDefaultSpecifier: ES.ImportDefaultSpecifier
  'ImportDefaultSpecifier:exit': ES.ImportDefaultSpecifier
  ImportNamespaceSpecifier: ES.ImportNamespaceSpecifier
  'ImportNamespaceSpecifier:exit': ES.ImportNamespaceSpecifier
  ExportSpecifier: ES.ExportSpecifier
  'ExportSpecifier:exit': ES.ExportSpecifier
  ImportExpression: ES.ImportExpression
  'ImportExpression:exit': ES.ImportExpression
  ChainExpression: ES.ChainExpression
  'ChainExpression:exit': ES.ChainExpression

  TSAsExpression: TS.TSAsExpression
  'TSAsExpression:exit': TS.TSAsExpression
}
