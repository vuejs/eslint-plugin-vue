/**
 * @fileoverview Requires specific casing for the Prop name in Vue components
 * @author Yu Kimura
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')
const allowedCaseOptions = ['camelCase', 'snake_case']

function canFixPropertyName (node, originalName) {
  // Can not fix of computed property names & shorthand
  if (node.computed || node.shorthand) {
    return false
  }
  const key = node.key
  // Can not fix of unknown types
  if (key.type !== 'Literal' && key.type !== 'Identifier') {
    return false
  }
  // Can fix of ASCII printable characters
  return originalName.match(/[ -~]+/)
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function create (context) {
  const options = context.options[0]
  const caseType = allowedCaseOptions.indexOf(options) !== -1 ? options : 'camelCase'
  const converter = casing.getConverter(caseType)

  // ----------------------------------------------------------------------
  // Public
  // ----------------------------------------------------------------------

  return utils.executeOnVue(context, (obj) => {
    const node = obj.properties.find(p =>
      p.type === 'Property' &&
      p.key.type === 'Identifier' &&
      p.key.name === 'props' &&
      (p.value.type === 'ObjectExpression' || p.value.type === 'ArrayExpression')
    )

    if (!node) return

    const items = node.value.type === 'ObjectExpression' ? node.value.properties : node.value.elements
    for (const item of items) {
      if (item.type !== 'Property') {
        return
      }
      if (item.computed) {
        if (item.key.type !== 'Literal') {
          // TemplateLiteral | Identifier(variable) | Expression(s)
          return
        }
        if (typeof item.key.value !== 'string') {
          // (boolean | null | number | RegExp) Literal
          return
        }
      }

      const propName = item.key.type === 'Literal' ? item.key.value : item.key.name
      const convertedName = converter(propName)
      if (convertedName !== propName) {
        context.report({
          node: item,
          message: 'Prop "{{name}}" is not in {{caseType}}.',
          data: {
            name: propName,
            caseType: caseType
          },
          fix: canFixPropertyName(item, propName) ? fixer => {
            return item.key.type === 'Literal'
              ? fixer.replaceText(item.key, item.key.raw.replace(item.key.value, convertedName))
              : fixer.replaceText(item.key, convertedName)
          } : undefined
        })
      }
    }
  })
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'enforce specific casing for the Prop name in Vue components',
      category: undefined, // 'strongly-recommended'
      url: 'https://github.com/vuejs/eslint-plugin-vue/blob/v4.5.0/docs/rules/prop-name-casing.md'
    },
    fixable: 'code',  // null or "code" or "whitespace"
    schema: [
      {
        enum: allowedCaseOptions
      }
    ]
  },

  create
}
