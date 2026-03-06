/**
 * @author Marton Csordas
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import { kebabCase, pascalCase } from '../utils/casing.ts'

function getComponentNames(context: RuleContext) {
  let components = ['RouterLink']

  if (context.options[0] && context.options[0].components) {
    components = context.options[0].components
  }

  return new Set(
    components.flatMap((component) => [
      kebabCase(component),
      pascalCase(component)
    ])
  )
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'disallow using deprecated `tag` property on `RouterLink` (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-router-link-tag-prop.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          components: {
            type: 'array',
            items: {
              type: 'string'
            },
            uniqueItems: true,
            minItems: 1
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      deprecated:
        "'tag' property on '{{element}}' component is deprecated. Use scoped slots instead."
    }
  },
  create(context: RuleContext) {
    const components = getComponentNames(context)

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node) {
        if (!components.has(node.rawName)) return

        let tagKey: VIdentifier | null = null

        const tagAttr = utils.getAttribute(node, 'tag')
        if (tagAttr) {
          tagKey = tagAttr.key
        } else {
          const directive = utils.getDirective(node, 'bind', 'tag')
          if (directive) {
            const arg = directive.key.argument
            if (arg && arg.type === 'VIdentifier') {
              tagKey = arg
            }
          }
        }

        if (tagKey) {
          context.report({
            node: tagKey,
            messageId: 'deprecated',
            data: {
              element: node.rawName
            }
          })
        }
      }
    })
  }
}
