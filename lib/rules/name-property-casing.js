/**
 * @fileoverview Requires specific casing for the name property in Vue components
 * @author Armano
 */
'use strict'

const utils = require('../utils')

function kebabCase (str) {
  return str
    .replace(/([a-z])([A-Z])/g, match => match[0] + '-' + match[1])
    .replace(/[^a-zA-Z:]+/g, '-')
    .toLowerCase()
}

function camelCase (str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => (
      index === 0 ? letter.toLowerCase() : letter.toUpperCase())
    )
    .replace(/[^a-zA-Z:]+/g, '')
}

function pascalCase (str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => letter.toUpperCase())
    .replace(/[^a-zA-Z:]+/g, '')
}

const allowedCaseOptions = [
  'camelCase',
  'kebab-case',
  'PascalCase'
]

const convertersMap = {
  'kebab-case': kebabCase,
  'camelCase': camelCase,
  'PascalCase': pascalCase
}

function getConverter (name) {
  return convertersMap[name] || pascalCase
}

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function create (context) {
  const options = context.options[0]
  const caseType = allowedCaseOptions.indexOf(options) !== -1 ? options : 'PascalCase'

  // ----------------------------------------------------------------------
  // Public
  // ----------------------------------------------------------------------

  return utils.executeOnVueComponent(context, (obj) => {
    const node = obj.properties
      .filter(item => (
        item.type === 'Property' &&
        item.key.name === 'name' &&
        item.value.type === 'Literal'
      ))[0]

    if (!node) return

    const value = getConverter(caseType)(node.value.value)
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
      description: 'Requires specific casing for the name property in Vue components',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',  // or "code" or "whitespace"
    schema: [
      {
        enum: allowedCaseOptions
      }
    ]
  },

  create
}
