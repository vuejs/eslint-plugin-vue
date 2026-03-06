/**
 * @fileoverview disallow the use of reserved names in component definitions
 * @author Jake Hassel <https://github.com/shadskii>
 */
import utils from '../utils/index.js'
import { capitalize, pascalCase } from '../utils/casing.ts'
import htmlElements from '../utils/html-elements.json' with { type: 'json' }
import deprecatedHtmlElements from '../utils/deprecated-html-elements.json' with { type: 'json' }
import svgElements from '../utils/svg-elements.json' with { type: 'json' }

const kebabCaseElements = [
  'annotation-xml',
  'color-profile',
  'font-face',
  'font-face-src',
  'font-face-uri',
  'font-face-format',
  'font-face-name',
  'missing-glyph'
]

function isLowercase(word: string) {
  return /^[a-z]*$/.test(word)
}

function canVerify(
  node: Expression | SpreadElement
): node is Literal | TemplateLiteral {
  return (
    node.type === 'Literal' ||
    (node.type === 'TemplateLiteral' &&
      node.expressions.length === 0 &&
      node.quasis.length === 1)
  )
}

function addAll<T>(set: Set<T>, iterable: Iterable<T>) {
  for (const element of iterable) {
    set.add(element)
  }
}

export default {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'disallow the use of reserved names in component definitions',
      categories: ['vue3-essential', 'vue2-essential'],
      url: 'https://eslint.vuejs.org/rules/no-reserved-component-names.html'
    },
    fixable: null,
    schema: [
      {
        type: 'object',
        properties: {
          disallowVueBuiltInComponents: {
            type: 'boolean'
          },
          disallowVue3BuiltInComponents: {
            type: 'boolean'
          },
          htmlElementCaseSensitive: {
            type: 'boolean'
          }
        },
        additionalProperties: false
      }
    ],
    messages: {
      reserved: 'Name "{{name}}" is reserved.',
      reservedInHtml: 'Name "{{name}}" is reserved in HTML.',
      reservedInVue: 'Name "{{name}}" is reserved in Vue.js.',
      reservedInVue3: 'Name "{{name}}" is reserved in Vue.js 3.x.'
    }
  },
  create(context: RuleContext) {
    const options = context.options[0] || {}
    const disallowVueBuiltInComponents =
      options.disallowVueBuiltInComponents === true
    const disallowVue3BuiltInComponents =
      options.disallowVue3BuiltInComponents === true
    const htmlElementCaseSensitive = options.htmlElementCaseSensitive === true

    const RESERVED_NAMES_IN_HTML = new Set(htmlElements)
    const RESERVED_NAMES_IN_OTHERS = new Set([
      ...deprecatedHtmlElements,
      ...kebabCaseElements,
      ...svgElements
    ])

    if (!htmlElementCaseSensitive) {
      addAll(RESERVED_NAMES_IN_HTML, htmlElements.map(capitalize))
      addAll(RESERVED_NAMES_IN_OTHERS, [
        ...deprecatedHtmlElements.map(capitalize),
        ...kebabCaseElements.map(pascalCase),
        ...svgElements.filter(isLowercase).map(capitalize)
      ])
    }

    const reservedNames = new Set([
      ...RESERVED_NAMES_IN_HTML,
      ...(disallowVueBuiltInComponents
        ? utils.VUE2_BUILTIN_COMPONENT_NAMES
        : []),
      ...(disallowVue3BuiltInComponents
        ? utils.VUE3_BUILTIN_COMPONENT_NAMES
        : []),
      ...RESERVED_NAMES_IN_OTHERS
    ])

    function getMessageId(name: string): string {
      if (RESERVED_NAMES_IN_HTML.has(name)) return 'reservedInHtml'
      if (utils.VUE2_BUILTIN_COMPONENT_NAMES.has(name)) return 'reservedInVue'
      if (utils.VUE3_BUILTIN_COMPONENT_NAMES.has(name)) return 'reservedInVue3'
      return 'reserved'
    }

    function reportIfInvalid(node: Literal | TemplateLiteral) {
      let name
      if (node.type === 'TemplateLiteral') {
        const quasis = node.quasis[0]
        name = quasis.value.cooked
      } else {
        name = `${node.value}`
      }
      if (reservedNames.has(name)) {
        report(node, name)
      }
    }

    function report(node: ESNode, name: string) {
      context.report({
        node,
        messageId: getMessageId(name),
        data: {
          name
        }
      })
    }

    return utils.compositingVisitors(
      utils.executeOnCallVueComponent(context, (node) => {
        if (node.arguments.length === 2) {
          const argument = node.arguments[0]

          if (canVerify(argument)) {
            reportIfInvalid(argument)
          }
        }
      }),
      utils.executeOnVue(context, (obj) => {
        // Report if a component has been registered locally with a reserved name.
        for (const { node, name } of utils.getRegisteredComponents(obj)) {
          if (reservedNames.has(name)) {
            report(node, name)
          }
        }

        const node = utils.findProperty(obj, 'name')

        if (!node) return
        if (!canVerify(node.value)) return
        reportIfInvalid(node.value)
      }),
      utils.defineScriptSetupVisitor(context, {
        onDefineOptionsEnter(node) {
          if (node.arguments.length === 0) return
          const define = node.arguments[0]
          if (define.type !== 'ObjectExpression') return
          const nameNode = utils.findProperty(define, 'name')
          if (!nameNode) return
          if (!canVerify(nameNode.value)) return
          reportIfInvalid(nameNode.value)
        }
      })
    )
  }
}
