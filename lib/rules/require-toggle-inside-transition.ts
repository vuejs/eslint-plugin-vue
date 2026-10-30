/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import utils from '../utils/index.ts'

function isValidBindAppear(vBindAppear: VDirective) {
  return (
    !vBindAppear.value?.expression ||
    vBindAppear.value.expression.type !== 'Literal' ||
    vBindAppear.value.expression.value !== false
  )
}

function createDirectiveList(directives: string[]) {
  let str = ''

  for (const [index, directive] of directives.entries()) {
    if (index === 0) {
      str += `\`v-${directive}\``
    } else if (index < directives.length - 1) {
      str += `, \`v-${directive}\``
    } else {
      str += ` or \`v-${directive}\``
    }
  }

  return str
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'require control the display of the content inside `<transition>`',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/require-toggle-inside-transition.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          additionalDirectives: {
            type: 'array',
            items: {
              type: 'string'
            },
            uniqueItems: true
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      expected:
        'The element inside `<transition>` is expected to have a {{allowedDirectives}} directive.'
    }
  },
  create(context: RuleContext) {
    const additionalDirectives: string[] =
      (context.options[0] && context.options[0].additionalDirectives) || []
    const allowedDirectives = ['if', 'show', ...additionalDirectives]
    const allowedDirectivesString = createDirectiveList(allowedDirectives)

    /**
     * Check if the given element has display control.
     */
    function verifyInsideElement(element: VElement) {
      if (utils.isCustomComponent(element)) {
        return
      }

      const parent = element.parent as VElement
      const vBindAppear = utils.getDirective(parent, 'bind', 'appear')
      if (
        utils.hasAttribute(parent, 'appear') ||
        (vBindAppear && isValidBindAppear(vBindAppear))
      ) {
        return
      }

      if (
        element.name !== 'slot' &&
        allowedDirectives.every(
          (directive) => !utils.hasDirective(element, directive)
        ) &&
        !utils.hasDirective(element, 'bind', 'key')
      ) {
        context.report({
          node: element.startTag,
          loc: element.startTag.loc,
          messageId: 'expected',
          data: {
            allowedDirectives: allowedDirectivesString
          }
        })
      }
    }

    return utils.defineTemplateBodyVisitor(context, {
      "VElement[name='transition'] > VElement"(node: VElement) {
        const child = node.parent.children.find(utils.isVElement)
        if (child !== node) {
          return
        }

        verifyInsideElement(node)
      }
    })
  }
}
