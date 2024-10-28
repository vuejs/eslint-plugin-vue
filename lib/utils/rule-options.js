/**
 * @typedef {Record<string, T>} ObjectLike
 * @template [T=unknown]
 */

/**
 * Check if the variable contains an object strictly rejecting arrays
 * @param {unknown} object The variable to check
 * @returns {object is ObjectLike} `true` if object is an object
 */
function isObjectNotArray(object) {
  return typeof object === 'object' && object != null && !Array.isArray(object)
}

/**
 * Pure function - doesn't mutate either parameter!
 * Merges two objects together deeply, overwriting the properties in first with the properties in second
 * @param {ObjectLike} first The first object
 * @param {ObjectLike} second The second object
 * @returns {Record<string, unknown>} a new object
 */
function deepMerge(first = {}, second = {}) {
  // get the unique set of keys across both objects
  const keys = new Set([...Object.keys(first), ...Object.keys(second)])

  return Object.fromEntries(
    [...keys].map((key) => {
      const firstHasKey = key in first
      const secondHasKey = key in second
      const firstValue = first[key]
      const secondValue = second[key]

      let value
      if (
        firstHasKey &&
        secondHasKey &&
        isObjectNotArray(firstValue) &&
        isObjectNotArray(secondValue)
      ) {
        value = deepMerge(firstValue, secondValue)
      } else if (firstHasKey && secondHasKey) {
        value = secondValue
      } else if (firstHasKey) {
        value = firstValue
      } else {
        value = secondValue
      }
      return [key, value]
    })
  )
}

/**
 * Pure function - doesn't mutate either parameter!
 * Uses the default options and overrides with the options provided by the user
 * @template {readonly unknown[]} User
 * @template {User} Default
 * @param {Readonly<Default>} defaultOptions the defaults
 * @param {Readonly<User> | null} userOptions the user opts
 * @param {boolean} [deep=true] Enable deep object merging.
 * @returns {Default} the options with defaults
 */
function applyDefault(defaultOptions, userOptions, deep = true) {
  // clone defaults
  const options = JSON.parse(JSON.stringify(defaultOptions)) ?? []

  if (userOptions == null) {
    return options
  }

  const length = Math.max(options.length, userOptions.length)

  for (let index = 0; index < length; index++) {
    if (userOptions[index] === undefined) {
      continue
    }

    const userOption = userOptions[index]
    const defaultOption = options[index]

    options[index] =
      isObjectNotArray(userOption) && isObjectNotArray(defaultOption) && deep
        ? deepMerge(defaultOption, userOption)
        : userOption
  }

  return options
}

/**
 * Get user options applied to rule's default options.
 * @param {RuleContext} ruleContext The rule context.
 * @param {string} ruleFilePath The path to the rule file.
 * @param {object} settings Settings to change the merging behavior.
 * @param {boolean} [settings.deep] Enable deep object merging.
 * @param {any[]} [settings.userOptions] Values to use (rather than the ones from the rule context) as user options.
 * @returns {any[]} The merged options.
 */
function getRuleOptions(ruleContext, ruleFilePath, settings = {}) {
  const rule = require(ruleFilePath)
  const userOptions = settings.userOptions ?? ruleContext.options
  const defaultOptions = rule.meta.defaultOptions

  return applyDefault(defaultOptions, userOptions, settings.deep)
}

module.exports = {
  getRuleOptions
}
