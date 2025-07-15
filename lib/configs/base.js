/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
const ruleLevel =
  process.env.VUE_ESLINT_ALWAYS_ERROR === 'true' ? 'error' : 'warn'

module.exports = {
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
      parser: require.resolve('vue-eslint-parser')
    }
  ]
}
