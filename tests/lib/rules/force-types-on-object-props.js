/**
 * @author *****your name*****
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/force-types-on-object-props')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('force-types-on-object-props', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>

      </template>
      `
    },
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>

      </template>
      `,
      errors: [
        {
          message: '...',
          line: 'line',
          column: 'col'
        },
      ]
    }
  ]
})
