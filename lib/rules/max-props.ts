/**
 * @author kevsommer Kevin Sommer
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'
import type { ComponentProp } from '../utils/index.ts'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce maximum number of props in Vue component',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/max-props.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          maxProps: {
            type: 'integer',
            minimum: 1
          }
        },
        additionalProperties: false,
        minProperties: 1
      }
    ],
    messages: {
      tooManyProps:
        'Component has too many props ({{propCount}}). Maximum allowed is {{limit}}.'
    }
  },
  create(context: RuleContext) {
    const option: Record<string, number> = context.options[0] || {}

    function checkMaxNumberOfProps(
      props: ComponentProp[],
      node: CallExpression | Property
    ) {
      const uniqueProps = new Set(props.map((prop) => prop.propName))
      const propCount = uniqueProps.size
      if (propCount > option.maxProps && props[0].node) {
        context.report({
          node,
          messageId: 'tooManyProps',
          data: {
            propCount,
            limit: option.maxProps
          }
        })
      }
    }

    return utils.compositingVisitors(
      utils.executeOnVue(context, (node) => {
        const propsNode = node.properties.find(
          (p): p is Property =>
            p.type === 'Property' && utils.getStaticPropertyName(p) === 'props'
        )

        if (!propsNode) return

        checkMaxNumberOfProps(
          utils.getComponentPropsFromOptions(node),
          propsNode
        )
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(node, props) {
          checkMaxNumberOfProps(props, node)
        }
      })
    )
  }
}
