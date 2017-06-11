module.exports = {
  root: true,

  parser: 'vue-eslint-parser',

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },

  env: {
    browser: true
  },

  plugins: [
    'vue'
  ]
}
