import { createRequire } from 'node:module'
import { getESLint } from 'eslint-compat-utils/eslint'
import { getLinter } from 'eslint-compat-utils/linter'
import { getRuleTester } from 'eslint-compat-utils/rule-tester'
import { ESLint as ESLintRaw, Linter as LinterRaw } from 'eslint'
import semver from 'semver'

export const ESLint = getESLint()
export const RuleTester = getRuleTester()
export const Linter = getLinter()

export let FlatESLint: typeof ESLintRaw | null = ESLintRaw
if (semver.lt(LinterRaw.version, '9.0.0-0')) {
  try {
    const require = createRequire(import.meta.url)
    FlatESLint = require('eslint/use-at-your-own-risk').FlatESLint
  } catch {
    FlatESLint = null
  }
}
