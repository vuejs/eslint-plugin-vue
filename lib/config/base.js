module.exports = {
  root: true,

  parser: require.resolve('vue-eslint-parser'),

  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },

  env: {
    browser: true,
    es6: true
  },

  plugins: [
    'vue'
  ],

  rules: require('../base-rules.js')
}
