/**
 * @fileoverview Don't introduce side effects in computed properties
 * @author Michał Sajnóg
 */
'use strict'

const utils = require('../utils')

function create (context) {
  const forbiddenNodes = []

  return Object.assign({},
    {
      // this.xxx <=|+=|-=>
      'AssignmentExpression > MemberExpression' (node) {
        if (utils.parseMemberExpression(node)[0] === 'this') {
          forbiddenNodes.push(node)
        }
      },
      // this.xxx <++|-->
      'UpdateExpression > MemberExpression' (node) {
        if (utils.parseMemberExpression(node)[0] === 'this') {
          forbiddenNodes.push(node)
        }
      },
      // this.xxx.func()
      'CallExpression' (node) {
        const code = context.getSourceCode().getText(node)
        const MUTATION_REGEX = /(this.)((?!(concat|slice|map|filter)\().)*((push|pop|shift|unshift|reverse|splice|sort|copyWithin|fill)\()/g

        if (MUTATION_REGEX.test(code)) {
          forbiddenNodes.push(node)
        }
      }
    },
    utils.executeOnVueComponent(context, (obj) => {
      const computedProperties = utils.getComputedProperties(obj)

      computedProperties.forEach(cp => {
        forbiddenNodes.forEach(node => {
          if (
            node.loc.start.line >= cp.value.loc.start.line &&
            node.loc.end.line <= cp.value.loc.end.line
          ) {
            context.report({
              node: node,
              message: `Unexpected side effect in "${cp.key}" computed property.`
            })
          }
        })
      })
    })
  )
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  create,
  meta: {
    docs: {
      description: 'Don\'t introduce side effects in computed properties',
      category: 'Best Practices',
      recommended: false
    },
    fixable: null,
    schema: []
  }
}
