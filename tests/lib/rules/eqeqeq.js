/**
 * @author Toru Nagashima
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/eqeqeq')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('eqeqeq', rule, {
  valid: [
    '<template><div :attr="a === 1" /></template>',
    // CSS vars injection
    `
    <style>
    .text {
      color: v-bind(a === 1 ? 'red' : 'blue')
    }
    </style>`
  ],
  invalid: [
    {
      code: '<template><div :attr="a == 1" /></template>',
      errors: ["Expected '===' and instead saw '=='."]
    },
    // CSS vars injection
    {
      code: `
      <style>
      .text {
        color: v-bind(a == 1 ? 'red' : 'blue')
      }
      </style>`,
      errors: ["Expected '===' and instead saw '=='."]
    }
  ]
})
