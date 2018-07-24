/**
 * @fileoverview disallow usage of strings as prop types
 * @author Michał Sajnóg
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const message = '"type" property of prop should be of Object type, not String'

module.exports = {
  meta: {
    docs: {
      description: 'disallow usage of strings as prop types',
      category: undefined,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.5.0/docs/rules/no-string-prop-type.md'
    },
    fixable: 'code',  // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create: function (context) {
    const fix = node => fixer => {
      return fixer.replaceText(node, node.value)
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
        if (p.value.type === 'Literal') {
          context.report({
            node: p.value,
            message,
            fix: fix(p.value)
          })
        } else if (p.value.type === 'ArrayExpression') {
          const wrongNode = p.value.elements.find(prop => prop.type === 'Literal')

          if (wrongNode) {
            context.report({
              node: wrongNode,
              message,
              fix: fix(wrongNode)
            })
          }
        } else if (p.value.type === 'ObjectExpression') {
          const wrongNode = p.value.properties.find(prop =>
            prop.type === 'Property' &&
            prop.key.name === 'type' &&
            prop.value.type === 'Literal'
          )

          if (wrongNode) {
            context.report({
              node: wrongNode.value,
              message
            })
          }
        }
      })
    })
  }
}
