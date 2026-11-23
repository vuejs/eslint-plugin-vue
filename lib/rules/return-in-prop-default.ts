/**
 * @author clean99
 * See LICENSE file in root directory for full license.
 */
import type { ComponentProp } from '../utils/index.ts'
import utils from '../utils/index.ts'

const NON_FUNCTION_TYPES = new Set([
  'String',
  'Number',
  'Boolean',
  'Object',
  'Array',
  'Symbol',
  'BigInt'
])

function isNonFunctionType(value: Expression): boolean {
  const node = utils.skipTSAsExpression(value)
  return node.type === 'ArrayExpression'
    ? node.elements.length > 0 &&
        node.elements.every(
          (element) =>
            element?.type === 'Identifier' &&
            NON_FUNCTION_TYPES.has(element.name)
        )
    : node.type === 'Identifier' && NON_FUNCTION_TYPES.has(node.name)
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'enforce that a return statement is present in prop default factories',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/return-in-prop-default.html'
    },
    fixable: null,
    schema: [],
    messages: {
      expectedReturn:
        'Expected to return a value in the default factory for "{{name}}" prop.'
    }
  },
  create(context: RuleContext) {
    const factories = new Map<
      FunctionExpression | ArrowFunctionExpression,
      string
    >()

    function processProps(props: ComponentProp[]) {
      for (const prop of props) {
        if (
          prop.type !== 'object' ||
          prop.value.type !== 'ObjectExpression' ||
          prop.value.properties.some(
            (property) =>
              property.type === 'SpreadElement' ||
              utils.getStaticPropertyName(property) === null
          )
        ) {
          continue
        }
        const type = utils.findProperty(prop.value, 'type')
        const defaultValue = utils.findProperty(prop.value, 'default')
        if (
          !type ||
          !defaultValue ||
          defaultValue.kind !== 'init' ||
          !isNonFunctionType(type.value)
        ) {
          continue
        }
        const value = utils.skipTSAsExpression(defaultValue.value)
        if (
          (value.type === 'FunctionExpression' ||
            value.type === 'ArrowFunctionExpression') &&
          !value.async &&
          !value.generator
        ) {
          factories.set(
            value,
            prop.propName ?? `[${context.sourceCode.getText(prop.node.key)}]`
          )
        }
      }
    }

    return utils.compositingVisitors(
      utils.defineVueVisitor(context, {
        onVueObjectEnter(obj) {
          processProps(utils.getComponentPropsFromOptions(obj))
        }
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(_node, props) {
          processProps(props)
        }
      }),
      utils.executeOnFunctionsWithoutReturn(context, false, (node) => {
        if (node.type === 'FunctionDeclaration') return
        const name = factories.get(node)
        if (name !== undefined) {
          context.report({ node, messageId: 'expectedReturn', data: { name } })
        }
      })
    )
  }
}
