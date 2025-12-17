/*
 * IMPORTANT!
 * This file has been automatically generated,
 * in order to update its content execute "npm run update"
 */
'use strict'
const config = require('./vue3-essential.js')

module.exports = [
  ...config,
  {
    name: 'vue/strongly-recommended-error/rules',
    rules: {
      'vue/attribute-hyphenation': 'error',
      'vue/component-definition-name-casing': 'error',
      'vue/first-attribute-linebreak': 'error',
      'vue/html-closing-bracket-newline': 'error',
      'vue/html-closing-bracket-spacing': 'error',
      'vue/html-end-tags': 'error',
      'vue/html-indent': 'error',
      'vue/html-quotes': 'error',
      'vue/html-self-closing': 'error',
      'vue/max-attributes-per-line': 'error',
      'vue/multiline-html-element-content-newline': 'error',
      'vue/mustache-interpolation-spacing': 'error',
      'vue/no-multi-spaces': 'error',
      'vue/no-spaces-around-equal-signs-in-attribute': 'error',
      'vue/no-template-shadow': 'error',
      'vue/one-component-per-file': 'error',
      'vue/prop-name-casing': 'error',
      'vue/require-default-prop': 'error',
      'vue/require-explicit-emits': 'error',
      'vue/require-prop-types': 'error',
      'vue/singleline-html-element-content-newline': 'error',
      'vue/v-bind-style': 'error',
      'vue/v-on-event-hyphenation': [
        'error',
        'always',
        {
          autofix: true
        }
      ],
      'vue/v-on-style': 'error',
      'vue/v-slot-style': 'error'
    }
  }
]
