/**
 * @author clean99
 * See LICENSE file in root directory for full license.
 */
import type { ComponentProp } from '../utils/index.ts'
import utils from '../utils/index.ts'

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'require an explicit required option in object-form props',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/require-explicit-prop-requiredness.html'
    },
    fixable: null,
    schema: [],
    messages: {
      missingRequired:
        'Prop "{{name}}" should explicitly define its required option.'
    }
  },
  create(context: RuleContext) {
    function checkProperty(prop: ComponentProp) {
      if (
        prop.type !== 'object' ||
        prop.value.type !== 'ObjectExpression' ||
        utils.findProperty(prop.value, 'required') ||
        prop.value.properties.some(
          (property) =>
            property.type === 'SpreadElement' ||
            utils.getStaticPropertyName(property) == null
        )
      ) {
        return
      }

      context.report({
        node: prop.node,
        messageId: 'missingRequired',
        data: {
          name:
            prop.propName ?? `[${context.sourceCode.getText(prop.node.key)}]`
        }
      })
    }

    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(_node, props) {
          for (const prop of props) {
            checkProperty(prop)
          }
        }
      }),
      utils.executeOnVue(context, (obj) => {
        for (const prop of utils.getComponentPropsFromOptions(obj)) {
          checkProperty(prop)
        }
      })
    )
  }
}
