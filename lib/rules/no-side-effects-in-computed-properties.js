/**
 * @fileoverview Don't introduce side effects in computed properties
 * @author Michał Sajnóg
 */
'use strict'

const utils = require('../utils')

function parseMemberExpression (node) {
  const members = []
  let memberExpression

  if (node.type === 'MemberExpression') {
    memberExpression = node

    while (memberExpression.type === 'MemberExpression') {
      if (memberExpression.property.type === 'Identifier') {
        members.push(memberExpression.property.name)
      }
      memberExpression = memberExpression.object
    }

    if (memberExpression.type === 'ThisExpression') {
      members.push('this')
    } else if (memberExpression.type === 'Identifier') {
      members.push(memberExpression.name)
    }
  }

  return members.reverse()
}

function getComputedProperties (componentProperties) {
  const computedPropertiesNode = componentProperties
    .filter(p =>
      p.key.type === 'Identifier' &&
      p.key.name === 'computed' &&
      p.value.type === 'ObjectExpression'
    )[0]

  if (!computedPropertiesNode) { return [] }

  const computedProperties = computedPropertiesNode.value.properties

  return computedProperties.map(cp => {
    const key = cp.key.name
    let value

    if (cp.value.type === 'FunctionExpression') {
      value = cp.value.body
    } else if (cp.value.type === 'ObjectExpression') {
      value = cp.value.properties
        .filter(p =>
          p.key.type === 'Identifier' &&
          p.key.name === 'get' &&
          p.value.type === 'FunctionExpression'
        )
        .map(p => p.value.body)[0]
    }

    return { key, value }
  })
}

function create (context) {
  const forbiddenNodes = []

  return Object.assign({},
    {
      // this.xxx <=|+=|-=>
      'AssignmentExpression > MemberExpression' (node) {
        if (parseMemberExpression(node)[0] === 'this') {
          forbiddenNodes.push(node)
        }
      },
      // this.xxx <++|-->
      'UpdateExpression > MemberExpression' (node) {
        if (parseMemberExpression(node)[0] === 'this') {
          forbiddenNodes.push(node)
        }
      },
      // this.xxx.func()
      'CallExpression' (node) {
        const code = context.getSourceCode().getText(node)
        const MUTATION_REGEX = /(this.)((?!(concat|slice)\().)*((push|pop|shift|unshift|reverse|splice|sort|copyWithin|fill)\()/g

        if (MUTATION_REGEX.test(code)) {
          forbiddenNodes.push(node)
        }
      }
    },
    utils.executeOnVueComponent(context, (properties) => {
      const computedProperties = getComputedProperties(properties)

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
