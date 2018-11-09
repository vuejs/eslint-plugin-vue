/**
 * @fileoverview require prop type to be a constructor
 * @author Michał Sajnóg
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const message = 'The "{{name}}" property should be a constructor.'

const forbiddenTypes = [
  'Literal',
  'TemplateLiteral',
  'BinaryExpression',
  'UpdateExpression'
]

const isForbiddenType = node => forbiddenTypes.indexOf(node.type) > -1 && node.raw !== 'null'

module.exports = {
  meta: {
    docs: {
      description: 'require prop type to be a constructor',
      category: 'essential',
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.3/docs/rules/require-prop-type-constructor.md'
    },
    fixable: 'code',  // or "code" or "whitespace"
    schema: []
  },

  create (context) {
    const fix = node => fixer => {
      if (node.type === 'Literal') {
        return fixer.replaceText(node, node.value)
      } else if (
        node.type === 'TemplateLiteral' &&
        node.expressions.length === 0 &&
        node.quasis.length === 1
      ) {
        return fixer.replaceText(node, node.quasis[0].value.cooked)
      }
    }

    const checkPropertyNode = (key, node) => {
      if (isForbiddenType(node)) {
        context.report({
          node: node,
          message,
          data: {
            name: utils.getStaticPropertyName(key)
          },
          fix: fix(node)
        })
      } else if (node.type === 'ArrayExpression') {
        node.elements
          .filter(prop => isForbiddenType(prop))
          .forEach(prop => context.report({
            node: prop,
            message,
            data: {
              name: utils.getStaticPropertyName(key)
            },
            fix: fix(prop)
          }))
      }
    }

    return utils.executeOnVueComponent(context, (obj) => {
      const node = obj.properties.find(p =>
        p.type === 'Property' &&
        p.key.type === 'Identifier' &&
        p.key.name === 'props' &&
        p.value.type === 'ObjectExpression'
      )

      if (!node) return

      node.value.properties
        .forEach(p => {
          const pValue = utils.unwrapTypes(p.value)
          if (isForbiddenType(pValue) || pValue.type === 'ArrayExpression') {
            checkPropertyNode(p.key, pValue)
          } else if (pValue.type === 'ObjectExpression') {
            const typeProperty = pValue.properties.find(prop =>
              prop.type === 'Property' &&
              prop.key.name === 'type'
            )

            if (!typeProperty) return

            checkPropertyNode(p.key, utils.unwrapTypes(typeProperty.value))
          }
        })
    })
  }
}
