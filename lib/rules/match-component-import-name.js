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
      url: ''
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          prefix: {
            type: 'string'
          },
          casing: {
            type: 'string'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      unexpected:
        'component alias {{importedName}} should match {{expectedName}}'
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
        .filter((property) => {
          return utils.getStaticPropertyName(property) === 'components'
        })[0]

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
                message: `component alias ${utils.getStaticPropertyName(
                  property
                )} should have the prefix ${options.prefix}`
              })
            }

            if (property.value.type !== 'Identifier') {
              return
            }

            const prefix = options.prefix || ''
            const importedName = utils.getStaticPropertyName(property) || ''
            const expectedName =
              options.casing === 'kebab-case'
                ? prefix + casing.kebabCase(property.value.name)
                : prefix + casing.pascalCase(property.value.name)
            if (importedName !== expectedName) {
              context.report({
                node: property,
                messageId: 'unexpected',
                data: {
                  importedName,
                  expectedName
                }
              })
            }
          }
        )
      }
    }
  }
}
