/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/object-curly-newline')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020 }
})

tester.run('object-curly-newline', rule, {
  valid: [
    `
    <template>
      <div :foo="{a: 1}" />
    </template>
    `,
    {
      code: `
      <template>
        <div :foo="{a: 1}" />
      </template>
      `,
      options: ['never']
    },
    `
    <template>
      <div :foo="{
        a: 1
      }" />
    </template>
    `,
    {
      code: `
      <template>
        <div :foo="{
          a: 1
        }" />
      </template>
      `,
      options: ['always']
    },
    `
    <template>
      <div :[{a:1}]="value" />
    </template>
    `,
    {
      code: `
      <template>
        <div :[{a:1}]="value" />
      </template>
      `,
      options: ['always']
    },
    {
      code: `
      <template>
        <div :[{a:1}]="value" />
      </template>
      `,
      options: ['never']
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div :foo="{a: 1
        }" />
      </template>
      `,
      output: `
      <template>
        <div :foo="{a: 1}" />
      </template>
      `,
      errors: [
        {
          message: 'Unexpected line break before this closing brace.',
          line: 4,
          column: 9
        }
      ]
    },
    {
      code: `
      <template>
        <div :foo="{
          a: 1}" />
      </template>
      `,
      output: `
      <template>
        <div :foo="{a: 1}" />
      </template>
      `,
      errors: [
        {
          message: 'Unexpected line break after this opening brace.',
          line: 3,
          column: 20
        }
      ]
    },
    {
      code: `
      <template>
        <div :foo="{a: 1}" />
      </template>
      `,
      output: `
      <template>
        <div :foo="{
a: 1
}" />
      </template>
      `,
      options: ['always'],
      errors: [
        'Expected a line break after this opening brace.',
        'Expected a line break before this closing brace.'
      ]
    },
    {
      code: `
      <template>
        <div :foo="{
          a: 1
        }" />
      </template>
      `,
      output: `
      <template>
        <div :foo="{a: 1}" />
      </template>
      `,
      options: ['never'],
      errors: [
        'Unexpected line break after this opening brace.',
        'Unexpected line break before this closing brace.'
      ]
    }
  ]
})
