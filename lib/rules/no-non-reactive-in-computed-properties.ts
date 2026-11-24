/**
 * @author clean99
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'
import type {
  ComponentComputedProperty,
  VueObjectData
} from '../utils/index.ts'

const NON_REACTIVE_PROPERTIES = new Set(['$slots', '$refs'])

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow non-reactive component instance properties in computed properties',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-non-reactive-in-computed-properties.html'
    },
    fixable: null,
    schema: [],
    messages: {
      nonReactive:
        'Unexpected `{{name}}` in "{{key}}" computed property. `{{name}}` is not reactive, so the computed value will not update when it changes.'
    }
  },
  create(context: RuleContext) {
    const computedPropertiesMap = new Map<
      ObjectExpression,
      ComponentComputedProperty[]
    >()

    interface ScopeStack {
      upper: ScopeStack | null
      body: BlockStatement | Expression
    }
    let scopeStack: ScopeStack | null = null

    function findComputedProperty(info: VueObjectData) {
      if (!scopeStack) {
        return null
      }
      const body = scopeStack.body
      const computedProperties = computedPropertiesMap.get(info.node) || []
      return computedProperties.find((cp) => cp.value === body) || null
    }

    function verify(node: ESNode, name: string | null, info: VueObjectData) {
      if (!name || !NON_REACTIVE_PROPERTIES.has(name)) {
        return
      }
      const computedProperty = findComputedProperty(info)
      if (!computedProperty) {
        return
      }
      context.report({
        node,
        messageId: 'nonReactive',
        data: { name, key: computedProperty.key || 'Unknown' }
      })
    }

    return utils.defineVueVisitor(context, {
      onVueObjectEnter(node) {
        computedPropertiesMap.set(node, utils.getComputedProperties(node))
      },
      ':function'(
        node: FunctionExpression | ArrowFunctionExpression | FunctionDeclaration
      ) {
        scopeStack = { upper: scopeStack, body: node.body }
      },
      ':function:exit'() {
        scopeStack &&= scopeStack.upper
      },
      MemberExpression(node, info) {
        if (!utils.isThis(node.object, context)) {
          return
        }
        verify(node, utils.getStaticPropertyName(node), info)
      },
      VariableDeclarator(node, info) {
        if (
          node.id.type !== 'ObjectPattern' ||
          !node.init ||
          !utils.isThis(node.init, context)
        ) {
          return
        }
        for (const property of node.id.properties) {
          if (property.type === 'Property') {
            verify(property.key, utils.getStaticPropertyName(property), info)
          }
        }
      }
    })
  }
}
