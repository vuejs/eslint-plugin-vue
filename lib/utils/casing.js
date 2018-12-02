const assert = require('assert')

function parseWords (str) {
  return str
    .normalize()
    .replace(/[^\p{L}0-9:]+/gu, ' ')
    .split(/([\p{Upper}\s][0-9\p{Lower}:]*)/gu)
    .map(word => word.trim())
    .filter(Boolean)
}

function capitalizeFirstLetter (str) {
  return str[0].toUpperCase() + str.slice(1)
}

/**
 * Convert text to kebab-case
 * @param {string} str Text to be converted
 * @return {string}
 */
function kebabCase (str) {
  return parseWords(str)
    .join('-')
    .toLowerCase()
}

/**
 * Convert text to snake_case
 * @param {string} str Text to be converted
 * @return {string}
 */
function snakeCase (str) {
  return parseWords(str)
    .join('_')
    .toLowerCase()
}

/**
 * Convert text to camelCase
 * @param {string} str Text to be converted
 * @return {string} Converted string
 */
function camelCase (str) {
  return parseWords(str)
    .map((word, index) => index === 0 ? word.toLowerCase() : capitalizeFirstLetter(word))
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
