/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/quote-props'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
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
          column: 23,
          endLine: 3,
          endColumn: 38
        },
        {
          message: "Unquoted property 'height' found.",
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 38
        },
        {
          message: "Unquoted property 'height' found.",
          line: 5,
          column: 22,
          endLine: 5,
          endColumn: 36
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
          column: 23,
          endLine: 3,
          endColumn: 40
        },
        {
          message: "Unnecessarily quoted property 'height' found.",
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 40
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
          column: 14,
          endLine: 3,
          endColumn: 20
        }
      ]
    }
  ]
})
