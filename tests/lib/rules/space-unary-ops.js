/**
 * @author Toru Nagashima
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/space-unary-ops')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('space-unary-ops', rule, {
  valid: [
    '<template><div :attr="-a" /></template>',
    '<template><div :attr="typeof a" /></template>'
  ],
  invalid: [
    {
      code: '<template><div :attr="- a" /></template>',
      errors: ['Unexpected space after unary operator \'-\'.']
    },
    {
      code: '<template><div :attr="typeof(a)" /></template>',
      errors: ['Unary word operator \'typeof\' must be followed by whitespace.']
    }
  ]
})
