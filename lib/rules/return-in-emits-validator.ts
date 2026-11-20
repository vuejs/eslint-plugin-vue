/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import type { ComponentEmit, ComponentObjectEmit } from '../utils/index.ts'
import utils from '../utils/index.ts'

/**
 * Checks if the given node value is falsy.
 */
function isFalsy(node: Expression): boolean {
  if (node.type === 'Literal') {
    if (node.bigint) {
      return node.bigint === '0'
    }
    if (!node.value) {
      return true
    }
  }

  return (
    node.type === 'Identifier' &&
    (node.name === 'undefined' || node.name === 'NaN')
  )
}
export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce that a return statement is present in emits validator',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/return-in-emits-validator.html'
    },
    fixable: null,
    schema: [],
    messages: {
      expectedTrue:
        'Expected to return a true value in "{{name}}" emits validator.',
      expectedBoolean:
        'Expected to return a boolean value in "{{name}}" emits validator.'
    }
  },
  create(context: RuleContext) {
    const emitsValidators: ComponentObjectEmit[] = []

    interface ScopeStack {
      upper: ScopeStack | null
      functionNode:
        FunctionExpression | FunctionDeclaration | ArrowFunctionExpression
      hasReturnValue: boolean
      possibleOfReturnTrue: boolean
    }
    let scopeStack: ScopeStack | null = null

    function processEmits(emits: ComponentEmit[]) {
      for (const emit of emits) {
        if (
          emit.type !== 'object' ||
          !emit.value ||
          (emit.value.type !== 'FunctionExpression' &&
            emit.value.type !== 'ArrowFunctionExpression')
        ) {
          continue
        }
        emitsValidators.push(emit)
      }
    }
    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefineEmitsEnter(_node, emits) {
          processEmits(emits)
        }
      }),
      utils.defineVueVisitor(context, {
        onVueObjectEnter(obj: ObjectExpression) {
          processEmits(utils.getComponentEmitsFromOptions(obj))
        }
      }),
      {
        ':function'(
          node:
            FunctionExpression | FunctionDeclaration | ArrowFunctionExpression
        ) {
          scopeStack = {
            upper: scopeStack,
            functionNode: node,
            hasReturnValue: false,
            possibleOfReturnTrue: false
          }

          if (!(node.type === 'ArrowFunctionExpression' && node.expression)) {
            return
          }

          scopeStack.hasReturnValue = true

          if (!isFalsy(node.body)) {
            scopeStack.possibleOfReturnTrue = true
          }
        },
        ReturnStatement(node: ReturnStatement) {
          if (!scopeStack || !node.argument) {
            return
          }

          scopeStack.hasReturnValue = true

          if (!isFalsy(node.argument)) {
            scopeStack.possibleOfReturnTrue = true
          }
        },
        ':function:exit'(
          node:
            FunctionExpression | FunctionDeclaration | ArrowFunctionExpression
        ) {
          if (scopeStack && !scopeStack.possibleOfReturnTrue) {
            const emits = emitsValidators.find((e) => e.value === node)
            if (emits) {
              context.report({
                node,
                messageId: scopeStack.hasReturnValue
                  ? 'expectedTrue'
                  : 'expectedBoolean',
                data: {
                  name: emits.emitName || 'Unknown'
                }
              })
            }
          }

          scopeStack &&= scopeStack.upper
        }
      }
    )
  }
}
