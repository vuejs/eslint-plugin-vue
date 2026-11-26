/**
 * @author Amorites
 * See LICENSE file in root directory for full license.
 */
import type { TSESTree } from '@typescript-eslint/types'
import { findVariable } from '@eslint-community/eslint-utils'
import utils from '../utils/index.ts'
import { camelCase } from '../utils/casing.ts'

interface PropDeclaration {
  key: string
  type: string
  isRequired: boolean
  defaultValue: string | null
}

const NATIVE_TYPES = new Map([
  ['String', 'string'],
  ['Number', 'number'],
  ['Boolean', 'boolean'],
  ['Object', 'Record<string, any>'],
  ['Array', 'any[]'],
  ['Function', '(...args: any[]) => any'],
  ['Symbol', 'symbol'],
  ['Date', 'Date']
])

// runtime types of the global types, as the compiler infers them
const GLOBAL_TYPES = new Map([
  ['Array', 'Array'],
  ['Function', 'Function'],
  ['Object', 'Object'],
  ['Set', 'Set'],
  ['Map', 'Map'],
  ['WeakSet', 'WeakSet'],
  ['WeakMap', 'WeakMap'],
  ['Date', 'Date'],
  ['Promise', 'Promise'],
  ['Error', 'Error'],
  ['Partial', 'Object'],
  ['Required', 'Object'],
  ['Readonly', 'Object'],
  ['Record', 'Object'],
  ['Pick', 'Object'],
  ['Omit', 'Object'],
  ['InstanceType', 'Object'],
  ['Uppercase', 'String'],
  ['Lowercase', 'String'],
  ['Capitalize', 'String'],
  ['Uncapitalize', 'String'],
  ['Parameters', 'Array'],
  ['ConstructorParameters', 'Array'],
  ['ReadonlyArray', 'Array'],
  ['ReadonlyMap', 'Map'],
  ['ReadonlySet', 'Set']
])

const OPTION_NAMES = new Set(['type', 'required', 'default'])

function isPlainProperty(node: Property | SpreadElement): node is Property {
  return (
    node.type === 'Property' &&
    node.kind === 'init' &&
    !node.computed &&
    !node.method &&
    !node.shorthand
  )
}

function isDeclaredLocally(
  context: RuleContext,
  node: ESNode,
  name: string
): boolean {
  const variable = findVariable(utils.getScope(context, node), name)
  return variable !== null && variable.defs.length > 0
}

/**
 * Returns the names of the given native constructors (e.g. `[String, Number]`),
 * or `null` if any of them is something else.
 */
function getConstructors(
  context: RuleContext,
  node: Expression
): string[] | null {
  const elements = node.type === 'ArrayExpression' ? node.elements : [node]
  const names: string[] = []
  for (const element of elements) {
    if (
      element?.type !== 'Identifier' ||
      !NATIVE_TYPES.has(element.name) ||
      // a local declaration shadows the global constructor
      isDeclaredLocally(context, element, element.name)
    ) {
      return null
    }
    names.push(element.name)
  }
  return names.length > 0 ? names : null
}

function inferMemberTypes(members: TSESTree.TypeElement[]): string[] {
  const types = new Set(
    members.map((member) =>
      member.type === 'TSCallSignatureDeclaration' ||
      member.type === 'TSConstructSignatureDeclaration'
        ? 'Function'
        : 'Object'
    )
  )
  return types.size > 0 ? [...types] : ['Object']
}

function inferLiteralType(node: TSESTree.TSLiteralType): string[] | null {
  const { literal } = node
  if (literal.type !== 'Literal') {
    return null
  }
  if (typeof literal.value === 'string') {
    return ['String']
  }
  if (typeof literal.value === 'boolean') {
    return ['Boolean']
  }
  return typeof literal.value === 'number' || 'bigint' in literal
    ? ['Number']
    : null
}

function inferEnumTypes(node: TSESTree.TSEnumDeclaration): string[] {
  const types = new Set<string>()
  for (const { initializer } of node.body.members) {
    if (initializer?.type === 'Literal') {
      if (typeof initializer.value === 'string') {
        types.add('String')
      } else if (typeof initializer.value === 'number') {
        types.add('Number')
      }
    }
  }
  return types.size > 0 ? [...types] : ['Number']
}

function inferUnionTypes(
  context: RuleContext,
  nodes: TSESTree.TypeNode[],
  visited: Set<TSESTree.Node>
): string[] | null {
  const types = new Set<string>()
  for (const node of nodes) {
    const inferred = inferRuntimeTypes(context, node, visited)
    if (!inferred) {
      return null
    }
    for (const type of inferred) {
      types.add(type)
    }
  }
  return [...types]
}

function inferGlobalTypes(
  context: RuleContext,
  node: TSESTree.TSTypeReference,
  name: string,
  visited: Set<TSESTree.Node>
): string[] | null {
  const type = GLOBAL_TYPES.get(name)
  if (type) {
    return [type]
  }
  const [first, second] = node.typeArguments?.params ?? []
  switch (name) {
    case 'NonNullable': {
      const types = first && inferRuntimeTypes(context, first, visited)
      return types ? types.filter((type) => type !== 'null') : null
    }
    case 'Extract': {
      return second ? inferRuntimeTypes(context, second, visited) : null
    }
    case 'Exclude':
    case 'OmitThisParameter': {
      return first ? inferRuntimeTypes(context, first, visited) : null
    }
    default: {
      return null
    }
  }
}

function inferReferenceTypes(
  context: RuleContext,
  node: TSESTree.TSTypeReference,
  visited: Set<TSESTree.Node>
): string[] | null {
  const { typeName } = node
  if (typeName.type !== 'Identifier') {
    return null
  }
  const variable = findVariable(
    utils.getScope(context, node as unknown as ESNode),
    typeName.name
  )
  const defs = variable?.defs ?? []
  if (defs.length === 0) {
    return inferGlobalTypes(context, node, typeName.name, visited)
  }
  // The compiler resolves the type arguments of a local generic type in its
  // own way, e.g. a type parameter can refer to another type of the file.
  // Merged interfaces cannot be checked either.
  if (defs.length > 1 || node.typeArguments) {
    return null
  }

  const declaration = defs[0].node as TSESTree.Node
  switch (declaration.type) {
    case 'TSInterfaceDeclaration': {
      return declaration.typeParameters
        ? null
        : inferMemberTypes(declaration.body.body)
    }
    case 'TSEnumDeclaration': {
      return inferEnumTypes(declaration)
    }
    case 'ClassDeclaration': {
      return declaration.typeParameters ? null : ['Object']
    }
    case 'TSTypeAliasDeclaration': {
      return declaration.typeParameters
        ? null
        : inferRuntimeTypes(context, declaration.typeAnnotation, visited)
    }
    // e.g. imported types and type parameters
    default: {
      return null
    }
  }
}

function inferNodeTypes(
  context: RuleContext,
  node: TSESTree.TypeNode,
  visited: Set<TSESTree.Node>
): string[] | null {
  switch (node.type) {
    case 'TSStringKeyword': {
      return ['String']
    }
    case 'TSNumberKeyword': {
      return ['Number']
    }
    case 'TSBooleanKeyword': {
      return ['Boolean']
    }
    case 'TSObjectKeyword': {
      return ['Object']
    }
    case 'TSSymbolKeyword': {
      return ['Symbol']
    }
    case 'TSNullKeyword': {
      return ['null']
    }
    case 'TSFunctionType': {
      return ['Function']
    }
    case 'TSArrayType':
    case 'TSTupleType': {
      return ['Array']
    }
    case 'TSTypeLiteral': {
      return inferMemberTypes(node.members)
    }
    case 'TSLiteralType': {
      return inferLiteralType(node)
    }
    case 'TSTypeOperator': {
      return node.operator !== 'keyof' && node.typeAnnotation
        ? inferRuntimeTypes(context, node.typeAnnotation, visited)
        : null
    }
    case 'TSUnionType':
    case 'TSIntersectionType': {
      return inferUnionTypes(context, node.types, visited)
    }
    case 'TSTypeReference': {
      return inferReferenceTypes(context, node, visited)
    }
    default: {
      return null
    }
  }
}

/**
 * Infers the runtime types of the given type in the same way as
 * `@vue/compiler-sfc`, or returns `null` if they cannot be inferred from the
 * local declarations, e.g. for imported types.
 */
function inferRuntimeTypes(
  context: RuleContext,
  node: TSESTree.TypeNode,
  visited = new Set<TSESTree.Node>()
): string[] | null {
  // e.g. `type A = B; type B = A`
  if (visited.has(node)) {
    return null
  }
  visited.add(node)
  const types = inferNodeTypes(context, node, visited)
  visited.delete(node)
  return types
}

function isLocalEnum(context: RuleContext, node: TSESTree.TypeNode): boolean {
  if (node.type !== 'TSTypeReference' || node.typeName.type !== 'Identifier') {
    return false
  }
  const variable = findVariable(
    utils.getScope(context, node as unknown as ESNode),
    node.typeName.name
  )
  return (
    variable?.defs.length === 1 &&
    variable.defs[0].node.type === 'TSEnumDeclaration'
  )
}

function getPropType(
  context: RuleContext,
  node: Expression,
  hasDefault: boolean
): string | null {
  const constructorsNode =
    node.type === 'TSAsExpression' ? node.expression : node
  const constructors = getConstructors(context, constructorsNode)
  if (!constructors) {
    return null
  }
  const runtimeTypes = [...new Set(constructors)]
  // The compiler would generate a single type instead of the array, which
  // changes whether a function default value is called as a factory.
  if (
    hasDefault &&
    constructorsNode.type === 'ArrayExpression' &&
    runtimeTypes.length === 1
  ) {
    return null
  }

  if (node.type !== 'TSAsExpression') {
    // a local declaration shadows the global type
    if (
      runtimeTypes.includes('Object') &&
      isDeclaredLocally(context, node, 'Record')
    ) {
      return null
    }
    const types = runtimeTypes.map((name) => NATIVE_TYPES.get(name)!)
    return types.length === 1
      ? types[0]
      : types
          .map((type) => (type.includes('=>') ? `(${type})` : type))
          .join(' | ')
  }

  const typeAnnotation: TSESTree.TypeNode = node.typeAnnotation
  if (
    typeAnnotation.type !== 'TSTypeReference' ||
    typeAnnotation.typeName.type !== 'Identifier' ||
    typeAnnotation.typeName.name !== 'PropType' ||
    typeAnnotation.typeArguments?.params.length !== 1
  ) {
    return null
  }
  const type = typeAnnotation.typeArguments.params[0]
  // The compiler infers the runtime types from the `PropType` argument, so they
  // must be the same as the constructors. The only exception is an enum with
  // other member types, which changes only the dev-mode type check.
  const isSameType =
    inferRuntimeTypes(context, type)?.join(',') === runtimeTypes.join(',')
  const isEnum =
    isLocalEnum(context, type) &&
    runtimeTypes.every((name) => name === 'String' || name === 'Number')
  return isSameType || isEnum ? context.sourceCode.getText(type) : null
}

function getKeyText(
  sourceCode: SourceCode,
  key: Property['key']
): string | null {
  if (key.type === 'Identifier') {
    return key.name
  }
  return key.type === 'Literal' && typeof key.value === 'string'
    ? sourceCode.getText(key)
    : null
}

function getPropDeclaration(
  context: RuleContext,
  property: Property | SpreadElement
): PropDeclaration | null {
  if (!isPlainProperty(property)) {
    return null
  }
  const sourceCode = context.sourceCode
  const key = getKeyText(sourceCode, property.key)
  // the compiler does not handle `__proto__` as a prop name
  if (key === null || utils.getStaticPropertyName(property) === '__proto__') {
    return null
  }

  const { value } = property
  if (value.type !== 'ObjectExpression') {
    const type = getPropType(context, value, false)
    return type ? { key, type, isRequired: false, defaultValue: null } : null
  }

  const optionNames = value.properties.map((option) =>
    isPlainProperty(option) ? utils.getStaticPropertyName(option) : null
  )
  // e.g. `validator` has no type-based equivalent
  const hasOnlyKnownOptions = optionNames.every(
    (name) => name !== null && OPTION_NAMES.has(name)
  )
  // the last one of duplicate options would be used
  const hasDuplicateOptions = new Set(optionNames).size !== optionNames.length
  const typeOption = utils.findProperty(value, 'type')
  const defaultOption = utils.findProperty(value, 'default')
  const type =
    typeOption && getPropType(context, typeOption.value, Boolean(defaultOption))
  const required = utils.findProperty(value, 'required')?.value
  if (
    !hasOnlyKnownOptions ||
    hasDuplicateOptions ||
    !type ||
    (required &&
      (required.type !== 'Literal' || typeof required.value !== 'boolean'))
  ) {
    return null
  }

  // keep the parentheses around the value, e.g. `(a, b)`
  const defaultValue =
    defaultOption &&
    sourceCode.text
      .slice(
        sourceCode.getTokenAfter(defaultOption.key)!.range[1],
        defaultOption.range[1]
      )
      .trim()
  return { key, type, isRequired: required?.value === true, defaultValue }
}

/**
 * Returns the type-based equivalent of the given runtime `defineProps()` call,
 * or `null` if it cannot be converted without changing its behavior.
 */
function getTypeBasedDeclaration(
  context: RuleContext,
  node: CallExpression
): string | null {
  const sourceCode = context.sourceCode
  const argument = node.arguments[0]
  if (
    node.arguments.length !== 1 ||
    node.typeArguments ||
    argument.type !== 'ObjectExpression' ||
    argument.properties.length === 0 ||
    sourceCode.getCommentsInside(node).length > 0
  ) {
    return null
  }

  const declarations: PropDeclaration[] = []
  const propNames = new Set<string>()
  for (const property of argument.properties) {
    const declaration = getPropDeclaration(context, property)
    if (!declaration || property.type !== 'Property') {
      return null
    }
    const name = camelCase(utils.getStaticPropertyName(property) ?? '')
    // the last one of duplicate props would be used
    if (propNames.has(name)) {
      return null
    }
    declarations.push(declaration)
    propNames.add(name)
  }

  if (
    node.parent.type === 'VariableDeclarator' &&
    node.parent.id.type === 'ObjectPattern' &&
    // The compiler infers the runtime types of the default values of the
    // reactive props destructure differently for a type-based declaration.
    node.parent.id.properties.some(
      (property) =>
        property.type === 'Property' &&
        property.value.type === 'AssignmentPattern'
    )
  ) {
    return null
  }

  const members = declarations.map(
    ({ key, type, isRequired }) => `${key}${isRequired ? '' : '?'}: ${type}`
  )
  const typeBased = `${sourceCode.getText(node.callee)}<{ ${members.join('; ')} }>()`
  const defaults = declarations
    .filter(({ defaultValue }) => defaultValue !== null)
    .map(({ key, defaultValue }) => `${key}: ${defaultValue}`)
  if (defaults.length === 0) {
    return typeBased
  }
  // `withDefaults()` would disable the reactive props destructure
  if (
    node.parent.type === 'VariableDeclarator' &&
    node.parent.id.type === 'ObjectPattern'
  ) {
    return null
  }
  return `withDefaults(${typeBased}, { ${defaults.join(', ')} })`
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce declaration style of `defineProps`',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/define-props-declaration.html'
    },
    fixable: 'code',
    schema: [
      {
        enum: ['type-based', 'runtime']
      }
    ],
    messages: {
      hasArg: 'Use type-based declaration instead of runtime declaration.',
      hasTypeArg: 'Use runtime declaration instead of type-based declaration.'
    }
  },
  create(context: RuleContext) {
    const scriptSetup = utils.getScriptSetupElement(context)
    if (!scriptSetup || !utils.hasAttribute(scriptSetup, 'lang', 'ts')) {
      return {}
    }

    const defineType = context.options[0] || 'type-based'
    return utils.defineScriptSetupVisitor(context, {
      onDefinePropsEnter(node) {
        switch (defineType) {
          case 'type-based': {
            if (node.arguments.length > 0) {
              context.report({
                node,
                messageId: 'hasArg',
                fix(fixer) {
                  const typeBased = getTypeBasedDeclaration(context, node)
                  return typeBased === null
                    ? null
                    : fixer.replaceText(node, typeBased)
                }
              })
            }
            break
          }

          case 'runtime': {
            const typeArguments =
              'typeArguments' in node ? node.typeArguments : node.typeParameters
            if (typeArguments && typeArguments.params.length > 0) {
              context.report({
                node,
                messageId: 'hasTypeArg'
              })
            }
            break
          }
        }
      }
    })
  }
}
