/**
 * @fileoverview disallow the use of reserved names in component definitions
 * @author Jake Hassel <https://github.com/shadskii>
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')

const htmlElements = require('../utils/html-elements.json')
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

const isLowercase = (word) => (/[a-z]/.test(word))
const capitalizeFirstLetter = (word) => word[0].toUpperCase() + word.substring(1, word.length)

const RESERVED_NAMES = new Set(
  [
    ...kebabCaseElements,
    ...kebabCaseElements.map(casing.pascalCase),
    ...htmlElements,
    ...htmlElements.map(capitalizeFirstLetter),
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
      category: 'essential',
      url: 'https://eslint.vuejs.org/rules/no-reserved-component-names.html'
    },
    fixable: null,
    schema: []
  },

  create (context) {
    function canVerify (node) {
      return node.type === 'Literal' || (
        node.type === 'TemplateLiteral' &&
        node.expressions.length === 0 &&
        node.quasis.length === 1
      )
    }

    function reportIfInvalid (node) {
      let nodeValue
      if (node.type === 'TemplateLiteral') {
        const quasis = node.quasis[0]
        nodeValue = quasis.value.cooked
      } else {
        nodeValue = node.value
      }
      if (RESERVED_NAMES.has(nodeValue)) {
        context.report({
          node: node,
          message: 'Name "{{value}}" is reserved.',
          data: {
            value: nodeValue
          }
        })
      }
    }

    return Object.assign({},
      {
        "CallExpression > MemberExpression > Identifier[name='component']" (node) {
          const parent = node.parent.parent
          const calleeObject = utils.unwrapTypes(parent.callee.object)

          if (calleeObject.type === 'Identifier' &&
              calleeObject.name === 'Vue' &&
              parent.arguments &&
              parent.arguments.length === 2
          ) {
            const argument = parent.arguments[0]

            if (canVerify(argument)) {
              reportIfInvalid(argument)
            }
          }
        }
      },
      utils.executeOnVue(context, (obj) => {
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
