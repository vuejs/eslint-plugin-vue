/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const { RuleTester } = require('../../eslint-compat')
const rule = require('../../../lib/rules/no-loss-of-precision')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})
tester.run('no-loss-of-precision', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          {{12345}}
          {{123.45}}
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent num="12345678901234567890" />
        </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          {{12345678901234567890}}
          {{0.12345678901234567890}}
        </template>
      `,
      errors: [
        {
          message: 'This number literal will lose precision at runtime.',
          line: 3,
          column: 13,
          endLine: 3,
          endColumn: 33
        },
        {
          message: 'This number literal will lose precision at runtime.',
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyComponent :num="12345678901234567890" />
        </template>
      `,
      errors: [
        {
          message: 'This number literal will lose precision at runtime.',
          line: 3,
          column: 30,
          endLine: 3,
          endColumn: 50
        }
      ]
    }
  ]
})
