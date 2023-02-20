/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-v-pre')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('valid-v-pre', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-pre></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-pre:aaa></div></template>',
      errors: ["'v-pre' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-pre.aaa></div></template>',
      errors: ["'v-pre' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-pre="aaa"></div></template>',
      errors: ["'v-pre' directives require no attribute value."]
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><div v-pre="." /></template>',
      errors: ["'v-pre' directives require no attribute value."]
    },
    // comment value
    {
      filename: 'comment-value.vue',
      code: '<template><div v-pre="/**/" /></template>',
      errors: ["'v-pre' directives require no attribute value."]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><div v-pre="" /></template>',
      errors: ["'v-pre' directives require no attribute value."]
    }
  ]
})
