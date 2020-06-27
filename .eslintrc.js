'use strict'

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
    'plugin:vue-libs/recommended',
    'prettier'
  ],
  plugins: ['eslint-plugin', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'eslint-plugin/report-message-format': ['error', "^[A-Z`'{].*\\.$"],
    'eslint-plugin/prefer-placeholders': 'error',
    'eslint-plugin/consistent-output': 'error',

    'no-debugger': 'error',
    'no-console': 'error',
    'no-alert': 'error',
    'no-void': 'error',

    'no-warning-comments': 'warn',
    'no-var': 'error',
    'prefer-template': 'error',
    'object-shorthand': 'error',
    'prefer-rest-params': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-spread': 'error',

    'dot-notation': 'error'
  },
  overrides: [
    {
      files: ['lib/rules/*.js'],
      rules: {
        'consistent-docs-description': 'error',
        'no-invalid-meta': 'error',
        'no-invalid-meta-docs-categories': 'error',
        'eslint-plugin/require-meta-type': 'error',
        'require-meta-docs-url': [
          'error',
          {
            pattern: `https://eslint.vuejs.org/rules/{{name}}.html`
          }
        ]
      }
    }
  ]
}
