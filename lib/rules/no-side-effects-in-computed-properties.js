/**
 * @fileoverview Don't introduce side effects in computed properties
 * @author Michał Sajnóg
 */
'use strict'

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow side effects in computed properties',
      categories: ['vue3-essential', 'essential'],
      url: 'https://eslint.vuejs.org/rules/no-side-effects-in-computed-properties.html'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    const computedPropertiesMap = new Map()
    let scopeStack = { upper: null, body: null }

    function onFunctionEnter (node) {
      scopeStack = { upper: scopeStack, body: node.body }
    }

    function onFunctionExit () {
      scopeStack = scopeStack.upper
    }

    function verify (node, targetBody, computedProperties) {
      computedProperties.forEach(cp => {
        if (
          cp.value &&
          node.loc.start.line >= cp.value.loc.start.line &&
          node.loc.end.line <= cp.value.loc.end.line &&
          targetBody === cp.value
        ) {
          context.report({
            node: node,
            message: 'Unexpected side effect in "{{key}}" computed property.',
            data: { key: cp.key }
          })
        }
      })
    }

    return utils.defineVueVisitor(context, {
      ObjectExpression (node, { node: vueNode }) {
        if (node !== vueNode) {
          return
        }
        computedPropertiesMap.set(node, utils.getComputedProperties(node))
      },
      ':function': onFunctionEnter,
      ':function:exit': onFunctionExit,

      // this.xxx <=|+=|-=>
      'AssignmentExpression' (node, { node: vueNode }) {
        if (node.left.type !== 'MemberExpression') return
        if (utils.parseMemberExpression(node.left)[0] === 'this') {
          verify(node, scopeStack.body, computedPropertiesMap.get(vueNode))
        }
      },
      // this.xxx <++|-->
      'UpdateExpression > MemberExpression' (node, { node: vueNode }) {
        if (utils.parseMemberExpression(node)[0] === 'this') {
          verify(node, scopeStack.body, computedPropertiesMap.get(vueNode))
        }
      },
      // this.xxx.func()
      'CallExpression' (node, { node: vueNode }) {
        const code = utils.parseMemberOrCallExpression(node)
        const MUTATION_REGEX = /(this.)((?!(concat|slice|map|filter)\().)[^\)]*((push|pop|shift|unshift|reverse|splice|sort|copyWithin|fill)\()/g

        if (MUTATION_REGEX.test(code)) {
          verify(node, scopeStack.body, computedPropertiesMap.get(vueNode))
        }
      }
    }
    )
  }
}
