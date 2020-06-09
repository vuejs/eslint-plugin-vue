/**
 * @fileoverview require the component to be directly exported
 * @author Hiroki Osame <hiroki.osame@gmail.com>
 */
'use strict'

const utils = require('../utils')

/**
 * @typedef {import('vue-eslint-parser').AST.ESLintExportDefaultDeclaration} ExportDefaultDeclaration
 * @typedef {import('vue-eslint-parser').AST.ESLintDeclaration} Declaration
 * @typedef {import('vue-eslint-parser').AST.ESLintExpression} Expression
 * @typedef {import('vue-eslint-parser').AST.ESLintReturnStatement} ReturnStatement
 *
 */
// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require the component to be directly exported',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-direct-export.html'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        type: 'object',
        properties: {
          disallowFunctionalComponentFunction: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ]
  },

  create(context) {
    const filePath = context.getFilename()
    if (!utils.isVueFile(filePath)) return {}

    const disallowFunctional = (context.options[0] || {})
      .disallowFunctionalComponentFunction

    let maybeVue3Functional
    let scopeStack = null

    return {
      /** @param {Declaration | Expression} node */
      'ExportDefaultDeclaration > *'(node) {
        if (node.type === 'ObjectExpression') {
          // OK
          return
        }
        if (!disallowFunctional) {
          if (node.type === 'ArrowFunctionExpression') {
            if (node.body.type !== 'BlockStatement') {
              // OK
              return
            }
            maybeVue3Functional = {
              body: node.body
            }
            return
          }
          if (
            node.type === 'FunctionExpression' ||
            node.type === 'FunctionDeclaration'
          ) {
            maybeVue3Functional = {
              body: node.body
            }
            return
          }
        }

        context.report({
          node: node.parent,
          message: `Expected the component literal to be directly exported.`
        })
      },
      ...(disallowFunctional
        ? {}
        : {
            ':function > BlockStatement'(node) {
              if (!maybeVue3Functional) {
                return
              }
              scopeStack = {
                upper: scopeStack,
                withinVue3FunctionalBody: maybeVue3Functional.body === node
              }
            },
            /** @param {ReturnStatement} node */
            ReturnStatement(node) {
              if (
                scopeStack &&
                scopeStack.withinVue3FunctionalBody &&
                node.argument
              ) {
                maybeVue3Functional.hasReturnArgument = true
              }
            },
            ':function > BlockStatement:exit'(node) {
              scopeStack = scopeStack && scopeStack.upper
            },
            /** @param {ExportDefaultDeclaration} node */
            'ExportDefaultDeclaration:exit'(node) {
              if (!maybeVue3Functional) {
                return
              }
              if (!maybeVue3Functional.hasReturnArgument) {
                context.report({
                  node,
                  message: `Expected the component literal to be directly exported.`
                })
              }
            }
          })
    }
  }
}
