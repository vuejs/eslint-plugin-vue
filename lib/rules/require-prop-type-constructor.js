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

const isForbiddenType = nodeType => forbiddenTypes.indexOf(nodeType) > -1

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

    const checkPropertyNode = (p) => {
      if (isForbiddenType(p.value.type)) {
        context.report({
          node: p.value,
          message,
          data: {
            name: utils.getStaticPropertyName(p.key)
          },
          fix: fix(p.value)
        })
      } else if (p.value.type === 'ArrayExpression') {
        p.value.elements
          .filter(prop => isForbiddenType(prop.type))
          .forEach(prop => context.report({
            node: prop,
            message,
            data: {
              name: utils.getStaticPropertyName(p.key)
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

      node.value.properties.forEach(p => {
        if (isForbiddenType(p.value.type) || p.value.type === 'ArrayExpression') {
          checkPropertyNode(p)
        } else if (p.value.type === 'ObjectExpression') {
          const typeProperty = p.value.properties.find(prop =>
            prop.type === 'Property' &&
            prop.key.name === 'type'
          )

          if (!typeProperty) return

          checkPropertyNode(typeProperty)
        }
      })
    })
  }
}
