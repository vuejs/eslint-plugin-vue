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

interface ReservedNames {
  htmlNames: ReadonlySet<string>
  allNames: ReadonlySet<string>
}

const reservedNamesCache = new Map<string, ReservedNames>()

// The sets depend only on these options, so build them once instead of for every linted file
function getReservedNames(
  shouldDisallowVueBuiltInComponents: boolean,
  shouldDisallowVue3BuiltInComponents: boolean,
  isHtmlElementCaseSensitive: boolean
): ReservedNames {
  const cacheKey = `${shouldDisallowVueBuiltInComponents}:${shouldDisallowVue3BuiltInComponents}:${isHtmlElementCaseSensitive}`
  const cached = reservedNamesCache.get(cacheKey)
  if (cached) return cached

  const htmlNames = new Set<string>(htmlElements)
  const otherNames = new Set<string>([
    ...deprecatedHtmlElements,
    ...kebabCaseElements,
    ...svgElements
  ])

  if (!isHtmlElementCaseSensitive) {
    addAll(htmlNames, htmlElements.map(capitalize))
    addAll(otherNames, [
      ...deprecatedHtmlElements.map(capitalize),
      ...kebabCaseElements.map(pascalCase),
      ...svgElements.filter(isLowercase).map(capitalize)
    ])
  }

  const allNames = new Set<string>([
    ...htmlNames,
    ...(shouldDisallowVueBuiltInComponents
      ? utils.VUE2_BUILTIN_COMPONENT_NAMES
      : []),
    ...(shouldDisallowVue3BuiltInComponents
      ? utils.VUE3_BUILTIN_COMPONENT_NAMES
      : []),
    ...otherNames
  ])

  const reservedNames = { htmlNames, allNames }
  reservedNamesCache.set(cacheKey, reservedNames)
  return reservedNames
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
    const shouldDisallowVueBuiltInComponents =
      options.disallowVueBuiltInComponents === true
    const shouldDisallowVue3BuiltInComponents =
      options.disallowVue3BuiltInComponents === true
    const isHtmlElementCaseSensitive = options.htmlElementCaseSensitive === true

    const { htmlNames, allNames: reservedNames } = getReservedNames(
      shouldDisallowVueBuiltInComponents,
      shouldDisallowVue3BuiltInComponents,
      isHtmlElementCaseSensitive
    )

    function getMessageId(name: string): string {
      if (htmlNames.has(name)) return 'reservedInHtml'
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
        name = String(node.value)
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
        if (node.arguments.length !== 2) {
          return
        }

        const argument = node.arguments[0]

        if (canVerify(argument)) {
          reportIfInvalid(argument)
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
