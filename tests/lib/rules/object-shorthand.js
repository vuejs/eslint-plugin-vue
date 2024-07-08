/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/object-shorthand')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('object-shorthand', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :style="{height}"></div>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :style="{height: height}"></div>
      </template>
      `,
      options: ['never']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :style="{height: height}"></div>
      </template>
      `,
      output: `
      <template>
        <div :style="{height}"></div>
      </template>
      `,
      errors: [
        {
          message: 'Expected property shorthand.',
          line: 3,
          column: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :style="{height}"></div>
      </template>
      `,
      output: `
      <template>
        <div :style="{height: height}"></div>
      </template>
      `,
      options: ['never'],
      errors: [
        {
          message: 'Expected longform property syntax.',
          line: 3,
          column: 23
        }
      ]
    }
  ]
})
