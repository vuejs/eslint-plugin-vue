/**
 * @fileoverview Ensure computed properties are not used in the data()
 * @author IWANABETHATGUY
 */
'use strict'

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
const utils = require('../utils')
function topOfStack (stack) {
  console.assert(Array.isArray(stack))
  return stack[stack.length - 1]
}
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'require computed properties are not used in the data()',
      categories: ['strongly-recommended'],
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
    let targetObjectExpression
    const memberExpressionMap = Object.create(null)
    const scopeStack = []
    // if data is a function, should reference its scope, other wise should be undefined
    let dataPropertyScope
    return {

      ObjectExpression (node) {
        if (!dataAstNode) {
          dataAstNode = node.properties.find(
            p =>
              p.type === 'Property' &&
              p.key.type === 'Identifier' &&
              p.key.name === 'data'
          )
          if (dataAstNode) {
            targetObjectExpression = node
            if (dataAstNode.value.type === 'FunctionExpression') {
              dataPropertyScope = dataAstNode.value
              scopeStack.push(dataPropertyScope)
            }
          }
        }
      },
      ':function' (node) {
        scopeStack.push(node)
      },
      ':function:exit' (node) {
        scopeStack.pop()
      },
      'Property:exit' (node) {
        if (node === dataAstNode) {
          dataAstNode = undefined
        }
      },
      MemberExpression (node) {
        if (dataAstNode && dataPropertyScope === topOfStack(scopeStack)) {
          // a memberExpression `like this.a.c.d` -> when traverse to c.d we can got the the full name -> this.a.c.d
          const fullName = utils.parseMemberExpression(node).slice(0, 2).join('.')
          if (memberExpressionMap[fullName]) {
            // check if parent node in this array, if true ignore this node, such as `{a: this.a.c.d}`, this traverse function visit order is `this.a.c.d` -> `a.c.d` -> `c.d`
            const hasParentNodeInArray = memberExpressionMap[fullName].some(nodeInMap => node.parent === nodeInMap)
            if (!hasParentNodeInArray) {
              memberExpressionMap[fullName] = [...memberExpressionMap[fullName], node]
            }
          } else {
            memberExpressionMap[fullName] = [node]
          }
        }
      },
      ...utils.executeOnVue(context, obj => {
        // check if targetObjectExpression is Vue component
        if (targetObjectExpression !== obj) {
          return
        }
        const computedPropertyNameList = utils.getComputedProperties(obj).map(item => `this.${item.key}`)
        Object.keys(memberExpressionMap).forEach(fullName => {
          const index = computedPropertyNameList.findIndex(name => fullName.startsWith(name))
          if (index !== -1) {
            memberExpressionMap[fullName].forEach(memberExpressionNode => {
              context.report({
                node: memberExpressionNode,
                message: `Computed property '{{name}}' can't use in data property.`,
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
