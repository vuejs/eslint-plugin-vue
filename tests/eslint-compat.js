// @ts-check
const { getESLint } = require('eslint-compat-utils/eslint')
const { getLinter } = require('eslint-compat-utils/linter')
const { getRuleTester } = require('eslint-compat-utils/rule-tester')
const { ESLint, Linter } = require('eslint')
const semver = require('semver')

/** @type {typeof ESLint | null} */
let FlatESLint = ESLint
if (semver.lt(Linter.version, '9.0.0-0')) {
  try {
    // @ts-ignore
    FlatESLint = require('eslint/use-at-your-own-risk').FlatESLint
  } catch {
    FlatESLint = null
  }
}

module.exports = {
  ESLint: getESLint(),
  FlatESLint,
  RuleTester: getRuleTester(),
  Linter: getLinter()
}
