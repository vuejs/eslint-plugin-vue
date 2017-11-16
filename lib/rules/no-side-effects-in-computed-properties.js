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
      'AssignmentExpression' (node) {
        if (node.left.type !== 'MemberExpression') return
        if (utils.parseMemberExpression(node.left)[0] === 'this') {
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
    utils.executeOnVue(context, (obj) => {
      const computedProperties = utils.getComputedProperties(obj)

      computedProperties.forEach(cp => {
        forbiddenNodes.forEach(node => {
          if (
            cp.value &&
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
      description: 'disallow side effects in computed properties',
      category: 'essential'
    },
    fixable: null,
    schema: []
  }
}
