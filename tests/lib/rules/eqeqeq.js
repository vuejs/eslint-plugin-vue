/**
 * @author Toru Nagashima
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/eqeqeq')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('eqeqeq', rule, {
  valid: [
    '<template><div :attr="a === 1" /></template>'
  ],
  invalid: [
    {
      code: '<template><div :attr="a == 1" /></template>',
      errors: ["Expected '===' and instead saw '=='."]
    }
  ]
})
