module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6
  },
  env: {
    node: true,
    mocha: true
  },
  extends: [
    'plugin:eslint-plugin/recommended',
    'plugin:vue-libs/recommended'
  ],
  plugins: [
    'eslint-plugin'
  ],
  rules: {
    'eslint-plugin/report-message-format': ['error', '^[A-Z].*\\.$'],
    'eslint-plugin/prefer-placeholders': 'error',
    'eslint-plugin/consistent-output': 'error'
  }
}
