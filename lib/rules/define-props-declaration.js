/**
 * @author Amorites
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

const PROPS_SEPARATOR = ', '

/**
 * @param {RuleFixer} fixer
 * @param {CallExpression} node
 * @param {ComponentProp[]} props
 * @param {RuleContext} context
 */
function* fixTypeBased(fixer, node, props, context) {
  try {
    const sourceCode = context.getSourceCode()
    const autoFixToSeparateInterface =
      context.options[1]?.autoFixToSeparateInterface || false

    const componentPropsData = props.map((prop) =>
      getComponentPropData(prop, sourceCode)
    )

    const componentPropsTypeCode = `{${componentPropsData
      .map(({ name, type, required, defaultValue }) => {
        const isOptional = required === false || defaultValue
        return `${name}${isOptional ? '?' : ''}: ${type}`
      })
      .join(PROPS_SEPARATOR)}}`

    // remove defineProps function parameters
    yield fixer.replaceText(node.arguments[0], '')

    // add type annotation
    if (autoFixToSeparateInterface) {
      const variableDeclarationNode = node.parent.parent
      if (!variableDeclarationNode) {
        return
      }

      yield fixer.insertTextBefore(
        variableDeclarationNode,
        `interface Props ${componentPropsTypeCode.replace(/;/g, ',')}; `
      )
      yield fixer.insertTextAfter(node.callee, `<Props>`)
    } else {
      yield fixer.insertTextAfter(node.callee, `<${componentPropsTypeCode}>`)
    }

    // add defaults if needed
    const propTypesDataWithDefaultValue = componentPropsData.filter(
      ({ defaultValue }) => defaultValue
    )
    if (propTypesDataWithDefaultValue.length > 0) {
      const defaultsCode = propTypesDataWithDefaultValue
        .map(
          ({ name, defaultValue }) =>
            `${name}: ${sourceCode.getText(defaultValue)}`
        )
        .join(PROPS_SEPARATOR)

      yield fixer.insertTextBefore(node, `withDefaults(`)
      yield fixer.insertTextAfter(node, `, { ${defaultsCode} })`)
    }
    return null
  } catch (error) {
    return null
  }
}
const mapNativeType = (/** @type {string} */ nativeType) => {
  switch (nativeType) {
    case 'String': {
      return 'string'
    }
    case 'Number': {
      return 'number'
    }
    case 'Boolean': {
      return 'boolean'
    }
    case 'Object': {
      return 'Record<string, any>'
    }
    case 'Array': {
      return 'any[]'
    }
    case 'Function': {
      return '(...args: any[]) => any'
    }
    case 'Symbol': {
      return 'symbol'
    }
    default: {
      return nativeType
    }
  }
}

/**
 * @param {ComponentProp} prop
 * @param {SourceCode} sourceCode
 */
function getComponentPropData(prop, sourceCode) {
  if (prop.propName === null) {
    throw new Error('Unexpected prop with null name.')
  }
  if (prop.type !== 'object') {
    throw new Error(`Unexpected prop type: ${prop.type}.`)
  }
  const type = optionGetType(prop.value, sourceCode)
  const required = optionGetRequired(prop.value)
  const defaultValue = optionGetDefault(prop.value)

  return {
    name: prop.propName,
    type,
    required,
    defaultValue
  }
}

/**
 * @param {Expression} node
 * @param {SourceCode} sourceCode
 * @returns {string}
 */
function optionGetType(node, sourceCode) {
  switch (node.type) {
    case 'Identifier': {
      return mapNativeType(node.name)
    }
    case 'ObjectExpression': {
      const typeProperty = utils.findProperty(node, 'type')
      if (typeProperty == null) {
        return sourceCode.getText(node)
      }
      return optionGetType(typeProperty.value, sourceCode)
    }
    case 'ArrayExpression': {
      return node.elements
        .map((element) => {
          // TODO handle SpreadElement
          if (element === null || element.type === 'SpreadElement') {
            return sourceCode.getText(node)
          }

          return optionGetType(element, sourceCode)
        })
        .filter(Boolean)
        .join(' | ')
    }
    case 'TSAsExpression': {
      const typeAnnotation = node.typeAnnotation
      if (typeAnnotation.typeName.name !== 'PropType') {
        return sourceCode.getText(node)
      }

      // in some project configuration parser populates deprecated field `typeParameters` instead of `typeArguments`
      const typeArguments =
        'typeArguments' in node
          ? typeAnnotation.typeArguments
          : typeAnnotation.typeParameters

      const typeArgument = Array.isArray(typeArguments)
        ? typeArguments[0].params[0]
        : typeArguments.params[0]

      if (typeArgument === undefined) {
        return sourceCode.getText(node)
      }

      return sourceCode.getText(typeArgument)
    }
    case 'LogicalExpression': {
      if (node.operator === '||') {
        const left = optionGetType(node.left, sourceCode)
        const right = optionGetType(node.right, sourceCode)
        if (left && right) {
          return `${left} | ${right}`
        }
      }
      return sourceCode.getText(node)
    }
    default: {
      return sourceCode.getText(node)
    }
  }
}

/**
 * @param {Expression} node
 * @returns {boolean | undefined }
 */
function optionGetRequired(node) {
  if (node.type === 'ObjectExpression') {
    const requiredProperty = utils.findProperty(node, 'required')
    if (requiredProperty == null) {
      return false
    }

    if (requiredProperty.value.type === 'Literal') {
      return Boolean(requiredProperty.value.value)
    }
  }

  // Unknown
  return false
}

/**
 * @param {Expression} node
 * @returns {Expression | undefined }
 */
function optionGetDefault(node) {
  if (node.type === 'ObjectExpression') {
    const defaultProperty = utils.findProperty(node, 'default')
    if (defaultProperty == null) {
      return undefined
    }

    return defaultProperty.value
  }

  // Unknown
  return undefined
}

/**
 * @typedef {import('../utils').ComponentProp} ComponentProp
 */

module.exports = {
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
      },
      {
        type: 'object',
        properties: {
          autoFixToSeparateInterface: {
            type: 'boolean',
            default: false
          }
        }
      }
    ],
    messages: {
      hasArg: 'Use type-based declaration instead of runtime declaration.',
      hasTypeArg: 'Use runtime declaration instead of type-based declaration.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const scriptSetup = utils.getScriptSetupElement(context)
    if (!scriptSetup || !utils.hasAttribute(scriptSetup, 'lang', 'ts')) {
      return {}
    }

    const defineType = context.options[0] || 'type-based'

    return utils.defineScriptSetupVisitor(context, {
      onDefinePropsEnter(node, props) {
        switch (defineType) {
          case 'type-based': {
            if (node.arguments.length > 0) {
              context.report({
                node,
                messageId: 'hasArg',
                *fix(fixer) {
                  yield* fixTypeBased(fixer, node, props, context)
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
