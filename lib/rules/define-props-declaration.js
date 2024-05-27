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
      }
    ],
    messages: {
      hasArg: 'Use type-based declaration instead of runtime declaration.',
      hasTypeArg: 'Use runtime declaration instead of type-based declaration.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
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
                  const propTypes = props.map((prop) => {
                    const unknownType = { name: prop.propName, type: 'unknown' }

                    if (prop.type !== 'object') {
                      return unknownType
                    }
                    const type = optionGetType(prop.value)
                    if (type === null) {
                      return unknownType
                    }

                    return {
                      name: prop.propName,
                      type: mapNativeType(type)
                    }
                  })

                  const definePropsType = `{ ${propTypes
                    .map(({ name, type }) => `${name}: ${type}`)
                    .join(', ')} }`

                  yield fixer.insertTextAfter(
                    node.callee,
                    `<${definePropsType}>`
                  )
                  yield fixer.replaceText(node.arguments[0], '')
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
