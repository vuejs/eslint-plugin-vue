/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/require-component-is')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
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
