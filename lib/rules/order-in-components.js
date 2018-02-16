/**
 * @fileoverview Keep order of properties in components
 * @author Michał Sajnóg
 */
'use strict'

const utils = require('../utils')

const defaultOrder = [
  'el',
  'name',
  'parent',
  'functional',
  ['delimiters', 'comments'],
  ['components', 'directives', 'filters'],
  'extends',
  'mixins',
  'inheritAttrs',
  'model',
  ['props', 'propsData'],
  'data',
  'computed',
  'watch',
  'LIFECYCLE_HOOKS',
  'methods',
  ['template', 'render'],
  'renderError'
]

const groups = {
  LIFECYCLE_HOOKS: [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'activated',
    'deactivated',
    'beforeDestroy',
    'destroyed'
  ]
}

function getOrderMap (order) {
  const orderMap = new Map()

  order.forEach((property, i) => {
    if (Array.isArray(property)) {
      property.forEach(p => orderMap.set(p, i))
    } else {
      orderMap.set(property, i)
    }
  })

  return orderMap
}

function isComma (node) {
  return node.type === 'Punctuator' && node.value === ','
}

const ARITHMETIC_OPERATORS = ['+', '-', '*', '/', '%', '**']
const BITWISE_OPERATORS = ['&', '|', '^', '~', '<<', '>>', '>>>']
const COMPARISON_OPERATORS = ['==', '!=', '===', '!==', '>', '>=', '<', '<=']
const LOGICAL_OPERATORS = ['&&', '||']
const RELATIONAL_OPERATORS = ['in', 'instanceof']
const ALL_OPERATORS = [].concat(
  ARITHMETIC_OPERATORS,
  BITWISE_OPERATORS,
  COMPARISON_OPERATORS,
  LOGICAL_OPERATORS,
  RELATIONAL_OPERATORS
)

/*
 * Result `true` if the node is sure that there are no side effects
 *
 * Currently known side effects types
 *
 * node.type === 'CallExpression'
 * node.type === 'NewExpression'
 * node.type === 'UpdateExpression'
 * node.type === 'AssignmentExpression'
 * node.type === 'TaggedTemplateExpression'
 * node.type === 'UnaryExpression' && node.operator === 'delete'
 *
 * @param  {Token} node target node
 * @returns {Boolean} no side effects
 */
function isNotSideEffectsNode (node) {
  if (node.type === 'FunctionExpression' ||
    node.type === 'Identifier' ||
    node.type === 'Literal' ||
    // es2015
    node.type === 'ArrowFunctionExpression' ||
    node.type === 'TemplateElement'
  ) {
    return true
  }
  if (node.type === 'Property') {
    return [node.value, node.key].every(isNotSideEffectsNode)
  }
  if (node.type === 'ObjectExpression') {
    return node.properties.every(isNotSideEffectsNode)
  }
  if (node.type === 'ArrayExpression') {
    return node.elements.every(isNotSideEffectsNode)
  }
  if (node.type === 'UnaryExpression' && ['!', '~', '+', '-', 'typeof'].indexOf(node.operator) > -1) {
    return isNotSideEffectsNode(node.argument)
  }
  if (/^(?:Binary|Logical)Expression$/.test(node.type) && ALL_OPERATORS.indexOf(node.operator) > -1) {
    return [node.left, node.right].every(isNotSideEffectsNode)
  }
  if (node.type === 'MemberExpression') {
    return isNotSideEffectsNode(node.object)
  }
  if (node.type === 'ConditionalExpression') {
    return [node.test, node.consequent, node.alternate].every(isNotSideEffectsNode)
  }
  // es2015
  if (node.type === 'SpreadElement') {
    return isNotSideEffectsNode(node.argument)
  }
  if (node.type === 'TemplateLiteral') {
    return [].concat(node.quasis, node.expressions).every(isNotSideEffectsNode)
  }

  // Can not be sure that a node has no side effects
  return false
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'enforce order of properties in components',
      category: 'recommended',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.2.2/docs/rules/order-in-components.md'
    },
    fixable: 'code', // null or "code" or "whitespace"
    schema: [
      {
        type: 'object',
        properties: {
          order: {
            type: 'array'
          }
        },
        additionalProperties: false
      }
    ]
  },

  create (context) {
    const options = context.options[0] || {}
    const order = options.order || defaultOrder
    const extendedOrder = order.map(property => groups[property] || property)
    const orderMap = getOrderMap(extendedOrder)
    const sourceCode = context.getSourceCode()

    function checkOrder (propertiesNodes, orderMap) {
      const properties = propertiesNodes
        .filter(property => property.type === 'Property')
        .map(property => property.key)

      properties.forEach((property, i) => {
        const propertiesAbove = properties.slice(0, i)
        const unorderedProperties = propertiesAbove
          .filter(p => orderMap.get(p.name) > orderMap.get(property.name))
          .sort((p1, p2) => orderMap.get(p1.name) > orderMap.get(p2.name))

        const firstUnorderedProperty = unorderedProperties[0]

        if (firstUnorderedProperty) {
          const line = firstUnorderedProperty.loc.start.line
          context.report({
            node: property,
            message: `The "{{name}}" property should be above the "{{firstUnorderedPropertyName}}" property on line {{line}}.`,
            data: {
              name: property.name,
              firstUnorderedPropertyName: firstUnorderedProperty.name,
              line
            },
            fix (fixer) {
              const propertyNode = property.parent
              const firstUnorderedPropertyNode = firstUnorderedProperty.parent
              const hasSideEffectsPossibility = propertiesNodes
                .slice(
                  propertiesNodes.indexOf(firstUnorderedPropertyNode),
                  propertiesNodes.indexOf(propertyNode) + 1
                )
                .some((property) => !isNotSideEffectsNode(property))
              if (hasSideEffectsPossibility) {
                return undefined
              }
              const comma = sourceCode.getTokenAfter(propertyNode)
              const hasAfterComma = isComma(comma)

              const codeStart = sourceCode.getTokenBefore(propertyNode).range[1] // to include comments
              const codeEnd = hasAfterComma ? comma.range[1] : propertyNode.range[1]

              const propertyCode = sourceCode.text.slice(codeStart, codeEnd) + (hasAfterComma ? '' : ',')
              const insertTarget = sourceCode.getTokenBefore(firstUnorderedPropertyNode)
              // If we can upgrade requirements to `eslint@>4.1.0`, this code can be replaced by:
              // return [
              //   fixer.removeRange([codeStart, codeEnd]),
              //   fixer.insertTextAfter(insertTarget, propertyCode)
              // ]
              const insertStart = insertTarget.range[1]
              const newCode = propertyCode + sourceCode.text.slice(insertStart, codeStart)
              return fixer.replaceTextRange([insertStart, codeEnd], newCode)
            }
          })
        }
      })
    }

    return utils.executeOnVue(context, (obj) => {
      checkOrder(obj.properties, orderMap)
    })
  }
}
