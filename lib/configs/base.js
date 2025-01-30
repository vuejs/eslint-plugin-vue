/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
const globals = require('globals')
module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: globals.browser,
  plugins: ['vue'],
  rules: {
    'vue/comment-directive': 'error',
    'vue/jsx-uses-vars': 'error'
  },
  overrides: [
    {
      files: '*.vue',
      parser: require.resolve('vue-eslint-parser')
    }
  ]
}
