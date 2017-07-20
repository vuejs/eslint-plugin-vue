/**
 * @fileoverview Name property casing for consistency purposes
 * @author Armano
 */
'use strict'

const utils = require('../utils')

function kebabCase (str) {
  return str.replace(/([a-z])([A-Z])/g, match => match[0] + '-' + match[1]).replace(/\s+/g, '-').toLowerCase()
}

function camelCase (str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => index === 0 ? letter.toLowerCase() : letter.toUpperCase()).replace(/[\s-]+/g, '')
}

function pascalCase (str) {
  str = camelCase(str)
  return str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

function convertCase (str, caseType) {
  if (caseType === 'kebab-case') {
    return kebabCase(str)
  } else if (caseType === 'PascalCase') {
    return pascalCase(str)
  }
  return camelCase(str)
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function create (context) {
  const options = context.options[0]
  const caseType = ['camelCase', 'kebab-case', 'PascalCase'].indexOf(options) !== -1 ? options : 'PascalCase'

  // ----------------------------------------------------------------------
  // Public
  // ----------------------------------------------------------------------

  return utils.executeOnVueComponent(context, (obj) => {
    const node = obj.properties
      .filter(item => item.type === 'Property' && item.key.name === 'name' && item.value.type === 'Literal')[0]
    if (node) {
      const value = convertCase(node.value.value, caseType)
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
    }
  })
}

module.exports = {
  meta: {
    docs: {
      description: 'Name property casing for consistency purposes',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',  // or "code" or "whitespace"
    schema: [
      {
        enum: ['camelCase', 'kebab-case', 'PascalCase']
      }
    ]
  },

  create
}
