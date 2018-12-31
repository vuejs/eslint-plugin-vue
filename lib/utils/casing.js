const assert = require('assert')

function parseWords (str) {
  return str
    .normalize()
    .replace(/[\-!#$%^&*()_+~`"'<>,./?\[\]{}\s\r\n\v\t]+/gu, ' ')
    .split(/([A-Z\s][^A-Z\s]*)/gu)
    .map(word => word.trim())
    .filter(Boolean)
}

function toLowerCase (str) {
  return str.replace(/[A-Z]/gu, (l) => l.toLowerCase())
}

function toUpperCase (str) {
  return str.replace(/[a-z]/gu, (l) => l.toUpperCase())
}

function capitalizeFirstLetter (str) {
  return toUpperCase(str[0]) + str.slice(1)
}

/**
 * Convert text to kebab-case
 * @param {string} str Text to be converted
 * @return {string}
 */
function kebabCase (str) {
  return toLowerCase(parseWords(str).join('-'))
}

/**
 * Convert text to snake_case
 * @param {string} str Text to be converted
 * @return {string}
 */
function snakeCase (str) {
  return toLowerCase(parseWords(str).join('_'))
}

/**
 * Convert text to camelCase
 * @param {string} str Text to be converted
 * @return {string} Converted string
 */
function camelCase (str) {
  return parseWords(str)
    .map((word, index) => index === 0 ? toLowerCase(word) : capitalizeFirstLetter(word))
    .join('')
}

/**
 * Convert text to PascalCase
 * @param {string} str Text to be converted
 * @return {string} Converted string
 */
function pascalCase (str) {
  return parseWords(str)
    .map((word) => capitalizeFirstLetter(word))
    .join('')
}

const convertersMap = {
  'kebab-case': kebabCase,
  'snake_case': snakeCase,
  'camelCase': camelCase,
  'PascalCase': pascalCase
}

module.exports = {
  allowedCaseOptions: [
    'camelCase',
    'kebab-case',
    'PascalCase'
  ],

  /**
   * Return case converter
   * @param {string} name type of converter to return ('camelCase', 'kebab-case', 'PascalCase')
   * @return {kebabCase|camelCase|pascalCase}
   */
  getConverter (name) {
    assert(typeof name === 'string')

    return convertersMap[name] || pascalCase
  },

  camelCase,
  pascalCase,
  kebabCase,
  snakeCase
}
