/**
 * @fileoverview disallow mutation component props
 * @author 2018 Armano
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow mutation of component props',
      category: undefined,
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v5.0.0-beta.5/docs/rules/no-mutating-props.md'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      // fill in your schema
    ]
  },

  create (context) {
    let mutatedNodes = []
    let props = []
    let scope = {
      parent: null,
      nodes: []
    }

    function checkForMutations () {
      if (mutatedNodes.length > 0) {
        for (const prop of props) {
          for (const node of mutatedNodes) {
            if (prop === node.name) {
              context.report({
                node: node.node,
                message: 'Unexpected mutation of "{{key}}" prop.',
                data: {
                  key: node.name
                }
              })
            }
          }
        }
      }
      mutatedNodes = []
    }

    function isInScope (name) {
      return scope.nodes.some(node => node.name === name)
    }

    function checkExpression (node, expression) {
      if (expression[0] === 'this') {
        mutatedNodes.push({ name: expression[1], node })
      } else {
        const name = expression[0]
        if (!isInScope(name)) {
          mutatedNodes.push({ name, node })
        }
      }
    }

    function checkTemplateProperty (node) {
      if (node.type === 'MemberExpression') {
        checkExpression(node, utils.parseMemberExpression(node))
      } else if (node.type === 'Identifier') {
        if (!isInScope(node.name)) {
          mutatedNodes.push({
            name: node.name,
            node
          })
        }
      }
    }

    return Object.assign({},
      {
        // this.xxx <=|+=|-=>
        'AssignmentExpression' (node) {
          if (node.left.type !== 'MemberExpression') return
          const expression = utils.parseMemberExpression(node.left)
          if (expression[0] === 'this') {
            mutatedNodes.push({
              name: expression[1],
              node
            })
          }
        },
        // this.xxx <++|-->
        'UpdateExpression > MemberExpression' (node) {
          const expression = utils.parseMemberExpression(node)
          if (expression[0] === 'this') {
            mutatedNodes.push({
              name: expression[1],
              node
            })
          }
        },
        // this.xxx.func()
        'CallExpression' (node) {
          const expression = utils.parseMemberOrCallExpression(node)
          const code = expression.join('.').replace(/\.\[/g, '[')
          const MUTATION_REGEX = /(this.)((?!(concat|slice|map|filter)\().)[^\)]*((push|pop|shift|unshift|reverse|splice|sort|copyWithin|fill)\()/g

          if (MUTATION_REGEX.test(code)) {
            if (expression[0] === 'this') {
              mutatedNodes.push({
                name: expression[1],
                node
              })
            }
          }
        }
      },
      utils.executeOnVue(context, (obj) => {
        props = utils.getComponentProps(obj)
          .filter(cp => cp.key)
          .map(cp => utils.getStaticPropertyName(cp.key))
        checkForMutations()
      }),

      utils.defineTemplateBodyVisitor(context, {
        VElement (node) {
          scope = {
            parent: scope,
            nodes: scope.nodes.slice() // make copy
          }

          if (node.variables) {
            for (const variable of node.variables) {
              scope.nodes.push(variable.id)
            }
          }
        },
        'VElement:exit' () {
          scope = scope.parent
        },
        'VExpressionContainer AssignmentExpression' (node) {
          checkTemplateProperty(node.left)
        },
        // this.xxx <++|-->
        'VExpressionContainer UpdateExpression' (node) {
          checkTemplateProperty(node.argument)
        },
        // this.xxx.func()
        'VExpressionContainer CallExpression' (node) {
          const expression = utils.parseMemberOrCallExpression(node)
          const code = expression.join('.').replace(/\.\[/g, '[')
          const MUTATION_REGEX = /(this.)?((?!(concat|slice|map|filter)\().)[^\)]*((push|pop|shift|unshift|reverse|splice|sort|copyWithin|fill)\()/g

          if (MUTATION_REGEX.test(code)) {
            checkExpression(node, expression)
          }
        },
        "VAttribute[directive=true][key.name='model'] VExpressionContainer" (node) {
          checkTemplateProperty(node.expression)
        },
        "VElement[name='template']:exit" () {
          checkForMutations()
        }
      })
    )
  }
}
