/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/prefer-template')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020 }
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
    </style>`
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
    },
    // CSS vars injection
    {
      code: `
      <style>
      .text {
        color: v-bind('"#"+hex')
      }
      </style>`,
      output: `
      <style>
      .text {
        color: v-bind('\`#\${hex}\`')
      }
      </style>`,
      errors: [
        {
          message: 'Unexpected string concatenation.',
          line: 4
        }
      ]
    }
  ]
})
