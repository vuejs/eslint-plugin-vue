/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'

function isFunctionIdentifier(node: Expression | SpreadElement | null) {
  return !!node && node.type === 'Identifier' && node.name === 'Function'
}

function hasFunctionType(node: Expression): boolean {
  return (
    isFunctionIdentifier(node) ||
    (node.type === 'ArrayExpression' &&
      node.elements.some(isFunctionIdentifier))
  )
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow deprecated `this` access in props default function (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-props-default-this.html'
    },
    fixable: null,
    schema: [],
    messages: {
      deprecated:
        'Props default value factory functions no longer have access to `this`.'
    }
  },
  create(context: RuleContext) {
    interface ScopeStack {
      upper: ScopeStack | null
      node: FunctionExpression | FunctionDeclaration
      propDefault: boolean
    }
    const propsDefault = new Set<FunctionExpression>()
    let scopeStack: ScopeStack | null = null

    function onFunctionEnter(
      node: FunctionExpression | FunctionDeclaration | ArrowFunctionExpression
    ) {
      if (node.type === 'ArrowFunctionExpression') {
        return
      }
      if (scopeStack) {
        scopeStack = {
          upper: scopeStack,
          node,
          propDefault: false
        }
      } else if (node.type === 'FunctionExpression' && propsDefault.has(node)) {
        scopeStack = {
          upper: scopeStack,
          node,
          propDefault: true
        }
      }
    }

    function onFunctionExit(
      node: FunctionExpression | FunctionDeclaration | ArrowFunctionExpression
    ) {
      if (scopeStack && scopeStack.node === node) {
        scopeStack = scopeStack.upper
      }
    }

    return utils.defineVueVisitor(context, {
      onVueObjectEnter(node) {
        for (const prop of utils.getComponentPropsFromOptions(node)) {
          if (
            prop.type !== 'object' ||
            prop.value.type !== 'ObjectExpression'
          ) {
            continue
          }
          const def = utils.findProperty(prop.value, 'default')
          if (!def) {
            continue
          }
          const type = utils.findProperty(prop.value, 'type')
          if (
            (type && hasFunctionType(type.value)) ||
            def.value.type !== 'FunctionExpression'
          ) {
            continue
          }
          propsDefault.add(def.value)
        }
      },
      ':function': onFunctionEnter,
      ':function:exit': onFunctionExit,
      ThisExpression(node) {
        if (scopeStack && scopeStack.propDefault) {
          context.report({
            node,
            messageId: 'deprecated'
          })
        }
      }
    })
  }
}
