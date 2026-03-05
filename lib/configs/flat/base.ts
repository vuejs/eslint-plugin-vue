/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
import plugin from '../../plugin.ts'
import vueParser from 'vue-eslint-parser'

export default [
  {
    name: 'vue/base/setup',
    plugins: {
      get vue() {
        return plugin
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
        return plugin
      }
    },
    languageOptions: {
      parser: vueParser,
      sourceType: 'module'
    },
    rules: {
      'vue/comment-directive': 'error',
      'vue/jsx-uses-vars': 'error'
    },
    processor: 'vue/vue'
  }
]
