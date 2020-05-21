const assert = require('assert')

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Capitalize a string.
 */
function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
/**
 * Checks whether the given string has symbols.
 */
function hasSymbols (str) {
  return /[!"#%&'()*+,./:;<=>?@[\\\]^`{|}]/u.exec(str) // without " ", "$", "-" and "_"
}
/**
 * Checks whether the given string has upper.
 */
function hasUpper (str) {
  return /[A-Z]/u.exec(str)
}

/**
 * Convert text to kebab-case
 * @param {string} str Text to be converted
 * @return {string}
 */
function kebabCase (str) {
  return str
    .replace(/_/gu, '-')
    .replace(/\B([A-Z])/gu, '-$1')
    .toLowerCase()
}

/**
 * Checks whether the given string is kebab-case.
 */
function isKebabCase (str) {
  if (
    hasUpper(str) ||
    hasSymbols(str) ||
    /^-/u.exec(str) || // starts with hyphen is not kebab-case
    /_|--|\s/u.exec(str)
  ) {
    return false
  }
  return true
}

/**
 * Convert text to snake_case
 * @param {string} str Text to be converted
 * @return {string}
 */
function snakeCase (str) {
  return str
    .replace(/\B([A-Z])/gu, '_$1')
    .replace(/-/gu, '_')
    .toLowerCase()
}

/**
 * Checks whether the given string is snake_case.
 */
function isSnakeCase (str) {
  if (
    hasUpper(str) ||
    hasSymbols(str) ||
    /-|__|\s/u.exec(str)
  ) {
    return false
  }
  return true
}

/**
 * Convert text to camelCase
 * @param {string} str Text to be converted
 * @return {string} Converted string
 */
function camelCase (str) {
  if (isPascalCase(str)) {
    return str.charAt(0).toLowerCase() + str.slice(1)
  }
  return str.replace(/[-_](\w)/gu, (_, c) => c ? c.toUpperCase() : '')
}

/**
 * Checks whether the given string is camelCase.
 */
function isCamelCase (str) {
  if (
    hasSymbols(str) ||
    /^[A-Z]/u.exec(str) ||
    /-|_|\s/u.exec(str) // kebab or snake or space
  ) {
    return false
  }
  return true
}

/**
 * Convert text to PascalCase
 * @param {string} str Text to be converted
 * @return {string} Converted string
 */
function pascalCase (str) {
  return capitalize(camelCase(str))
}

/**
 * Checks whether the given string is PascalCase.
 */
function isPascalCase (str) {
  if (
    hasSymbols(str) ||
    /^[a-z]/u.exec(str) ||
    /-|_|\s/u.exec(str) // kebab or snake or space
  ) {
    return false
  }
  return true
}

const convertersMap = {
  'kebab-case': kebabCase,
  'snake_case': snakeCase,
  'camelCase': camelCase,
  'PascalCase': pascalCase
}

const checkersMap = {
  'kebab-case': isKebabCase,
  'snake_case': isSnakeCase,
  'camelCase': isCamelCase,
  'PascalCase': isPascalCase
}
/**
* Return case checker
* @param {string} name type of checker to return ('camelCase', 'kebab-case', 'PascalCase')
* @return {isKebabCase|isCamelCase|isPascalCase}
*/
function getChecker (name) {
  assert(typeof name === 'string')

  return checkersMap[name] || isPascalCase
}

/**
 * Return case converter
 * @param {string} name type of converter to return ('camelCase', 'kebab-case', 'PascalCase')
 * @return {kebabCase|camelCase|pascalCase}
 */
function getConverter (name) {
  assert(typeof name === 'string')

  return convertersMap[name] || pascalCase
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
  getConverter,

  /**
   * Return case checker
   * @param {string} name type of checker to return ('camelCase', 'kebab-case', 'PascalCase')
   * @return {isKebabCase|isCamelCase|isPascalCase}
   */
  getChecker,

  /**
   * Return case exact converter.
   * If the converted result is not the correct case, the original value is returned.
   * @param {string} name type of converter to return ('camelCase', 'kebab-case', 'PascalCase')
   * @return {kebabCase|camelCase|pascalCase}
   */
  getExactConverter (name) {
    const converter = getConverter(name)
    const checker = getChecker(name)
    return (str) => {
      const result = converter(str)
      return checker(result) ? result : str/* cannot convert */
    }
  },

  camelCase,
  pascalCase,
  kebabCase,
  snakeCase,

  isCamelCase,
  isPascalCase,
  isKebabCase,
  isSnakeCase
}
