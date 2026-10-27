/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.js'
import deprecatedHtmlElements from '../utils/deprecated-html-elements.json' with { type: 'json' }

const DEPRECATED_HTML_ELEMENTS = new Set<string>(deprecatedHtmlElements)

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using deprecated HTML elements',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-deprecated-html-elements.html'
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: 'The `<{{name}}>` element is deprecated.'
    }
  },
  create(context: RuleContext): RuleListener {
    return utils.defineTemplateBodyVisitor(context, {
      VElement(node: VElement) {
        if (
          !utils.isHtmlElementNode(node) ||
          !DEPRECATED_HTML_ELEMENTS.has(node.rawName) ||
          // `is`, `:is` and `v-is` make the element render a component
          utils.hasAttribute(node, 'is') ||
          utils.hasDirective(node, 'bind', 'is') ||
          utils.hasDirective(node, 'is')
        ) {
          return
        }
        context.report({
          node: node.startTag,
          messageId: 'unexpected',
          data: { name: node.rawName }
        })
      }
    })
  }
}
