/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'
const { findVariable } = require('eslint-utils')
const utils = require('../utils')

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow destructuring of `props` passed to `setup`',
      category: undefined,
      url: 'https://eslint.vuejs.org/rules/no-setup-props-destructure.html'
    },
    fixable: null,
    schema: [],
    messages: {
      forbidden: 'Destructuring the `props` will cause the value to lose reactivity.'
    }
  },
  create (context) {
    const forbiddenNodes = new Map()

    function addForbiddenNode (property, node) {
      let list = forbiddenNodes.get(property)
      if (!list) {
        list = []
        forbiddenNodes.set(property, list)
      }
      list.push(node)
    }

    let scopeStack = { upper: null, functionNode: null }

    let setupProperty = null
    let setupFunction = null
    let propsParam = null
    let propsReferenceIds = null

    return Object.assign(
      {
        'Property[value.type=/^(Arrow)?FunctionExpression$/]' (node) {
          if (utils.getStaticPropertyName(node) !== 'setup') {
            return
          }
          const param = node.value.params[0]
          if (!param) {
            // no arguments
            return
          }
          if (param.type === 'RestElement') {
            // cannot check
            return
          }
          if (param.type === 'ArrayPattern' || param.type === 'ObjectPattern') {
            addForbiddenNode(node, param)
            return
          }

          setupProperty = node
          setupFunction = node.value
          propsParam = node.value.params[0]
        },
        ':function' (node) {
          scopeStack = { upper: scopeStack, functionNode: node }
        },
        ':function>*' (node) {
          if (propsParam !== node) {
            return
          }
          const variable = findVariable(context.getScope(), node)
          if (!variable) {
            return
          }
          propsReferenceIds = new Set()
          for (const reference of variable.references) {
            if (!reference.isRead()) {
              continue
            }

            propsReferenceIds.add(reference.identifier)
          }
        },
        'VariableDeclarator > :matches(ArrayPattern, ObjectPattern)' (
          node
        ) {
          if (scopeStack.functionNode !== setupFunction) {
            return
          }
          const varNode = node.parent
          if (propsReferenceIds.has(varNode.init)) {
            addForbiddenNode(setupProperty, node)
          }
        },
        'AssignmentExpression > :matches(ArrayPattern, ObjectPattern)' (
          node
        ) {
          if (scopeStack.functionNode !== setupFunction) {
            return
          }
          const assignNode = node.parent
          if (propsReferenceIds.has(assignNode.right)) {
            addForbiddenNode(setupProperty, node)
          }
        },
        ':function:exit' (node) {
          scopeStack = scopeStack.upper

          if (setupFunction === node) {
            setupProperty = null
            setupFunction = null
            propsParam = null
            propsReferenceIds = null
          }
        }
      },
      utils.executeOnVue(context, obj => {
        const nodesList = obj.properties
          .map(item => forbiddenNodes.get(item))
          .filter(nodes => !!nodes)
        for (const nodes of nodesList) {
          for (const node of nodes) {
            context.report({
              node,
              messageId: 'forbidden'
            })
          }
        }
      })
    )
  }
}
