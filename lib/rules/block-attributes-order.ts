/**
 * @author Asish Kumar
 * See LICENSE file in root directory for full license.
 */
import type { VElementSelector } from '../utils/selector.ts'
import utils from '../utils/index.ts'
import { toRegExp } from '../utils/regexp.ts'
import { parseSelector } from '../utils/selector.ts'

interface UserOrderOption {
  element: string
  order: (string | string[])[]
}

interface OrderOption {
  selector: VElementSelector
  matchers: ((name: string) => boolean)[]
}

const DEFAULT_ORDER: readonly UserOrderOption[] = Object.freeze([
  {
    element: 'script',
    order: ['setup', ['!lang', '!generic', '!src'], 'lang', 'generic', 'src']
  },
  {
    element: 'template',
    order: ['functional', ['!lang', '!src'], 'lang', 'src']
  },
  {
    element: 'style',
    order: ['scoped', 'module', ['!lang', '!src'], 'lang', 'src']
  },
  {
    element: '*',
    order: [['!lang', '!src'], 'lang', 'src']
  }
])

/**
 * Compiles a list of patterns into a function that checks an attribute name.
 *
 * Patterns are evaluated in order. A pattern starting with `!` excludes the
 * names it matches from the names matched so far. If the first pattern is
 * negative, the list starts out matching every name.
 */
function compileMatcher(patterns: string[]): (name: string) => boolean {
  const rules = patterns.map((pattern) => {
    const negative = pattern.startsWith('!')
    const regexp = toRegExp(negative ? pattern.slice(1) : pattern, {
      remove: 'g'
    })
    return { negative, test: (name: string) => regexp.test(name) }
  })

  return (name) => {
    let result = rules[0].negative
    for (const { negative, test } of rules) {
      if (result === !negative) {
        // Matching this pattern would not change the result.
        continue
      }
      if (test(name)) {
        result = !negative
      }
    }
    return result
  }
}

function normalizeOrderOption(
  option: UserOrderOption,
  context: RuleContext
): OrderOption {
  return {
    selector: parseSelector(option.element, context),
    matchers: option.order.map((patterns) =>
      compileMatcher(Array.isArray(patterns) ? patterns : [patterns])
    )
  }
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce order of attributes on top-level blocks',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/block-attributes-order.html'
    },
    fixable: 'code',
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            element: { type: 'string' },
            order: {
              type: 'array',
              items: {
                oneOf: [
                  { type: 'string' },
                  {
                    type: 'array',
                    items: { type: 'string' },
                    minItems: 1,
                    uniqueItems: true
                  }
                ]
              },
              minItems: 1,
              uniqueItems: true
            }
          },
          required: ['element', 'order'],
          additionalProperties: false
        },
        minItems: 1
      }
    ],
    messages: {
      expectedOrder: `Attribute "{{currentNode}}" should go before "{{prevNode}}".`
    }
  },
  create(context: RuleContext): RuleListener {
    const sourceCode = context.sourceCode
    const userOrderOptions: readonly UserOrderOption[] =
      context.options[0] || DEFAULT_ORDER
    const orderOptions = userOrderOptions.map((option) =>
      normalizeOrderOption(option, context)
    )
    const documentFragment =
      sourceCode.parserServices.getDocumentFragment &&
      sourceCode.parserServices.getDocumentFragment()

    function getTopLevelHTMLElements(): VElement[] {
      return documentFragment
        ? documentFragment.children.filter(utils.isVElement)
        : []
    }

    /**
     * Returns the position of the attribute in the order.
     * Attributes that match no item in the order go after all others.
     */
    function getPosition(
      attribute: VAttribute | VDirective,
      orderOption: OrderOption
    ): number {
      const name = sourceCode.getText(attribute.key)
      const position = orderOption.matchers.findIndex((matcher) =>
        matcher(name)
      )
      return position === -1 ? orderOption.matchers.length : position
    }

    function reportIssue(
      node: VAttribute | VDirective,
      previousNode: VAttribute | VDirective
    ) {
      const attributes = node.parent.attributes
      const previousNodes = attributes.slice(
        attributes.indexOf(previousNode),
        attributes.indexOf(node)
      )
      // Move the attribute before `previousNode`,
      // keeping the order of the attributes in between.
      const moveNodes = [node, ...previousNodes]

      context.report({
        node,
        messageId: 'expectedOrder',
        data: {
          currentNode: sourceCode.getText(node.key),
          prevNode: sourceCode.getText(previousNode.key)
        },
        fix: (fixer) =>
          moveNodes.map((moveNode, index) =>
            fixer.replaceText(
              previousNodes[index] || node,
              sourceCode.getText(moveNode)
            )
          )
      })
    }

    function verifyElement(element: VElement, orderOption: OrderOption) {
      const attributes = element.startTag.attributes
      if (attributes.length <= 1) {
        return
      }

      let previousNode = attributes[0]
      let previousPosition = getPosition(previousNode, orderOption)
      for (const attribute of attributes.slice(1)) {
        const position = getPosition(attribute, orderOption)
        if (previousPosition <= position) {
          previousNode = attribute
          previousPosition = position
        } else {
          reportIssue(attribute, previousNode)
        }
      }
    }

    return {
      Program(node) {
        if (utils.hasInvalidEOF(node)) {
          return
        }
        for (const element of getTopLevelHTMLElements()) {
          const orderOption = orderOptions.find((option) =>
            option.selector.test(element)
          )
          if (orderOption) {
            verifyElement(element, orderOption)
          }
        }
      }
    }
  }
}
