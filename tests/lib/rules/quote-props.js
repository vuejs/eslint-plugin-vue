/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/quote-props')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('quote-props', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :style="{'height': '100vh'}"></div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :style="{height: '100vh'}"></div>
      </template>
      `,
      options: ['as-needed']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :style="{height: '100vh'}"></div>
        <div :style='{height: "100vh"}'></div>
        <div :style={height:"100vh"}></div>
      </template>
      `,
      output: `
      <template>
        <div :style="{'height': '100vh'}"></div>
        <div :style='{"height": "100vh"}'></div>
        <div :style={"height":"100vh"}></div>
      </template>
      `,
      errors: [
        {
          message: "Unquoted property 'height' found.",
          line: 3,
          column: 23
        },
        {
          message: "Unquoted property 'height' found.",
          line: 4,
          column: 23
        },
        {
          message: "Unquoted property 'height' found.",
          line: 5,
          column: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :style="{'height': '100vh'}"></div>
        <div :style='{"height": "100vh"}'></div>
      </template>
      `,
      output: `
      <template>
        <div :style="{height: '100vh'}"></div>
        <div :style='{height: "100vh"}'></div>
      </template>
      `,
      options: ['as-needed'],
      errors: [
        {
          message: "Unnecessarily quoted property 'height' found.",
          line: 3,
          column: 23
        },
        {
          message: "Unnecessarily quoted property 'height' found.",
          line: 4,
          column: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        {{ ({foo:42}).foo }}
      </template>
      `,
      output: `
      <template>
        {{ ({"foo":42}).foo }}
      </template>
      `,
      errors: [
        {
          message: "Unquoted property 'foo' found.",
          line: 3,
          column: 14
        }
      ]
    }
  ]
})
