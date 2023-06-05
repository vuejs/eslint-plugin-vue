const path = require('path')
const tsParser = require('@typescript-eslint/parser')

const FIXTURES_ROOT = path.resolve(__dirname, '../fixtures/typescript')
const TSCONFIG_PATH = path.resolve(FIXTURES_ROOT, './tsconfig.json')
const SRC_VUE_TEST_PATH = path.join(FIXTURES_ROOT, './src/test.vue')

module.exports = {
  getTypeScriptFixtureTestOptions
}

function getTypeScriptFixtureTestOptions() {
  const parser = require.resolve('vue-eslint-parser')
  const parserOptions = {
    parser: { ts: tsParser },
    ecmaVersion: 2020,
    sourceType: 'module',
    project: [TSCONFIG_PATH],
    extraFileExtensions: ['.vue']
  }
  return {
    parser,
    parserOptions,
    filename: SRC_VUE_TEST_PATH
  }
}
