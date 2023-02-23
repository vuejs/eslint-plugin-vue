/**
 * @author Przemysław Jan Beigert
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Check if all keys and values from second object are resent in first object
 *
 * @param {{ [key: string]: any }} a object to
 * @param {{ [key: string]: any }} b The string to escape.
 * @returns {boolean} Returns the escaped string.
 */
const isLooksLike = (a, b) =>
  a &&
  b &&
  Object.keys(b).every((bKey) => {
    const bVal = b[bKey]
    const aVal = a[bKey]
    if (typeof bVal === 'function') {
      return bVal(aVal)
    }
    return bVal == null || /^[bns]/.test(typeof bVal)
      ? bVal === aVal
      : isLooksLike(aVal, bVal)
  })

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce adding type declarations to object props',
      categories: ['suggestion'],
      recommended: false,
      url: 'https://eslint.vuejs.org/rules/force-types-on-object-props.html'
    },
    fixable: null,
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    return {
      /** @param {ExportDefaultDeclaration} node */
      ExportDefaultDeclaration(node) {
        if (node.declaration.type !== 'ObjectExpression') {
          return
        }
        if (!Array.isArray(node.declaration.properties)) {
          return
        }

        const property = node.declaration.properties.find(
          (property) =>
            property.type === 'Property' &&
            isLooksLike(property.key, { type: 'Identifier', name: 'props' }) &&
            property.value.type === 'ObjectExpression'
        )

        if (
          !property ||
          property.type === 'SpreadElement' ||
          !('properties' in property.value)
        ) {
          return
        }
        const properties = property.value.properties
          .filter(
            (prop) =>
              prop.type === 'Property' && prop.value.type === 'ObjectExpression'
          )
          .map((prop) =>
            prop.value.properties.find((propValueProperty) =>
              isLooksLike(propValueProperty.key, {
                type: 'Identifier',
                name: 'type'
              })
            )
          )
        for (const prop of properties) {
          if (!prop) {
            continue
          }
          if (isLooksLike(prop.value, { type: 'Identifier', name: 'Object' })) {
            context.report({
              node: prop,
              message: 'Expected type annotation on object prop.'
            })
          }
          if (prop.value.type === 'TSAsExpression') {
            const { typeAnnotation } = prop.value
            if (
              [
                'TSAnyKeyword',
                'TSTypeLiteral',
                'TSUnknownKeyword',
                'TSObjectKeyword'
              ].includes(typeAnnotation.type) ||
              !typeAnnotation.typeName ||
              typeAnnotation.typeName.name !== 'Prop'
            ) {
              context.report({
                node: prop,
                message: 'Expected type annotation on object prop.'
              })
            }
          }
        }
      }
    }
  }
}
