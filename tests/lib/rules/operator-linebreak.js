/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/operator-linebreak')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020 }
})

tester.run('operator-linebreak', rule, {
  valid: [
    `
    <template>
      <div :foo="1 + 2" />
    </template>
    `,
    {
      code: `
      <template>
        <div :foo="1 + 2" />
      </template>
      `,
      options: ['before']
    },
    {
      code: `
      <template>
        <div :foo="1 + 2" />
      </template>
      `,
      options: ['none']
    },
    `
    <template>
      <div :[foo+bar]="value" />
    </template>
    `,
    {
      code: `
      <template>
        <div :[foo+bar]="value" />
      </template>
      `,
      options: ['before']
    },
    {
      code: `
      <template>
        <div :[foo+bar]="value" />
      </template>
      `,
      options: ['none']
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div :foo="1
          + 2" />
      </template>
      `,
      output: `
      <template>
        <div :foo="1 +
          2" />
      </template>
      `,
      errors: [
        {
          message: "'+' should be placed at the end of the line.",
          line: 4
        }
      ]
    },
    {
      code: `
      <template>
        <div :foo="1 +
          2" />
      </template>
      `,
      output: `
      <template>
        <div :foo="1
          + 2" />
      </template>
      `,
      options: ['before'],
      errors: [
        {
          message: "'+' should be placed at the beginning of the line.",
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div :foo="1 +
          2" />
        <div :foo="1
          + 2" />
      </template>
      `,
      output: `
      <template>
        <div :foo="1 +          2" />
        <div :foo="1          + 2" />
      </template>
      `,
      options: ['none'],
      errors: [
        {
          message: "There should be no line break before or after '+'.",
          line: 3
        },
        {
          message: "There should be no line break before or after '+'.",
          line: 6
        }
      ]
    }
  ]
})
