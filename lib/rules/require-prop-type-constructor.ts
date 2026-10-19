/**
 * @fileoverview require prop type to be a constructor
 * @author Michał Sajnóg
 */
import type { ComponentProp } from '../utils/index.js'
import utils from '../utils/index.js'

const forbiddenTypes = new Set([
  'Literal',
  'TemplateLiteral',
  'BinaryExpression',
  'UpdateExpression'
])

function isForbiddenType(node: ESNode) {
  return (
    forbiddenTypes.has(node.type) &&
    !(node.type === 'Literal' && node.value == null && !node.bigint)
  )
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require prop type to be a constructor',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/require-prop-type-constructor.html'
    },
    fixable: 'code',
    schema: [],
    messages: {
      propTypeConstructor: 'The "{{name}}" property should be a constructor.'
    }
  },

  create(context: RuleContext) {
    function checkPropertyNode(propName: string, node: ESNode) {
      const nodes: ESNode[] =
        node.type === 'ArrayExpression'
          ? node.elements.filter(utils.isDef)
          : [node]

      for (const prop of nodes) {
        if (!isForbiddenType(prop)) continue

        context.report({
          node: prop,
          messageId: 'propTypeConstructor',
          data: {
            name: propName
          },
          fix: (fixer) => {
            if (prop.type === 'Literal' || prop.type === 'TemplateLiteral') {
              const newText = utils.getStringLiteralValue(prop, true)

              if (newText) {
                return fixer.replaceText(prop, newText)
              }
            }
            return null
          }
        })
      }
    }

    function verifyProps(props: ComponentProp[]) {
      for (const prop of props) {
        if (prop.type !== 'object' || prop.propName == null) {
          continue
        }
        if (
          isForbiddenType(prop.value) ||
          prop.value.type === 'ArrayExpression'
        ) {
          checkPropertyNode(prop.propName, prop.value)
        } else if (prop.value.type === 'ObjectExpression') {
          const typeProperty = utils.findProperty(prop.value, 'type')

          if (!typeProperty) continue

          checkPropertyNode(prop.propName, typeProperty.value)
        }
      }
    }

    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(_node, props) {
          verifyProps(props)
        }
      }),
      utils.executeOnVueComponent(context, (obj) => {
        verifyProps(utils.getComponentPropsFromOptions(obj))
      })
    )
  }
}
