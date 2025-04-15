/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/prefer-template')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2020 }
})

tester.run('prefer-template', rule, {
  valid: [
    `
    <template>
      <div :class="[\`foo-\${bar}\`]" />
    </template>
    `,
    `
    <template>
      <div :[\`foo\${bar}\`]="value" />
    </template>
    `,
    // CSS vars injection
    `
    <style>
    .text {
      color: v-bind('\`#\${hex}\`')
    }
    </style>`,
    // https://github.com/vuejs/eslint-plugin-vue/issues/2712
    `
    <style>
    .text {
      color: v-bind('"#"+hex')
    }
    </style>
    `
  ],
  invalid: [
    {
      code: `
      <template>
        <div :class="['foo-' + bar]" />
      </template>
      `,
      output: `
      <template>
        <div :class="[\`foo-\${  bar}\`]" />
      </template>
      `,
      errors: [
        {
          message: 'Unexpected string concatenation.',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div :['foo'+bar]="value" />
      </template>`,
      output: `
      <template>
        <div :[\`foo\${bar}\`]="value" />
      </template>`,
      errors: [
        {
          message: 'Unexpected string concatenation.',
          line: 3
        }
      ]
    }
  ]
})
