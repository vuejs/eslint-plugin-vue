/**
 * @fileoverview Ensure computed properties are not used in the data()
 * @author IWANABETHATGUY
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
const utils = require('../utils')
const visitor = require('eslint-visitor-keys')
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require computed properties are not used in the data()',
      category: '',
      recommended: false,
      url: 'https://eslint.vuejs.org/rules/no-computed-in-data.html'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create: function (context) {
    let dataAstNode
    const memberExpressionMap = Object.create(null)
    return {
      ObjectExpression (node) {
        if (!dataAstNode) {
          dataAstNode = node.properties.find(
            p =>
              p.type === 'Property' &&
              p.key.type === 'Identifier' &&
              p.key.name === 'data'
          )
        }
      },
      'Property:exit' (node) {
        if (node === dataAstNode) {
          dataAstNode = undefined
        }
      },
      MemberExpression (node) {
        if (dataAstNode) {
          // a memberExpression `like this.a.c.d` -> when traverse to c.d we can got the the full name -> this.a.c.d
          const fullName = utils.parseMemberExpression(node).join('.')
          if (memberExpressionMap[fullName]) {
            memberExpressionMap[fullName] = [...memberExpressionMap[fullName], node]
          } else {
            memberExpressionMap[fullName] = [node]
          }
        }
      },
      ...utils.executeOnVue(context, obj => {
        const computedPropertyNameList = utils.getComputedProperties(obj).map(item => `this.${item.key}`)
        Object.keys(memberExpressionMap).forEach(fullName => {
          let index = -1
          for (let i = 0, len = computedPropertyNameList.length; i < len; i++) {
            if (fullName.startsWith(computedPropertyNameList[i])) {
              index = i
              break
            }
          }
          if (index !== -1) {
            memberExpressionMap[fullName].forEach(memberExpressionNode => {
              context.report({
                node: memberExpressionNode,
                message: `The "{{name}}" is an computed data can't use in data property.`,
                data: {
                  name: computedPropertyNameList[index]
                }
              })
            })
          }
        })
      })
    }
  }
}
