/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
const ruleLevel =
  process.env.VUE_ESLINT_ALWAYS_ERROR === 'true' ? 'error' : 'warn'

module.exports = [
  {
    name: 'vue/base/setup',
    plugins: {
      get vue() {
        return require('../../plugin')
      }
    },
    languageOptions: {
      sourceType: 'module'
    }
  },
  {
    name: 'vue/base/setup-for-vue',
    files: ['*.vue', '**/*.vue'],
    plugins: {
      get vue() {
        return require('../../plugin')
      }
    },
    languageOptions: {
      parser: require('vue-eslint-parser'),
      sourceType: 'module'
    },
    rules: {
      'vue/comment-directive': 'error',
      'vue/jsx-uses-vars': 'error'
    },
    processor: 'vue/vue'
  }
]
