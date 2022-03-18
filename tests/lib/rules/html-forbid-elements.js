/**
 * @author Doug Wade
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/html-forbid-elements')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('html-forbid-elements', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '',
      options: [{ forbid: ['button'] }]
    },
    {
      filename: 'test.vue',
      code: '<template><div class="foo"></div></template>',
      options: [{ forbid: ['button'] }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><button type="submit"></button></template>',
      errors: ['Unexpected use of forbidden HTML element button.'],
      options: [{ forbid: ['button'] }]
    },
    {
      filename: 'test.vue',
      code: "<template><div class='foo'></div></template>",
      errors: ['Unexpected use of forbidden HTML element div.'],
      options: [{ forbid: ['div'] }]
    }
  ]
})
