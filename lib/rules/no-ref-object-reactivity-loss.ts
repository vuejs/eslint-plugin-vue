/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import {
  extractRefObjectReferences,
  extractReactiveVariableReferences
} from '../utils/ref-object-references.ts'

/**
 * Checks whether writing assigns a value to the given pattern.
 */
function isUpdate(node: Pattern | AssignmentProperty | Property): boolean {
  const parent = node.parent
  if (parent.type === 'UpdateExpression' && parent.argument === node) {
    // e.g. `pattern++`
    return true
  }
  if (parent.type === 'AssignmentExpression' && parent.left === node) {
    // e.g. `pattern = 42`
    return true
  }
  if (
    (parent.type === 'Property' && parent.value === node) ||
    parent.type === 'ArrayPattern' ||
    (parent.type === 'ObjectPattern' &&
      parent.properties.includes(node as any)) ||
    (parent.type === 'AssignmentPattern' && parent.left === node) ||
    parent.type === 'RestElement' ||
    (parent.type === 'MemberExpression' && parent.object === node)
  ) {
    return isUpdate(parent)
  }
  return false
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow usages of ref objects that can lead to loss of reactivity',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-ref-object-reactivity-loss.html'
    },
    fixable: null,
    schema: [],
    messages: {
      getValueInSameScope:
        'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
      getReactiveVariableInSameScope:
        'Getting a reactive variable in the same scope will cause the value to lose reactivity.'
    }
  },
  create(context: RuleContext): RuleListener {
    interface ScopeStack {
      upper: ScopeStack | null
      node:
        | Program
        | FunctionExpression
        | FunctionDeclaration
        | ArrowFunctionExpression
    }

    let scopeStack: ScopeStack = { upper: null, node: context.sourceCode.ast }
    const scopes = new Map<CallExpression, ScopeStack>()

    const refObjectReferences = extractRefObjectReferences(context)
    const reactiveVariableReferences =
      extractReactiveVariableReferences(context)

    /**
     * Verify the given ref object value. `refObj = ref(); refObj.value;`
     */
    function verifyRefObjectValue(node: Expression | Super | ObjectPattern) {
      const ref = refObjectReferences.get(node)
      if (!ref) {
        return
      }
      if (scopes.get(ref.define) !== scopeStack) {
        // Not in the same scope
        return
      }

      context.report({
        node,
        messageId: 'getValueInSameScope'
      })
    }

    /**
     * Verify the given reactive variable. `refVal = $ref(); refVal;`
     */
    function verifyReactiveVariable(node: Identifier) {
      const ref = reactiveVariableReferences.get(node)
      if (!ref || ref.escape) {
        return
      }
      if (scopes.get(ref.define) !== scopeStack) {
        // Not in the same scope
        return
      }

      context.report({
        node,
        messageId: 'getReactiveVariableInSameScope'
      })
    }

    return {
      ':function'(node) {
        scopeStack = { upper: scopeStack, node }
      },
      ':function:exit'() {
        scopeStack = scopeStack.upper || scopeStack
      },
      CallExpression(node) {
        scopes.set(node, scopeStack)
      },
      /**
       * Check for `refObj.value`.
       */
      'MemberExpression:exit'(node) {
        if (isUpdate(node)) {
          // e.g. `refObj.value = 42`, `refObj.value++`
          return
        }
        const name = utils.getStaticPropertyName(node)
        if (name !== 'value') {
          return
        }
        verifyRefObjectValue(node.object)
      },
      /**
       * Check for `{value} = refObj`.
       */
      'ObjectPattern:exit'(node) {
        const prop = utils.findAssignmentProperty(node, 'value')
        if (!prop) {
          return
        }
        verifyRefObjectValue(node)
      },
      /**
       * Check for reactive variable`.
       */
      'Identifier:exit'(node) {
        if (isUpdate(node)) {
          // e.g. `reactiveVariable = 42`, `reactiveVariable++`
          return
        }
        verifyReactiveVariable(node)
      }
    }
  }
}
