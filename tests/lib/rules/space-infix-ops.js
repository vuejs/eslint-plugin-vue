/**
 * @author Toru Nagashima
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/space-infix-ops')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('space-infix-ops', rule, {
  valid: [
    '<template><div :attr="a + 1" /></template>',
    '<template><div :attr="a ? 1 : 2" /></template>'
  ],
  invalid: [
    {
      code: '<template><div :attr="a+1" /></template>',
      errors: ['Infix operators must be spaced.']
    },
    {
      code: '<template><div :attr="a?1 : 2" /></template>',
      errors: ['Infix operators must be spaced.']
    },
    {
      code: '<template><div :attr="a ? 1:2" /></template>',
      errors: ['Infix operators must be spaced.']
    }
  ]
})
