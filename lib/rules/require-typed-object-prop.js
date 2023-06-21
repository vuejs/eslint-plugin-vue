/**
 * @author Przemysław Jan Beigert
 * See LICENSE file in root directory for full license.
 */
'use strict'

const utils = require('../utils')

/**
 * @param {RuleContext} context
 * @param {Identifier} node
 */
const checkPropertyIdentifierType = (context, node) => {
  if (node.name === 'Object' || node.name === 'Array') {
    context.report({
      node,
      message: 'Expected type annotation on object prop.'
    })
  }
}

/**
 * @param {RuleContext} context
 * @param {ArrayExpression} node
 */
const checkPropertyArrayType = (context, node) => {
  for (const element of node.elements) {
    if (element?.type === 'Identifier') {
      checkPropertyIdentifierType(context, element)
    }
  }
}

/**
 * @param {RuleContext} context
 * @param {ObjectExpression} node
 */
const checkPropertyObjectType = (context, node) => {
  const typeProperty = node.properties.find(
    (prop) =>
      prop.type === 'Property' &&
      prop.key.type === 'Identifier' &&
      prop.key.name === 'type'
  )
  if (!typeProperty || typeProperty.type !== 'Property') {
    return
  }

  if (typeProperty.value.type === 'Identifier') {
    // `foo: { type: String }`
    checkPropertyIdentifierType(context, typeProperty.value)
  } else if (typeProperty.value.type === 'ArrayExpression') {
    // `foo: { type: [String, Boolean] }`
    checkPropertyArrayType(context, typeProperty.value)
  }
}

/**
 * @param {import('../utils').ComponentProp} property
 * @param {RuleContext} context
 */
const checkProperty = (property, context) => {
  if (property.type !== 'object') {
    return
  }

  switch (property.node.value.type) {
    case 'Identifier': {
      // e.g. `foo: String`
      checkPropertyIdentifierType(context, property.node.value)
      break
    }
    case 'ArrayExpression': {
      // e.g. `foo: [String, Boolean]`
      checkPropertyArrayType(context, property.node.value)
      break
    }
    case 'ObjectExpression': {
      // e.g. `foo: { type: … }`
      checkPropertyObjectType(context, property.node.value)
      return
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
      url: 'https://eslint.vuejs.org/rules/require-typed-object-prop.html'
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
