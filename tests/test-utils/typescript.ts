import type { Linter } from 'eslint'
import path from 'node:path'
import tsParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'

const FIXTURES_ROOT = path.resolve(__dirname, '../fixtures/typescript')
const TSCONFIG_PATH = path.resolve(FIXTURES_ROOT, './tsconfig.json')
const SRC_VUE_TEST_PATH = path.join(FIXTURES_ROOT, './src/test.vue')

export function getTypeScriptFixtureTestOptions(): {
  languageOptions: Linter.LanguageOptions
  filename: string
} {
  return {
    languageOptions: {
      parser: vueEslintParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        parser: { ts: tsParser },
        project: [TSCONFIG_PATH],
        extraFileExtensions: ['.vue']
      }
    },
    filename: SRC_VUE_TEST_PATH
  }
}
