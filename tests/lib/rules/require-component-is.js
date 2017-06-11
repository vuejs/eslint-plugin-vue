/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/require-component-is')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('require-component-is', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><component v-bind:is="type"></component></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><component :is="type"></component></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><component is="type"></component></template>',
      errors: ["Expected '<component>' elements to have 'v-bind:is' attribute."]
    },
    {
      filename: 'test.vue',
      code: '<template><component v-foo:is="type"></component></template>',
      errors: ["Expected '<component>' elements to have 'v-bind:is' attribute."]
    }
  ]
})
