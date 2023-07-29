/**
 * @see https://github.com/estree/estree
 */
import { BaseNode, HasParentNode } from '../node'
import { Token } from '../node'
import { ParseError } from '../errors'
import * as V from './v-ast'
import * as TS from './ts-ast'
import * as JSX from './jsx-ast'

export type ESNode =
  | PrivateIdentifier
  | Identifier
  | Literal
  | Program
  | SwitchCase
  | CatchClause
  | VariableDeclarator
  | Statement
  | Expression
  | Property
  | AssignmentProperty
  | Super
  | TemplateElement
  | SpreadElement
  | Pattern
  | ClassBody
  | MethodDefinition
  | PropertyDefinition
  | StaticBlock
  | ModuleDeclaration
  | ModuleSpecifier

export interface Program extends BaseNode {
  type: 'Program'
  sourceType: 'script' | 'module'
  body: (Statement | ModuleDeclaration)[]
  templateBody?: V.VRootElement
  tokens: Token[]
  comments: Token[]
  errors: ParseError[]
  parent: null
}
export type Statement =
  | ExpressionStatement
  | BlockStatement
  | EmptyStatement
  | DebuggerStatement
  | WithStatement
  | ReturnStatement
  | LabeledStatement
  | BreakStatement
  | ContinueStatement
  | IfStatement
  | SwitchStatement
  | ThrowStatement
  | TryStatement
  | WhileStatement
  | DoWhileStatement
  | ForStatement
  | ForInStatement
  | ForOfStatement
  | Declaration
export interface EmptyStatement extends HasParentNode {
  type: 'EmptyStatement'
}
interface BaseBlock extends HasParentNode {
  body: Statement[]
}
export interface BlockStatement extends BaseBlock {
  type: 'BlockStatement'
}
export interface ExpressionStatement extends HasParentNode {
  type: 'ExpressionStatement'
  expression: Expression
}
export interface IfStatement extends HasParentNode {
  type: 'IfStatement'
  test: Expression
  consequent: Statement
  alternate: Statement | null
}
export interface SwitchStatement extends HasParentNode {
  type: 'SwitchStatement'
  discriminant: Expression
  cases: SwitchCase[]
}
export interface SwitchCase extends HasParentNode {
  type: 'SwitchCase'
  test: Expression | null
  consequent: Statement[]
}
export interface WhileStatement extends HasParentNode {
  type: 'WhileStatement'
  test: Expression
  body: Statement
}
export interface DoWhileStatement extends HasParentNode {
  type: 'DoWhileStatement'
  body: Statement
  test: Expression
}
export interface ForStatement extends HasParentNode {
  type: 'ForStatement'
  init: VariableDeclaration | Expression | null
  test: Expression | null
  update: Expression | null
  body: Statement
}
export interface ForInStatement extends HasParentNode {
  type: 'ForInStatement'
  left: VariableDeclaration | Pattern
  right: Expression
  body: Statement
}
export interface ForOfStatement extends HasParentNode {
  type: 'ForOfStatement'
  left: VariableDeclaration | Pattern
  right: Expression
  body: Statement
  await: boolean
}
export interface LabeledStatement extends HasParentNode {
  type: 'LabeledStatement'
  label: Identifier
  body: Statement
}
export interface BreakStatement extends HasParentNode {
  type: 'BreakStatement'
  label: Identifier | null
}
export interface ContinueStatement extends HasParentNode {
  type: 'ContinueStatement'
  label: Identifier | null
}
export interface ReturnStatement extends HasParentNode {
  type: 'ReturnStatement'
  argument: Expression | null
}
export interface ThrowStatement extends HasParentNode {
  type: 'ThrowStatement'
  argument: Expression
}
export interface TryStatement extends HasParentNode {
  type: 'TryStatement'
  block: BlockStatement
  handler: CatchClause | null
  finalizer: BlockStatement | null
}
export interface CatchClause extends HasParentNode {
  type: 'CatchClause'
  param: Pattern | null
  body: BlockStatement
}
export interface WithStatement extends HasParentNode {
  type: 'WithStatement'
  object: Expression
  body: Statement
}
export interface DebuggerStatement extends HasParentNode {
  type: 'DebuggerStatement'
}
export type Declaration =
  | FunctionDeclaration
  | VariableDeclaration
  | ClassDeclaration
export interface FunctionDeclaration extends HasParentNode {
  type: 'FunctionDeclaration'
  async: boolean
  generator: boolean
  id: Identifier | null
  params: _FunctionParameter[]
  body: BlockStatement
}
export interface VariableDeclaration extends HasParentNode {
  type: 'VariableDeclaration'
  kind: 'var' | 'let' | 'const'
  declarations: VariableDeclarator[]
}
export interface VariableDeclarator extends HasParentNode {
  type: 'VariableDeclarator'
  id: Pattern
  init: Expression | null
}
export interface ClassDeclaration extends HasParentNode {
  type: 'ClassDeclaration'
  id: Identifier | null
  superClass: Expression | null
  body: ClassBody
}
export interface ClassBody extends HasParentNode {
  type: 'ClassBody'
  body: (MethodDefinition | PropertyDefinition | StaticBlock)[]
}
interface BaseMethodDefinition extends HasParentNode {
  type: 'MethodDefinition'
  // computed: boolean
  static: boolean
  // key: Expression
  value: FunctionExpression
  parent: ClassBody
}
export interface MethodDefinitionNonComputedName extends BaseMethodDefinition {
  kind: 'constructor' | 'method' | 'get' | 'set'
  computed: false
  key: Identifier | Literal
}
export interface MethodDefinitionComputedName extends BaseMethodDefinition {
  kind: 'constructor' | 'method' | 'get' | 'set'
  computed: true
  key: Expression
}
export interface MethodDefinitionPrivate extends BaseMethodDefinition {
  kind: 'constructor'
  computed: false
  key: PrivateIdentifier
}
export type MethodDefinition =
  | MethodDefinitionNonComputedName
  | MethodDefinitionComputedName
  | MethodDefinitionPrivate
interface BasePropertyDefinition extends HasParentNode {
  type: 'PropertyDefinition'
  // key: Expression | PrivateIdentifier
  value: Expression | null
  // computed: boolean
  static: boolean
  parent: ClassBody
}
export interface PropertyDefinitionNonComputedName
  extends BasePropertyDefinition {
  computed: false
  key: Identifier | Literal
}
export interface PropertyDefinitionComputedName extends BasePropertyDefinition {
  computed: true
  key: Expression
}
export interface PropertyDefinitionPrivate extends BasePropertyDefinition {
  computed: false
  key: PrivateIdentifier
}
export type PropertyDefinition =
  | PropertyDefinitionNonComputedName
  | PropertyDefinitionComputedName
  | PropertyDefinitionPrivate

export interface StaticBlock extends BaseBlock {
  type: 'StaticBlock'
  parent: ClassBody
}

export type ModuleDeclaration =
  | ImportDeclaration
  | ExportNamedDeclaration
  | ExportDefaultDeclaration
  | ExportAllDeclaration
export type ModuleSpecifier =
  | ImportSpecifier
  | ImportDefaultSpecifier
  | ImportNamespaceSpecifier
  | ExportSpecifier
export interface ImportDeclaration extends HasParentNode {
  type: 'ImportDeclaration'
  specifiers: (
    | ImportSpecifier
    | ImportDefaultSpecifier
    | ImportNamespaceSpecifier
  )[]
  source: Literal & { value: string }
  importKind?: 'type' | 'value'
}
export interface ImportSpecifier extends HasParentNode {
  type: 'ImportSpecifier'
  imported: Identifier
  local: Identifier
  importKind?: 'type' | 'value'
}
export interface ImportDefaultSpecifier extends HasParentNode {
  type: 'ImportDefaultSpecifier'
  local: Identifier
}
export interface ImportNamespaceSpecifier extends HasParentNode {
  type: 'ImportNamespaceSpecifier'
  local: Identifier
}
export interface ExportNamedDeclaration extends HasParentNode {
  type: 'ExportNamedDeclaration'
  declaration?: Declaration | null
  specifiers: ExportSpecifier[]
  source?: (Literal & { value: string }) | null
}
export interface ExportSpecifier extends HasParentNode {
  type: 'ExportSpecifier'
  local: Identifier
  exported: Identifier
}
export interface ExportDefaultDeclaration extends HasParentNode {
  type: 'ExportDefaultDeclaration'
  declaration: Declaration | Expression
}
export interface ExportAllDeclaration extends HasParentNode {
  type: 'ExportAllDeclaration'
  source: Literal & { value: string }
  exported: Identifier | null
}
export interface ImportExpression extends HasParentNode {
  type: 'ImportExpression'
  source: Expression
}
export type Expression =
  | ThisExpression
  | ArrayExpression
  | ObjectExpression
  | FunctionExpression
  | ArrowFunctionExpression
  | YieldExpression
  | Literal
  | UnaryExpression
  | UpdateExpression
  | BinaryExpression
  | AssignmentExpression
  | LogicalExpression
  | MemberExpression
  | ConditionalExpression
  | CallExpression
  | NewExpression
  | SequenceExpression
  | TemplateLiteral
  | TaggedTemplateExpression
  | ClassExpression
  | MetaProperty
  | Identifier
  | AwaitExpression
  | ImportExpression
  | ChainExpression
  | JSX.JSXElement
  | JSX.JSXFragment
  | TS.TSAsExpression

export interface Identifier extends HasParentNode {
  type: 'Identifier'
  name: string

  // for typescript-eslint
  typeAnnotation?: any
}
export interface PrivateIdentifier extends HasParentNode {
  type: 'PrivateIdentifier'
  name: string
}
export interface Literal extends HasParentNode {
  type: 'Literal'
  value: string | boolean | null | number | RegExp | BigInt
  raw: string
  regex?: {
    pattern: string
    flags: string
  }
  bigint?: string
}
export interface ThisExpression extends HasParentNode {
  type: 'ThisExpression'
}
export interface ArrayExpression extends HasParentNode {
  type: 'ArrayExpression'
  elements: (Expression | SpreadElement | null)[]
}
export interface ObjectExpression extends HasParentNode {
  type: 'ObjectExpression'
  properties: (Property | SpreadElement)[]
}
interface BaseProperty extends HasParentNode {
  type: 'Property'
  kind: 'init' | 'get' | 'set'
  method: boolean
  shorthand: boolean
  // computed: boolean
  // key: Expression
  value: Expression
  parent: ObjectExpression
}
export interface PropertyNonComputedName extends BaseProperty {
  computed: false
  key: Identifier | Literal
}
export interface PropertyComputedName extends BaseProperty {
  computed: true
  key: Expression
}
export type Property = PropertyNonComputedName | PropertyComputedName
export interface FunctionExpression extends HasParentNode {
  type: 'FunctionExpression'
  async: boolean
  generator: boolean
  id: Identifier | null
  params: _FunctionParameter[]
  body: BlockStatement
}

interface ArrowFunctionExpressionHasBlock extends HasParentNode {
  type: 'ArrowFunctionExpression'
  async: boolean
  generator: boolean
  id: Identifier | null
  params: _FunctionParameter[]
  body: BlockStatement
  expression: false
}

interface ArrowFunctionExpressionNoBlock extends HasParentNode {
  type: 'ArrowFunctionExpression'
  async: boolean
  generator: boolean
  id: Identifier | null
  params: _FunctionParameter[]
  body: Expression
  expression: true
}

export type ArrowFunctionExpression =
  | ArrowFunctionExpressionNoBlock
  | ArrowFunctionExpressionHasBlock

export interface SequenceExpression extends HasParentNode {
  type: 'SequenceExpression'
  expressions: Expression[]
}
export type UnaryOperator = '-' | '+' | '!' | '~' | 'typeof' | 'void' | 'delete'
export interface UnaryExpression extends HasParentNode {
  type: 'UnaryExpression'
  operator: UnaryOperator
  prefix: boolean
  argument: Expression
}
export type BinaryOperator =
  | '=='
  | '!='
  | '==='
  | '!=='
  | '<'
  | '<='
  | '>'
  | '>='
  | '<<'
  | '>>'
  | '>>>'
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '|'
  | '^'
  | '&'
  | 'in'
  | 'instanceof'
  | '**'
interface BinaryExpressionWithoutIn extends HasParentNode {
  type: 'BinaryExpression'
  operator: Exclude<BinaryOperator, 'in'>
  left: Expression
  right: Expression
}
interface BinaryExpressionWithIn extends HasParentNode {
  type: 'BinaryExpression'
  operator: 'in'
  left: Expression | PrivateIdentifier
  right: Expression
}
export type BinaryExpression =
  | BinaryExpressionWithoutIn
  | BinaryExpressionWithIn
export type AssignmentOperator =
  | '='
  | '+='
  | '-='
  | '*='
  | '/='
  | '%='
  | '<<='
  | '>>='
  | '>>>='
  | '|='
  | '^='
  | '&='
  | '**='
  | '||='
  | '&&='
  | '??='
export interface AssignmentExpression extends HasParentNode {
  type: 'AssignmentExpression'
  operator: AssignmentOperator
  left: Pattern
  right: Expression
}
export type UpdateOperator = '++' | '--'
export interface UpdateExpression extends HasParentNode {
  type: 'UpdateExpression'
  operator: UpdateOperator
  argument: Expression
  prefix: boolean
}
export type LogicalOperator = '||' | '&&' | '??'
export interface LogicalExpression extends HasParentNode {
  type: 'LogicalExpression'
  operator: LogicalOperator
  left: Expression
  right: Expression
}
export interface ConditionalExpression extends HasParentNode {
  type: 'ConditionalExpression'
  test: Expression
  alternate: Expression
  consequent: Expression
}
export interface CallExpression extends HasParentNode {
  type: 'CallExpression'
  callee: Expression | Super
  arguments: (Expression | SpreadElement)[]
  optional: boolean
  typeParameters?: TS.TSTypeParameterInstantiation
}
export interface Super extends HasParentNode {
  type: 'Super'
}
export interface NewExpression extends HasParentNode {
  type: 'NewExpression'
  callee: Expression
  arguments: (Expression | SpreadElement)[]
  typeParameters?: TSTypeParameterInstantiation
}
interface BaseMemberExpression extends HasParentNode {
  type: 'MemberExpression'
  // computed: boolean
  // object: Expression | Super
  // property: Expression
  optional: boolean
}
export interface MemberExpressionNonComputedName extends BaseMemberExpression {
  computed: false
  object: Expression | Super
  property: Identifier
}
export interface MemberExpressionComputedName extends BaseMemberExpression {
  computed: true
  object: Expression | Super
  property: Expression
}
export interface MemberExpressionPrivate extends BaseMemberExpression {
  computed: false
  object: Expression
  property: PrivateIdentifier
}
export type MemberExpression =
  | MemberExpressionNonComputedName
  | MemberExpressionComputedName
  | MemberExpressionPrivate
export interface ChainExpression extends HasParentNode {
  type: 'ChainExpression'
  expression: ChainElement
}
export type ChainElement = CallExpression | MemberExpression
export interface YieldExpression extends HasParentNode {
  type: 'YieldExpression'
  delegate: boolean
  argument: Expression | null
}
export interface AwaitExpression extends HasParentNode {
  type: 'AwaitExpression'
  argument: Expression
}
export interface TemplateLiteral extends HasParentNode {
  type: 'TemplateLiteral'
  quasis: TemplateElement[]
  expressions: Expression[]
}
export interface TaggedTemplateExpression extends HasParentNode {
  type: 'TaggedTemplateExpression'
  tag: Expression
  quasi: TemplateLiteral
}
export interface TemplateElement extends HasParentNode {
  type: 'TemplateElement'
  tail: boolean
  value: {
    cooked: string
    // cooked: string | null // If the template literal is tagged and the text has an invalid escape, `cooked` will be `null`, e.g., `` tag`\unicode and \u{55}` ``
    raw: string
  }
}
export interface ClassExpression extends HasParentNode {
  type: 'ClassExpression'
  id: Identifier | null
  superClass: Expression | null
  body: ClassBody
}
export interface MetaProperty extends HasParentNode {
  type: 'MetaProperty'
  meta: Identifier
  property: Identifier
}
export type Pattern =
  | Identifier
  | ObjectPattern
  | ArrayPattern
  | RestElement
  | AssignmentPattern
  | MemberExpression
export interface ObjectPattern extends HasParentNode {
  type: 'ObjectPattern'
  properties: (AssignmentProperty | RestElement)[]
}
interface BaseAssignmentProperty extends HasParentNode {
  type: 'Property'
  kind: 'init'
  method: false
  shorthand: boolean
  // computed: boolean
  // key: Expression
  value: Pattern
  parent: ObjectPattern
}
export interface AssignmentPropertyNonComputedName
  extends BaseAssignmentProperty {
  computed: false
  key: Identifier | Literal
}
export interface AssignmentPropertyComputedName extends BaseAssignmentProperty {
  computed: true
  key: Expression
}
export type AssignmentProperty =
  | AssignmentPropertyNonComputedName
  | AssignmentPropertyComputedName
export interface ArrayPattern extends HasParentNode {
  type: 'ArrayPattern'
  elements: Pattern[]
}
export interface RestElement extends HasParentNode {
  type: 'RestElement'
  argument: Pattern
}
export interface SpreadElement extends HasParentNode {
  type: 'SpreadElement'
  argument: Expression
}
export interface AssignmentPattern extends HasParentNode {
  type: 'AssignmentPattern'
  left: Pattern
  right: Expression
}

export type _FunctionParameter =
  | AssignmentPattern
  | RestElement
  | ArrayPattern
  | ObjectPattern
  | Identifier
// | TSParameterProperty;
