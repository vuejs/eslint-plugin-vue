/**
 * @fileoverview flat config - unlike eslintrc configs, it's not auto generated.
 * @author 唯然<weiran.zsd@outlook.com>
 */

const globals = require('globals')
module.exports = {
  languageOptions: {
    parser: require('vue-eslint-parser'),
    sourceType: 'module',
    globals: globals.browser
  },
  rules: {
    'vue/comment-directive': 'error',
    'vue/jsx-uses-vars': 'error'
  }
}
