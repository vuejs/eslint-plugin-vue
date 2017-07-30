const assert = require('assert')

const invalidChars = /[^a-zA-Z0-9:]+/g

function kebabCase (str) {
  return str
    .replace(/([a-z])([A-Z])/g, match => match[0] + '-' + match[1])
    .replace(invalidChars, '-')
    .toLowerCase()
}

function camelCase (str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => (
      index === 0 ? letter.toLowerCase() : letter.toUpperCase())
    )
    .replace(invalidChars, '')
}

function pascalCase (str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => letter.toUpperCase())
    .replace(invalidChars, '')
}

const convertersMap = {
  'kebab-case': kebabCase,
  'camelCase': camelCase,
  'PascalCase': pascalCase
}

module.exports = {
  allowedCaseOptions: [
    'camelCase',
    'kebab-case',
    'PascalCase'
  ],

  getConverter (name) {
    assert(typeof name === 'string')

    return convertersMap[name] || pascalCase
  }
}
