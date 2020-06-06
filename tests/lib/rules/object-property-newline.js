/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/object-property-newline')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020 }
})

tester.run('object-property-newline', rule, {
  valid: [
    `
    <template>
      <div :foo="{a: 1,
        b: [2, {a: 3,
          b: 4}]}" />
    </template>
    `,
    `
    <template>
      <div :foo="{a: 1,
        b: 2}" />
    </template>
    `,
    `
    <template>
      <div :[{a:1,b:2}]="value" />
    </template>
    `,
    {
      code: `
      <template>
        <div :foo="{a: 1, b: [2, {a: 3, b: 4}]}" />
      </template>
      `,
      options: [{ allowAllPropertiesOnSameLine: true }]
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div :foo="{a: 1, b: [2, {a: 3, b: 4}]}" />
      </template>
      `,
      output: `
      <template>
        <div :foo="{a: 1,
b: [2, {a: 3,
b: 4}]}" />
      </template>
      `,
      errors: [
        {
          message: 'Object properties must go on a new line.',
          line: 3,
          column: 27
        },
        {
          message: 'Object properties must go on a new line.',
          line: 3,
          column: 41
        }
      ]
    },
    {
      code: `
      <template>
        <div :foo="{a: 1, b: 2,
          c: 3}" />
      </template>
      `,
      output: `
      <template>
        <div :foo="{a: 1,
b: 2,
          c: 3}" />
      </template>
      `,
      options: [{ allowAllPropertiesOnSameLine: true }],
      errors: [
        "Object properties must go on a new line if they aren't all on the same line."
      ]
    }
  ]
})
