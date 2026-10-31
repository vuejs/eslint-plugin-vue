/**
 * @author Amorites
 * See LICENSE file in root directory for full license.
 */
import type { TSESTree } from '@typescript-eslint/types'
import { findVariable } from '@eslint-community/eslint-utils'
import utils from '../utils/index.ts'

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

/**
 * Returns the types of the given native constructors (e.g. `[String, Number]`),
 * or `null` if any of them is something else.
 */
function getNativeTypes(
  context: RuleContext,
  node: Expression
): string[] | null {
  const elements = node.type === 'ArrayExpression' ? node.elements : [node]
  const types: string[] = []
  for (const element of elements) {
    if (element?.type !== 'Identifier') {
      return null
    }
    const type = NATIVE_TYPES.get(element.name)
    const variable = findVariable(utils.getScope(context, element), element)
    // a local declaration shadows the global constructor
    if (!type || (variable && variable.defs.length > 0)) {
      return null
    }
    types.push(type)
  }
  return types.length > 0 ? types : null
}

function getPropType(context: RuleContext, node: Expression): string | null {
  if (node.type !== 'TSAsExpression') {
    return getNativeTypes(context, node)?.join(' | ') ?? null
  }

  const nativeTypes = getNativeTypes(context, node.expression)
  // The runtime type is inferred from the `PropType` argument, which would
  // lose the `Boolean` casting if the compiler cannot resolve that type.
  if (!nativeTypes || nativeTypes.includes('boolean')) {
    return null
  }
  const typeAnnotation: TSESTree.TypeNode = node.typeAnnotation
  return typeAnnotation.type === 'TSTypeReference' &&
    typeAnnotation.typeName.type === 'Identifier' &&
    typeAnnotation.typeName.name === 'PropType' &&
    typeAnnotation.typeArguments?.params.length === 1
    ? context.sourceCode.getText(typeAnnotation.typeArguments.params[0])
    : null
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
  if (key === null) {
    return null
  }

  const { value } = property
  if (value.type !== 'ObjectExpression') {
    const type = getPropType(context, value)
    return type ? { key, type, isRequired: false, defaultValue: null } : null
  }

  // e.g. `validator` has no type-based equivalent
  const hasOnlyKnownOptions = value.properties.every(
    (option) =>
      isPlainProperty(option) &&
      OPTION_NAMES.has(utils.getStaticPropertyName(option) ?? '')
  )
  const typeOption = utils.findProperty(value, 'type')
  const type = typeOption && getPropType(context, typeOption.value)
  const required = utils.findProperty(value, 'required')?.value
  if (
    !hasOnlyKnownOptions ||
    !type ||
    (required &&
      (required.type !== 'Literal' || typeof required.value !== 'boolean'))
  ) {
    return null
  }

  const defaultOption = utils.findProperty(value, 'default')
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
  for (const property of argument.properties) {
    const declaration = getPropDeclaration(context, property)
    if (!declaration) {
      return null
    }
    declarations.push(declaration)
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
