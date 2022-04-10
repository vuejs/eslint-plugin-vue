/**
 * @author Doug Wade <douglas.b.wade@gmail.com>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'require the registered component name to match the imported component name',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/match-component-import-name.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          prefix: {
            type: 'string'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpected:
        'Component alias {{importedName}} should be one of: {{expectedName}}.',
      prefix:
        'Component alias {{propertyName}} should have the prefix {{prefix}}.'
    }
  },
  /**
   * @param {RuleContext} context
   * @returns {RuleListener}
   */
  create(context) {
    const options = context.options[0] || {}

    /**
     * @param {ExportDefaultDeclaration} node
     * @return {Array<Property>}
     */
    function getComponents(node) {
      if (node.declaration.type !== 'ObjectExpression') {
        return []
      }

      const componentProperty = node.declaration.properties
        .filter(utils.isProperty)
        .find(
          (property) => utils.getStaticPropertyName(property) === 'components'
        )

      if (
        !componentProperty ||
        componentProperty.value.type !== 'ObjectExpression'
      ) {
        return []
      }

      return componentProperty.value.properties.filter(utils.isProperty)
    }

    /** @param {Property} property */
    function propertyStartsWithPrefix(property) {
      if (!options.prefix) {
        return true
      }

      const name = utils.getStaticPropertyName(property)
      return name ? name.startsWith(options.prefix) : false
    }

    /**
     * @param {Identifier} identifier
     * @param {String} prefix
     * @return {Array<String>}
     */
    function getExpectedNames(identifier, prefix) {
      return [
        `${prefix}${casing.pascalCase(identifier.name)}`,
        `${prefix}${casing.kebabCase(identifier.name)}`
      ]
    }

    return {
      ExportDefaultDeclaration(node) {
        const components = getComponents(node)

        if (!components) {
          return
        }

        components.forEach(
          /** @param {Property} property */
          (property) => {
            if (!propertyStartsWithPrefix(property)) {
              context.report({
                node: property,
                messageId: 'prefix',
                data: {
                  propertyName: utils.getStaticPropertyName(property) || '',
                  prefix: options.prefix
                }
              })
            }

            if (property.value.type !== 'Identifier') {
              return
            }

            const prefix = options.prefix || ''
            const importedName = utils.getStaticPropertyName(property) || ''
            const expectedNames = getExpectedNames(property.value, prefix)
            if (!expectedNames.includes(importedName)) {
              context.report({
                node: property,
                messageId: 'unexpected',
                data: {
                  importedName,
                  expectedName: expectedNames.join(', ')
                }
              })
            }
          }
        )
      }
    }
  }
}
