/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
const eslitUtils = require('eslint-utils')
const utils = require('../utils')

/**
 * @typedef {import('../utils').ComponentPropertyData} ComponentPropertyData
 * @typedef {import('../utils').ComponentObjectPropertyData} ComponentObjectPropertyData
 *
 * @typedef {{[key: string]: ComponentPropertyData & { valueType: { type: string } }}} ProprtyMap
 */
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/**
 *
 * @param {ComponentObjectPropertyData} property
 * @return {string | null}
 */
const getComponetPropsType = (property) => {
  if (property.property.value.type === 'ObjectExpression') {
    const propsTypeProperty = property.property.value.properties.find(
      (property) =>
        property.type === 'Property' &&
        property.key.type === 'Identifier' &&
        property.key.name === 'type' &&
        property.value.type === 'Identifier'
    )

    if (propsTypeProperty === undefined) return null

    if (
      propsTypeProperty.type === 'Property' &&
      propsTypeProperty.value.type === 'Identifier'
    )
      return propsTypeProperty.value.name
  }
  return null
}

/**
 *
 * @param {any} obj
 */
const getPrototypeType = (obj) =>
  Object.prototype.toString.call(obj).slice(8, -1)

/**
 * Get return type of property.
 * @param {{ property: ComponentPropertyData, propertyMap?: ProprtyMap }} args
 * @returns {{type: string | null}}
 */
const getValueType = ({ property, propertyMap }) => {
  if (property.type === 'array') {
    return {
      type: null
    }
  }

  if (property.type === 'object') {
    if (property.groupName === 'props') {
      return {
        type: getComponetPropsType(property)
      }
    }

    if (property.groupName === 'computed' || property.groupName === 'methods') {
      if (
        property.property.value.type === 'FunctionExpression' &&
        property.property.value.body.type === 'BlockStatement'
      ) {
        const blockStatement = property.property.value.body

        /**
         * Only check return statement inside computed and methods
         */
        const returnStatement = blockStatement.body.find(
          (b) => b.type === 'ReturnStatement'
        )
        if (!returnStatement || returnStatement.type !== 'ReturnStatement')
          return

        if (
          property.groupName === 'computed' &&
          propertyMap &&
          propertyMap[property.name] &&
          returnStatement.argument
        ) {
          if (
            returnStatement.argument.type === 'MemberExpression' &&
            returnStatement.argument.property.type === 'Identifier'
          )
            return {
              type:
                propertyMap[returnStatement.argument.property.name].valueType
                  .type
            }

          if (
            returnStatement.argument.type === 'CallExpression' &&
            returnStatement.argument.callee.type === 'MemberExpression' &&
            returnStatement.argument.callee.property.type === 'Identifier'
          )
            return {
              type:
                propertyMap[returnStatement.argument.callee.property.name]
                  .valueType.type
            }
        }

        /**
         * Use value as Object even if object includes method
         */
        if (
          property.groupName === 'computed' &&
          returnStatement.argument.type === 'ObjectExpression'
        ) {
          return {
            type: 'Object'
          }
        }

        const evaluated = eslitUtils.getStaticValue(returnStatement.argument)

        if (evaluated) {
          return {
            type: getPrototypeType(evaluated.value)
          }
        }
      }
    }

    const evaluated = eslitUtils.getStaticValue(property.property.value)

    if (evaluated) {
      return {
        type: getPrototypeType(evaluated.value)
      }
    }
  }
  return {
    type: null
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow use computed property like method',
      categories: undefined,
      url:
        'https://eslint.vuejs.org/rules/no-use-computed-property-like-method.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Use {{ likeProperty }} instead of {{ likeMethod }}.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    const GROUP_NAMES = ['data', 'props', 'computed', 'methods']
    const groups = new Set(GROUP_NAMES)

    /** @type ProprtyMap */
    const propertyMap = {}

    /**@type ObjectExpression */
    let vueNodeMap = {}

    return utils.defineVueVisitor(context, {
      onVueObjectEnter(node) {
        vueNodeMap = node
        const properties = utils.iterateProperties(node, groups)

        for (const property of properties) {
          propertyMap[property.name] = {
            ...propertyMap[property.name],
            ...property,
            valueType: getValueType({ property })
          }
        }
      },

      /**
       * Re-check propertyMap's valueType.
       * Because there is a possibility that propertyMap's member reference other propertyMap's member.
       */
      'MemberExpression[object.type="ThisExpression"]'(node) {
        const properties = utils.iterateProperties(vueNodeMap, groups)

        for (const property of properties) {
          propertyMap[property.name] = {
            ...propertyMap[property.name],
            ...property,
            valueType: getValueType({ property, propertyMap })
          }
        }
      },

      /** @param {ThisExpression} node */
      'ThisExpression[parent.type="MemberExpression"][parent.parent.type="CallExpression"]'(
        node
      ) {
        if (node.parent.type !== 'MemberExpression') return
        if (node.parent.property.type !== 'Identifier') return

        const thisMember = node.parent.property.name

        if (!propertyMap[thisMember].valueType.type) return

        if (
          propertyMap[thisMember].groupName === 'computed' &&
          propertyMap[thisMember].valueType.type !== 'Function'
        ) {
          context.report({
            node: node.parent.parent,
            loc: node.parent.parent.loc,
            messageId: 'unexpected',
            data: {
              likeProperty: `this.${thisMember}`,
              likeMethod: `this.${thisMember}()`
            }
          })
        }
      }
    })
  }
}
