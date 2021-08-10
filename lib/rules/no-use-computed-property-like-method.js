/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
const eslintUtils = require('eslint-utils')
const utils = require('../utils')

/**
 * @typedef {import('../utils').ComponentPropertyData} ComponentPropertyData
 * @typedef {import('../utils').ComponentObjectPropertyData} ComponentObjectPropertyData
 * @typedef {import('../utils').GroupName} GroupName
 *
 * @typedef {{[key: string]: ComponentPropertyData & { valueType: { type: string | null } }}} PropertyMap
 */
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/**
 * Get type of props item.
 * Can't consider array props like: props: {propsA: [String, Number, Function]}
 * @param {ComponentObjectPropertyData} property
 * @return {string | null}
 *
 * @example
 * props: {
 *   propA: String, // => String
 *   propB: {
 *     type: Number // => String
 *   },
 * }
 */
const getComponentPropsType = (property) => {
  /**
   * Check basic props `props: { basicProps: ... }`
   */
  if (property.property.value.type === 'Identifier') {
    return property.property.value.name
  }
  /**
   * Check object props `props: { objectProps: {...} }`
   */
  if (property.property.value.type === 'ObjectExpression') {
    const typeProperty = utils.findProperty(property.property.value, 'type')
    if (typeProperty == null) return null

    if (typeProperty.value.type === 'Identifier') return typeProperty.value.name
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
 * @param {{ property: ComponentPropertyData, propertyMap?: PropertyMap }} args
 * @returns {{type: string | null | 'ReturnStatementHasNotArgument'}}
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
        type: getComponentPropsType(property)
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
          return {
            type: null
          }

        if (returnStatement.argument === null)
          return {
            type: 'ReturnStatementHasNotArgument'
          }

        if (
          property.groupName === 'computed' &&
          propertyMap &&
          propertyMap[property.name] &&
          returnStatement.argument
        ) {
          if (
            returnStatement.argument.type === 'MemberExpression' &&
            returnStatement.argument.object.type === 'ThisExpression' &&
            returnStatement.argument.property.type === 'Identifier'
          )
            return {
              type: propertyMap[returnStatement.argument.property.name]
                .valueType.type
            }

          if (
            returnStatement.argument.type === 'CallExpression' &&
            returnStatement.argument.callee.type === 'MemberExpression' &&
            returnStatement.argument.callee.object.type === 'ThisExpression' &&
            returnStatement.argument.callee.property.type === 'Identifier'
          )
            return {
              type: propertyMap[returnStatement.argument.callee.property.name]
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

        const evaluated = eslintUtils.getStaticValue(returnStatement.argument)

        if (evaluated) {
          return {
            type: getPrototypeType(evaluated.value)
          }
        }
      }
    }

    const evaluated = eslintUtils.getStaticValue(property.property.value)

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

/**
 * @param {Set<GroupName>} groups
 * @param {ObjectExpression} vueNodeMap
 * @param {PropertyMap} propertyMap
 */
const addPropertyMap = (groups, vueNodeMap, propertyMap) => {
  const properties = utils.iterateProperties(vueNodeMap, groups)
  for (const property of properties) {
    propertyMap[property.name] = {
      ...propertyMap[property.name],
      ...property,
      valueType: getValueType({ property, propertyMap })
    }
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow use computed property like method',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-use-computed-property-like-method.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Use {{ likeProperty }} instead of {{ likeMethod }}.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /** @type {GroupName[]} */
    const GROUP_NAMES = ['data', 'props', 'computed', 'methods']
    const groups = new Set(GROUP_NAMES)

    /** @type {PropertyMap} */
    const propertyMap = Object.create(null)

    return utils.defineVueVisitor(context, {
      onVueObjectEnter(node) {
        const properties = utils.iterateProperties(node, groups)

        for (const property of properties) {
          propertyMap[property.name] = {
            ...propertyMap[property.name],
            ...property,
            valueType: getValueType({ property })
          }
        }
      },

      /** @param {ThisExpression} node */
      'CallExpression > MemberExpression > ThisExpression'(
        node,
        { node: vueNode }
      ) {
        addPropertyMap(groups, vueNode, propertyMap)

        if (node.parent.type !== 'MemberExpression') return
        if (node.parent.property.type !== 'Identifier') return
        if (node.parent.parent.type !== 'CallExpression') return
        if (node.parent.parent.callee.type !== 'MemberExpression') return
        if (!Object.is(node.parent.parent.callee, node.parent)) return

        const thisMember = node.parent.property.name

        if (
          !propertyMap[thisMember] ||
          !propertyMap[thisMember].valueType ||
          !propertyMap[thisMember].valueType.type
        )
          return

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
