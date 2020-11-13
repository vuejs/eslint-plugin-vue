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
 * @typedef {import('../utils').ComponentComputedProperty} ComponentComputedProperty
 * @typedef {import('../utils').ComponentObjectProp} ComponentObjectProp
 * @typedef {import('../utils').ComponentPropertyData} ComponentPropertyData
 * @typedef {import('../utils').ComponentObjectPropertyData} ComponentObjectPropertyData
 *
 * @typedef {{[key: string]: ComponentPropertyData & { valueType: { type: string } }}} ProprtyMap
 */
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function replacer(key, value) {
  if (key === 'parent') {
    return undefined
  }
  if (key === 'errors' && Array.isArray(value)) {
    return value.map((e) => ({
      message: e.message,
      index: e.index,
      lineNumber: e.lineNumber,
      column: e.column
    }))
  }
  return value
}

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
 *
 * @param {Expression | Super} objectOrCallee
 * @returns {string | null}
 */
// const getThisMember = (objectOrCallee) => {
//   if (objectOrCallee.type === 'MemberExpression') {
//     if (objectOrCallee.object.type === 'Identifier') return null

//     if (
//       objectOrCallee.object.type === 'ThisExpression' &&
//       objectOrCallee.property.type === 'Identifier'
//     )
//       return objectOrCallee.property.name

//     if (objectOrCallee.object.type === 'MemberExpression')
//       getThisMember(objectOrCallee.object)
//   }

//   if (objectOrCallee.type === 'CallExpression') {
//     if (objectOrCallee.callee.type === 'Identifier') return null

//     getThisMember(objectOrCallee.callee)
//   }
// }

/**
 * Get return type of property.
 * @param {{ property: ComponentPropertyData, propertyMap: ProprtyMap }} args
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

        // if (property.groupName === 'computed') {
        //   if (
        //     propertyMap &&
        //     propertyMap[property.name] &&
        //     returnStatement.argument
        //   ) {
        //     const thisMember = getThisMember(returnStatement.argument)
        //     return {
        //       type: propertyMap[thisMember].valueType.type
        //     }
        //   }
        // }

        /**
         * TODO: consider this.xxx.xxx().xxx.xxx().xxx().....
         */
        if (property.groupName === 'computed') {
          if (
            propertyMap &&
            propertyMap[property.name] &&
            returnStatement.argument &&
            returnStatement.argument.type === 'MemberExpression' &&
            returnStatement.argument.property.type === 'Identifier'
          )
            return {
              type:
                propertyMap[returnStatement.argument.property.name].valueType
                  .type
            }

          if (
            propertyMap &&
            propertyMap[property.name] &&
            returnStatement.argument &&
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

    return {
      type: null
    }
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
    let nodeMap = {}

    return utils.defineVueVisitor(context, {
      onVueObjectEnter(node) {
        nodeMap = node
        const properties = utils.iterateProperties(node, groups)

        for (const property of properties) {
          propertyMap[property.name] = {
            ...propertyMap[property.name],
            ...property,
            valueType: getValueType({ property })
          }
        }
      },

      /** @param {MemberExpression} node */
      'MemberExpression[object.type="ThisExpression"]'(node) {
        if (node.parent.type !== 'CallExpression') return
        if (node.property.type !== 'Identifier') return

        const properties = utils.iterateProperties(nodeMap, groups)

        for (const property of properties) {
          propertyMap[property.name] = {
            ...propertyMap[property.name],
            ...property,
            valueType: getValueType({ property, propertyMap })
          }
        }

        const thisMember = node.property.name

        if (!propertyMap[thisMember].valueType.type) return

        if (
          propertyMap[thisMember].groupName === 'computed' &&
          propertyMap[thisMember].valueType.type !== 'Function'
        ) {
          context.report({
            node,
            loc: node.loc,
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
