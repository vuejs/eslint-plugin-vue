/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import type { ComponentProp } from '../utils/index.js'
import utils from '../utils/index.js'
import { kebabCase } from '../utils/casing.ts'

const RESERVED = {
  3: ['key', 'ref'],
  2: ['key', 'ref', 'is', 'slot', 'slot-scope', 'slotScope', 'class', 'style']
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow reserved names in props',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-reserved-props.html',
      defaultOptions: {
        vue2: [{ vueVersion: 2 }]
      }
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          vueVersion: {
            enum: [2, 3]
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      reserved:
        "'{{propName}}' is a reserved attribute and cannot be used as props."
    }
  },
  create(context: RuleContext) {
    const options = context.options[0] || {}
    const vueVersion: 2 | 3 = options.vueVersion || 3

    const reserved = new Set(RESERVED[vueVersion])

    function processProps(props: ComponentProp[]) {
      for (const prop of props) {
        if (prop.propName != null && reserved.has(prop.propName)) {
          context.report({
            node: prop.node,
            messageId: `reserved`,
            data: {
              propName: kebabCase(prop.propName)
            }
          })
        }
      }
    }

    return utils.compositingVisitors(
      utils.defineScriptSetupVisitor(context, {
        onDefinePropsEnter(_node, props) {
          processProps(props)
        }
      }),
      utils.executeOnVue(context, (obj) => {
        processProps(utils.getComponentPropsFromOptions(obj))
      })
    )
  }
}
