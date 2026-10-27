/**
 * @author  Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import type { VueObjectData } from '../utils/index.js'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow accessing computed properties in `data`',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-computed-properties-in-data.html'
    },
    fixable: null,
    schema: [],
    messages: {
      cannotBeUsed:
        'The computed property cannot be used in `data()` because it is before initialization.'
    }
  },
  create(context: RuleContext) {
    const contextMap = new Map<
      ObjectExpression,
      {
        data: FunctionExpression | ArrowFunctionExpression
        computedNames: Set<string>
      }
    >()

    interface ScopeStack {
      upper: ScopeStack | null
      node: FunctionExpression | FunctionDeclaration | ArrowFunctionExpression
    }
    let scopeStack: ScopeStack | null = null

    return utils.compositingVisitors(
      {
        ':function'(
          node:
            FunctionExpression | FunctionDeclaration | ArrowFunctionExpression
        ) {
          scopeStack = {
            upper: scopeStack,
            node
          }
        },
        ':function:exit'() {
          scopeStack &&= scopeStack.upper
        }
      },
      utils.defineVueVisitor(context, {
        onVueObjectEnter(node) {
          const dataProperty = utils.findProperty(node, 'data')
          if (
            !dataProperty ||
            (dataProperty.value.type !== 'FunctionExpression' &&
              dataProperty.value.type !== 'ArrowFunctionExpression')
          ) {
            return
          }
          const computedNames = new Set<string>()
          const computedProperties = utils.iterateProperties(
            node,
            new Set(['computed'])
          )
          for (const computed of computedProperties) {
            computedNames.add(computed.name)
          }

          contextMap.set(node, { data: dataProperty.value, computedNames })
        },
        MemberExpression(node: MemberExpression, vueData: VueObjectData) {
          if (!scopeStack || !utils.isThis(node.object, context)) {
            return
          }
          const ctx = contextMap.get(vueData.node)
          if (!ctx || ctx.data !== scopeStack.node) {
            return
          }
          const name = utils.getStaticPropertyName(node)
          if (!name || !ctx.computedNames.has(name)) {
            return
          }
          context.report({
            node,
            messageId: 'cannotBeUsed'
          })
        }
      })
    )
  }
}
