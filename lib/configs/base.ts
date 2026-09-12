/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
import { fileURLToPath } from 'node:url'

export default {
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['vue'],
  rules: {
    'vue/comment-directive': 'error',
    'vue/jsx-uses-vars': 'error'
  },
  overrides: [
    {
      files: '*.vue',
      parser: fileURLToPath(import.meta.resolve('vue-eslint-parser'))
    }
  ]
}
