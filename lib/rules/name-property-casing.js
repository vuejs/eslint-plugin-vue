/**
 * @fileoverview Requires specific casing for the name property in Vue components
 * @author Armano
 */
'use strict'

const utils = require('../utils')
const casing = require('../utils/casing')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function create (context) {
  const options = context.options[0]
  const caseType = casing.allowedCaseOptions.indexOf(options) !== -1 ? options : 'PascalCase'

  // ----------------------------------------------------------------------
  // Public
  // ----------------------------------------------------------------------

  return utils.executeOnVue(context, (obj) => {
    const node = obj.properties
      .find(item => (
        item.type === 'Property' &&
        item.key.name === 'name' &&
        item.value.type === 'Literal'
      ))

    if (!node) return

    const value = casing.getConverter(caseType)(node.value.value)
    if (value !== node.value.value) {
      context.report({
        node: node.value,
        message: 'Property name "{{value}}" is not {{caseType}}.',
        data: {
          value: node.value.value,
          caseType: caseType
        },
        fix: fixer => fixer.replaceText(node.value, node.value.raw.replace(node.value.value, value))
      })
    }
  })
}

module.exports = {
  meta: {
    docs: {
      description: 'enforce specific casing for the name property in Vue components',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',  // or "code" or "whitespace"
    schema: [
      {
        enum: casing.allowedCaseOptions
      }
    ]
  },

  create
}
