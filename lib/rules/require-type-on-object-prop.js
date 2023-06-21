/**
 * @author Przemysław Jan Beigert
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')
/**
 * @typedef {import('../utils').ComponentProp} ComponentProp
 */

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/** @param {Identifier} node */
const isObjectProp = (node) => node.name === 'Object' || node.name === 'Array'

/**
 * @param {ComponentProp} property
 * @param {RuleContext} context
 */
const checkProperty = (property, context) => {
  if (!('value' in property)) {
    return
  }

  if (
    property.value.type === 'Identifier' &&
    isObjectProp(property.value) &&
    property.node.value.type !== 'TSAsExpression'
  ) {
    context.report({
      node: property.node,
      message: 'Expected type annotation on object prop.'
    })
  }

  if (
    property.type === 'object' &&
    property.value.type === 'ObjectExpression' &&
    property.node.value.type === 'ObjectExpression'
  ) {
    const typeProperty = property.node.value.properties.find(
      (prop) =>
        prop.type === 'Property' &&
        prop.key.type === 'Identifier' &&
        prop.key.name === 'type'
    )
    if (
      typeProperty &&
      typeProperty.type === 'Property' &&
      typeProperty.value.type === 'Identifier' &&
      isObjectProp(typeProperty.value)
    ) {
      context.report({
        node: property.node,
        message: 'Expected type annotation on object prop.'
      })
    }
  }

  if (property.node.value.type === 'ObjectExpression') {
    for (const prop of property.node.value.properties) {
      if (prop.type !== 'Property') {
        continue
      }
      if (prop.key.type !== 'Identifier' || prop.key.name !== 'type') {
        continue
      }
      if (prop.value.type !== 'TSAsExpression') {
        continue
      }

      const { typeAnnotation } = prop.value
      if (
        ['TSAnyKeyword', 'TSUnknownKeyword'].includes(typeAnnotation.type) ||
        !typeAnnotation.typeName ||
        !['Prop', 'PropType'].includes(typeAnnotation.typeName.name)
      ) {
        context.report({
          node: property.node,
          message: 'Expected type annotation on object prop.'
        })
      }
    }
  }

  if (property.node.value.type === 'TSAsExpression') {
    const { typeAnnotation } = property.node.value
    if (typeAnnotation.type === 'TSFunctionType') {
      return
    }
    if (
      [
        'TSAnyKeyword',
        'TSTypeLiteral',
        'TSUnknownKeyword',
        'TSObjectKeyword'
      ].includes(typeAnnotation.type) ||
      !typeAnnotation.typeName ||
      !['Prop', 'PropType'].includes(typeAnnotation.typeName.name)
    ) {
      context.report({
        node: property.node,
        message: 'Expected type annotation on object prop.'
      })
    }
  }
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce adding type declarations to object props',
      categories: undefined,
      recommended: false,
      url: 'https://eslint.vuejs.org/rules/require-type-on-object-prop.html'
    },
    fixable: null,
    schema: []
  },
  /** @param {RuleContext} context */
  create(context) {
    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(_node, props) {
          for (const prop of props) {
            checkProperty(prop, context)
          }
        }
      }),
      utils.executeOnVue(context, (obj) => {
        const props = utils.getComponentPropsFromOptions(obj)

        for (const prop of props) {
          checkProperty(prop, context)
        }
      })
    )
  }
}
