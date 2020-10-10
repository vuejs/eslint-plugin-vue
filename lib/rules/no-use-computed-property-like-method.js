/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const {
  defineVueVisitor,
  getComputedProperties,
  getComponentProps,

  isProperty,
  getStaticPropertyName,
  unwrapTypes
} = require('../utils')

/**
 * @typedef {import('../utils').ComponentComputedProperty} ComponentComputedProperty
 * @typedef {import('../utils').ComponentObjectProp} ComponentObjectProp
 */

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/**
 * @typedef { {key: string | null, value: BlockStatement | null} } ComponentMethodProperty
 */

/**
 * Get all method by looking at all component's properties
 * @param {ObjectExpression} componentObject Object with component definition
 * @return {ComponentMethodProperty[]} Array of methods in format: [{key: String, value: ASTNode}]
 */
const getMethodProperties = (componentObject) => {
  const methodsNode = componentObject.properties.find(
    /**
     * @param {ESNode} property
     * @returns {property is (Property & { key: Identifier & {name: 'method'}, value: ObjectExpression })}
     */
    (property) => {
      return (
        property.type === 'Property' &&
        property.key.type === 'Identifier' &&
        property.key.name === 'methods' &&
        property.value.type === 'ObjectExpression'
      )
    }
  )

  if (!methodsNode) {
    return []
  }

  return methodsNode.value.properties.filter(isProperty).map((method) => {
    const key = getStaticPropertyName(method)
    /** @type {Expression} */
    const propValue = unwrapTypes(method.value)
    /** @type {BlockStatement | null} */
    let value = null

    if (propValue.type === 'FunctionExpression') {
      value = propValue.body
    } else if (propValue.type === 'ObjectExpression') {
      const get = propValue.properties.find(
        /**
         * @param {ESNode} p
         * @returns { p is (Property & { value: FunctionExpression }) }
         */
        (p) =>
          p.type === 'Property' &&
          p.key.type === 'Identifier' &&
          p.key.name === 'get' &&
          p.value.type === 'FunctionExpression'
      )
      value = get ? get.value.body : null
    }

    return { key, value }
  })
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce',
      categories: undefined,
      url:
        'https://eslint.vuejs.org/rules/no-use-computed-property-like-method.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'Unexpected multiple objects. Merge objects.'
    }
  },
  /** @param {RuleContext} context */
  create(context) {
    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {BlockStatement | Expression} body
     */
    /** @type {Map<ObjectExpression, ComponentComputedProperty[]>} */
    const computedPropertiesMap = new Map()

    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {BlockStatement | Expression} body
     */
    /** @type {Map<ObjectExpression, ComponentObjectProp[]>} */
    const propsMap = new Map()

    /**
     * @typedef {object} ScopeStack
     * @property {ScopeStack | null} upper
     * @property {BlockStatement | Expression} body
     */
    /** @type {Map<ObjectExpression, ComponentMthodProperty[]>} */
    const methodPropertiesMap = new Map()
    return defineVueVisitor(context, {
      onVueObjectEnter(node) {
        computedPropertiesMap.set(node, getComputedProperties(node))
        propsMap.set(node, getComponentProps(node))
        methodPropertiesMap.set(node, getMethodProperties(node))
      },

      /** @param {MemberExpression} node */
      'MemberExpression[object.type="ThisExpression"]'(
        node,
        { node: vueNode }
      ) {
        if (node.property.type !== 'Identifier') return

        const computedProperties = computedPropertiesMap
          .get(vueNode)
          .map((item) => item.key)

        const methodProperties = methodPropertiesMap
          .get(vueNode)
          .map((item) => item.key)

        /**
         * propsProperties that excluded when type is array, and props property type is `Function`
         */
        const propsProperties = propsMap.get(vueNode).reduce((acc, current) => {
          // ignore `props: ['props1', 'props2']`
          if (current.type === 'array') return acc

          current.value.properties.reduce((accProperties, property) => {
            // ignore `type: Function`
            if (
              property.key.name === 'type' &&
              property.value.name === 'Function'
            )
              return accProperties

            accProperties.push(property)
            return accProperties
          }, [])

          acc.push(current.propName)
          return acc
        }, [])

        const properties = [
          ...computedProperties,
          ...methodProperties,
          ...propsProperties
        ]

        console.log(properties)

        // if (!computedProperties.includes(node.property.name)) return

        // context.report({
        //   node: node.property,
        //   loc: node.property.loc,
        //   messageId:
        // })
      }
    })
  }
}
