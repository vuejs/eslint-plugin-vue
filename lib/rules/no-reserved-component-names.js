/**
 * @fileoverview disallow the use of reserved names in component definitions
 * @author Jake Hassel <https://github.com/shadskii>
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')

const htmlElements = require('../utils/html-elements.json')
const deprecatedHtmlElements = require('../utils/deprecated-html-elements.json')
const svgElements = require('../utils/svg-elements.json')

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

// https://vuejs.org/v2/api/index.html#Built-In-Components
const vueBuiltInComponents = [
  'component',
  'transition',
  'transition-group',
  'keep-alive',
  'slot'
]

const vue3BuiltInComponents = [
  'teleport',
  'suspense'
]

const isLowercase = (word) => /^[a-z]*$/.test(word)
const capitalizeFirstLetter = (word) => word[0].toUpperCase() + word.substring(1, word.length)

const RESERVED_NAMES_IN_HTML = new Set([
  ...htmlElements,
  ...htmlElements.map(capitalizeFirstLetter)
])
const RESERVED_NAMES_IN_VUE = new Set([
  ...vueBuiltInComponents,
  ...vueBuiltInComponents.map(casing.pascalCase)
])
const RESERVED_NAMES_IN_VUE3 = new Set([
  ...RESERVED_NAMES_IN_VUE,
  ...vue3BuiltInComponents,
  ...vue3BuiltInComponents.map(casing.pascalCase)
])
const RESERVED_NAMES_IN_OTHERS = new Set([
  ...deprecatedHtmlElements,
  ...deprecatedHtmlElements.map(capitalizeFirstLetter),
  ...kebabCaseElements,
  ...kebabCaseElements.map(casing.pascalCase),
  ...svgElements,
  ...svgElements.filter(isLowercase).map(capitalizeFirstLetter)
])

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'disallow the use of reserved names in component definitions',
      categories: undefined,
      url: 'https://eslint.vuejs.org/rules/no-reserved-component-names.html'
    },
    fixable: null,
    schema: [{
      type: 'object',
      properties: {
        disallowVueBuiltInComponents: {
          type: 'boolean'
        },
        disallowVue3BuiltInComponents: {
          type: 'boolean'
        }
      }
    }],
    messages: {
      reserved: 'Name "{{name}}" is reserved.',
      reservedInHtml: 'Name "{{name}}" is reserved in HTML.',
      reservedInVue: 'Name "{{name}}" is reserved in Vue.js.',
      reservedInVue3: 'Name "{{name}}" is reserved in Vue.js 3.x.'
    }
  },

  create (context) {
    const options = context.options[0] || {}
    const disallowVueBuiltInComponents = options.disallowVueBuiltInComponents === true
    const disallowVue3BuiltInComponents = options.disallowVue3BuiltInComponents === true

    const reservedNames = new Set([
      ...RESERVED_NAMES_IN_HTML,
      ...(disallowVueBuiltInComponents ? RESERVED_NAMES_IN_VUE : []),
      ...(disallowVue3BuiltInComponents ? RESERVED_NAMES_IN_VUE3 : []),
      ...RESERVED_NAMES_IN_OTHERS
    ])

    function canVerify (node) {
      return node.type === 'Literal' || (
        node.type === 'TemplateLiteral' &&
        node.expressions.length === 0 &&
        node.quasis.length === 1
      )
    }

    function reportIfInvalid (node) {
      let name
      if (node.type === 'TemplateLiteral') {
        const quasis = node.quasis[0]
        name = quasis.value.cooked
      } else {
        name = node.value
      }
      if (reservedNames.has(name)) {
        report(node, name)
      }
    }

    function report (node, name) {
      context.report({
        node: node,
        messageId: RESERVED_NAMES_IN_HTML.has(name) ? 'reservedInHtml'
          : RESERVED_NAMES_IN_VUE.has(name) ? 'reservedInVue'
            : RESERVED_NAMES_IN_VUE3.has(name) ? 'reservedInVue3' : 'reserved',
        data: {
          name: name
        }
      })
    }

    return Object.assign({},
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
        utils.getRegisteredComponents(obj)
          .filter(({ name }) => reservedNames.has(name))
          .forEach(({ node, name }) => report(node, name))

        const node = obj.properties
          .find(item => (
            item.type === 'Property' &&
            item.key.name === 'name' &&
            canVerify(item.value)
          ))

        if (!node) return
        reportIfInvalid(node.value)
      })
    )
  }
}
