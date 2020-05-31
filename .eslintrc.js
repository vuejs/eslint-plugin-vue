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
    // Introduce prettier. but ignore files to avoid conflicts with PR.
    {
      files: [
        // https://github.com/vuejs/eslint-plugin-vue/pull/1107
        'lib/rules/order-in-components.js',
        'tests/lib/rules/order-in-components.js',
        // https://github.com/vuejs/eslint-plugin-vue/pull/1090
        'lib/rules/require-direct-export.js',
        'tests/lib/rules/require-direct-export.js',
        'lib/utils/index.js',
        'tests/lib/utils/vue-component.js',
        // https://github.com/vuejs/eslint-plugin-vue/pull/982
        'lib/rules/attributes-order.js',
        'tests/lib/rules/attributes-order.js',
        // https://github.com/vuejs/eslint-plugin-vue/pull/819
        'lib/rules/attributes-order.js',
        'tests/lib/rules/attributes-order.js'
      ],
      extends: [
        'plugin:eslint-plugin/recommended',
        'plugin:vue-libs/recommended'
      ],
      rules: {
        'prettier/prettier': 'off',

        'rest-spread-spacing': 'error',
        'no-mixed-operators': 'error'
      }
    },
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
