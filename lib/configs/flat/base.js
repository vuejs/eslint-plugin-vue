/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
const globals = require('globals')
const vueEslintParser = require('vue-eslint-parser')
module.exports = {
  languageOptions: {
    parser: vueEslintParser,
    globals: {
      ...globals.browser,
      ...globals.es2015
    },
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    }
  },
  rules: {
    'vue/comment-directive': 'error',
    'vue/jsx-uses-vars': 'error'
  }
}
