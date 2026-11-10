import { getESLint } from 'eslint-compat-utils/eslint'
import { getLinter } from 'eslint-compat-utils/linter'
import { getRuleTester } from 'eslint-compat-utils/rule-tester'

export const ESLint = getESLint()
export const RuleTester = getRuleTester()
export const Linter = getLinter()
