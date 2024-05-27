/**
 * @author Amorites
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

const mapNativeType = (/** @type {string} */ nativeType) => {
  switch (nativeType) {
    case 'String': {
      return 'string'
    }
    case 'Number': {
      return 'number'
    }
    case 'Boolean':
    case 'BigInt': {
      return 'boolean'
    }
    case 'Object': {
      return 'Record<string, any>'
    }
    case 'Array': {
      return 'any[]'
    }
    case 'Function': {
      return '() => void'
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
          separateInterface: {
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
    const sourceCode = context.getSourceCode()

    /**
     * @param {Expression} node
     * @returns {string | null}
     */
    function optionGetType(node) {
      switch (node.type) {
        case 'Identifier': {
          return node.name
        }
        case 'ObjectExpression': {
          // foo: {
          const typeProperty = utils.findProperty(node, 'type')
          if (typeProperty == null) {
            return null
          }
          if (typeProperty.value.type === 'TSAsExpression') {
            if (
              typeProperty.value.typeAnnotation.typeName.name !== 'PropType'
            ) {
              return null
            }

            const typeArgument =
              typeProperty.value.typeAnnotation.typeArguments.params[0]
            if (typeArgument === undefined) {
              return null
            }

            return sourceCode.getText(typeArgument)
          }
          return optionGetType(typeProperty.value)
        }
        case 'ArrayExpression': {
          // foo: [
          return null
          // return node.elements.map((arrayElement) =>
          //   optionGetType(arrayElement)
          // )
        }
        case 'FunctionExpression':
        case 'ArrowFunctionExpression': {
          return null
        }
      }

      // Unknown
      return null
    }

    /**
     * @param {Expression} node
     * @returns {boolean | undefined }
     */
    function optionGetRequired(node) {
      if (node.type === 'ObjectExpression') {
        const requiredProperty = utils.findProperty(node, 'required')
        if (requiredProperty == null) {
          return undefined
        }

        if (requiredProperty.value.type === 'Literal') {
          return Boolean(requiredProperty.value.value)
        }
      }

      // Unknown
      return undefined
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

    const scriptSetup = utils.getScriptSetupElement(context)
    if (!scriptSetup || !utils.hasAttribute(scriptSetup, 'lang', 'ts')) {
      return {}
    }

    const defineType = context.options[0] || 'type-based'
    const separateInterface = context.options[1]?.separateInterface || false

    return utils.defineScriptSetupVisitor(context, {
      onDefinePropsEnter(node, props) {
        switch (defineType) {
          case 'type-based': {
            if (node.arguments.length > 0) {
              context.report({
                node,
                messageId: 'hasArg',
                *fix(fixer) {
                  const propTypes = props.map((prop) => {
                    const unknownType = {
                      name: prop.propName,
                      type: 'unknown',
                      required: undefined,
                      defaultValue: undefined
                    }

                    if (prop.type !== 'object') {
                      return unknownType
                    }
                    const type = optionGetType(prop.value)
                    if (type === null) {
                      return unknownType
                    }
                    const required = optionGetRequired(prop.value)
                    const defaultValue = optionGetDefault(prop.value)

                    return {
                      name: prop.propName,
                      type: mapNativeType(type),
                      required,
                      defaultValue
                    }
                  })

                  const definePropsType = `{ ${propTypes
                    .map(
                      ({ name, type, required, defaultValue }) =>
                        `${name}${required === false || defaultValue ? '?' : ''}: ${type}`
                    )
                    .join(', ')} }`

                  yield fixer.replaceText(node.arguments[0], '')

                  if (separateInterface) {
                    const variableDeclarationNode = node.parent.parent
                    if (!variableDeclarationNode) return

                    yield fixer.insertTextBefore(
                      variableDeclarationNode,
                      `interface Props ${definePropsType.replaceAll(';', ',')}; `
                    )
                    yield fixer.insertTextAfter(node.callee, `<Props>`)
                  } else {
                    yield fixer.insertTextAfter(
                      node.callee,
                      `<${definePropsType}>`
                    )
                  }

                  const defaults = propTypes.filter(
                    ({ defaultValue }) => defaultValue
                  )
                  if (defaults.length > 0) {
                    const defaultsCode = defaults
                      .map(
                        ({ name, defaultValue }) =>
                          `${name}: ${sourceCode.getText(defaultValue)}`
                      )
                      .join(', ')

                    yield fixer.insertTextBefore(node, `withDefaults(`)
                    yield fixer.insertTextAfter(node, `, { ${defaultsCode} })`)
                  }
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
