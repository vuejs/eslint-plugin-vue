/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import { pascalCase, kebabCase } from '../utils/casing.ts'

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow v-text / v-html on component',
      categories: ['vue2-essential', 'vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-v-text-v-html-on-component.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: {
              type: 'string'
            },
            uniqueItems: true
          },
          ignoreElementNamespaces: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      disallow:
        "Using {{directiveName}} on component may break component's content."
    }
  },
  create(context: RuleContext) {
    const options = context.options[0] || {}
    const allow = new Set<string>(options.allow)
    const ignoreElementNamespaces = options.ignoreElementNamespaces === true

    /**
     * Check whether the given node is an allowed component or not.
     * @param node The start tag node to check.
     */
    function isAllowedComponent(node: VElement): boolean {
      const componentName = node.rawName
      return (
        allow.has(componentName) ||
        allow.has(pascalCase(componentName)) ||
        allow.has(kebabCase(componentName))
      )
    }

    /**
     * Verify for v-text and v-html directive
     */
    function verify(node: VDirective) {
      const element = node.parent.parent
      if (
        utils.isCustomComponent(element, ignoreElementNamespaces) &&
        !isAllowedComponent(element)
      ) {
        context.report({
          node,
          loc: node.loc,
          messageId: 'disallow',
          data: {
            directiveName: `v-${node.key.name.name}`
          }
        })
      }
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VAttribute[directive=true][key.name.name='text']": verify,
      "VAttribute[directive=true][key.name.name='html']": verify
    })
  }
}
