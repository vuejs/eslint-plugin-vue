/**
 * @fileoverview Requires specific casing for the Prop name in Vue components
 * @author Yu Kimura
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')
const allowedCaseOptions = ['camelCase', 'snake_case']

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

      const propName = item.key.type === 'Literal' ? item.key.value : item.key.name
      const convertedName = converter(propName)
      if (convertedName !== propName) {
        context.report({
          node: item,
          message: 'Prop "{{name}}" is not in {{caseType}}.',
          data: {
            name: propName,
            caseType: caseType
          }
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
      category: undefined // 'strongly-recommended'
    },
    fixable: null, // or "code" or "whitespace"
    schema: [
      {
        enum: allowedCaseOptions
      }
    ]
  },

  create
}
