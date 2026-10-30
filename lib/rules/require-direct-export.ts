/**
 * @fileoverview require the component to be directly exported
 * @author Hiroki Osame <hiroki.osame@gmail.com>
 */
import utils from '../utils/index.ts'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require the component to be directly exported',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-direct-export.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          disallowFunctionalComponentFunction: { type: 'boolean' }
        },
        additionalProperties: false
      }
    ],
    messages: {
      expectedDirectExport:
        'Expected the component literal to be directly exported.'
    }
  },
  create(context: RuleContext) {
    const filePath = context.filename
    if (!utils.isVueFile(filePath)) return {}

    const disallowFunctional = (context.options[0] || {})
      .disallowFunctionalComponentFunction

    interface ScopeStack {
      upper: ScopeStack | null
      withinVue3FunctionalBody: boolean
    }

    let maybeVue3Functional: {
      body: BlockStatement
      hasReturnArgument: boolean
    }
    let scopeStack: ScopeStack | null = null

    return {
      'ExportDefaultDeclaration > *'(node: Declaration | Expression) {
        if (node.type === 'ObjectExpression') {
          // OK
          return
        }
        if (node.type === 'CallExpression') {
          const { callee } = node
          const [firstArg] = node.arguments
          if (
            firstArg &&
            firstArg.type === 'ObjectExpression' &&
            ((callee.type === 'Identifier' &&
              callee.name === 'defineComponent') ||
              (callee.type === 'MemberExpression' &&
                callee.object.type === 'Identifier' &&
                callee.object.name === 'Vue' &&
                callee.property.type === 'Identifier' &&
                callee.property.name === 'extend'))
          ) {
            return
          }
        }
        if (!disallowFunctional) {
          if (node.type === 'ArrowFunctionExpression') {
            if (node.body.type !== 'BlockStatement') {
              // OK
              return
            }
            maybeVue3Functional = {
              body: node.body,
              hasReturnArgument: false
            }
            return
          }
          if (
            node.type === 'FunctionExpression' ||
            node.type === 'FunctionDeclaration'
          ) {
            maybeVue3Functional = {
              body: node.body,
              hasReturnArgument: false
            }
            return
          }
        }

        context.report({
          node: node.parent,
          messageId: 'expectedDirectExport'
        })
      },
      ...(disallowFunctional
        ? {}
        : {
            ':function > BlockStatement'(node: BlockStatement) {
              if (!maybeVue3Functional) {
                return
              }
              scopeStack = {
                upper: scopeStack,
                withinVue3FunctionalBody: maybeVue3Functional.body === node
              }
            },
            ReturnStatement(node: ReturnStatement) {
              if (
                scopeStack &&
                scopeStack.withinVue3FunctionalBody &&
                node.argument
              ) {
                maybeVue3Functional.hasReturnArgument = true
              }
            },
            ':function > BlockStatement:exit'() {
              scopeStack &&= scopeStack.upper
            },
            'ExportDefaultDeclaration:exit'(node: ExportDefaultDeclaration) {
              if (!maybeVue3Functional) {
                return
              }
              if (!maybeVue3Functional.hasReturnArgument) {
                context.report({
                  node,
                  messageId: 'expectedDirectExport'
                })
              }
            }
          })
    }
  }
}
