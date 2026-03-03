/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import { toRegExpGroupMatcher } from '../utils/regexp.ts'
import htmlElements from '../utils/html-elements.json' with { type: 'json' }
import deprecatedHtmlElements from '../utils/deprecated-html-elements.json' with { type: 'json' }
import svgElements from '../utils/svg-elements.json' with { type: 'json' }
import vue2builtinComponents from '../utils/vue2-builtin-components.js'
import vue3builtinComponents from '../utils/vue3-builtin-components.js'

const reservedNames = new Set([
  ...htmlElements,
  ...deprecatedHtmlElements,
  ...svgElements,
  ...vue2builtinComponents,
  ...vue3builtinComponents
])

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce using only specific component names',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/restricted-component-names.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          allow: {
            type: 'array',
            items: { type: 'string' },
            uniqueItems: true,
            additionalItems: false
          }
        }
      }
    ],
    messages: {
      invalidName: 'Component name "{{name}}" is not allowed.'
    }
  },
  create(context: RuleContext) {
    const options = context.options[0] || {}
    const isAllowed = toRegExpGroupMatcher(options.allow)

    function isAllowedTarget(name: string) {
      return reservedNames.has(name) || isAllowed(name)
    }

    return utils.defineTemplateBodyVisitor(context, {
      VElement(node) {
        const name = node.rawName
        if (isAllowedTarget(name)) {
          return
        }

        context.report({
          node,
          loc: node.loc,
          messageId: 'invalidName',
          data: {
            name
          }
        })
      }
    })
  }
}
