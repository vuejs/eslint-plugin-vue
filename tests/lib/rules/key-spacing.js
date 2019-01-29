/**
 * @author Toru Nagashima
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/key-spacing')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('key-spacing', rule, {
  valid: [
    '<template><div :attr="{a: 1}" /></template>'
  ],
  invalid: [
    {
      code: '<template><div :attr="{a :1}" /></template>',
      errors: [
        "Extra space after key 'a'.",
        "Missing space before value for key 'a'."
      ]
    }
  ]
})
