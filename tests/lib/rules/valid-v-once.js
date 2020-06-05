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
const rule = require('../../../lib/rules/valid-v-once')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('valid-v-once', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-once></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-once:aaa></div></template>',
      errors: ["'v-once' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-once.aaa></div></template>',
      errors: ["'v-once' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-once="aaa"></div></template>',
      errors: ["'v-once' directives require no attribute value."]
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><MyComponent v-once="." /></template>',
      errors: ["'v-once' directives require no attribute value."]
    },
    // comment value
    {
      filename: 'comment-value.vue',
      code: '<template><MyComponent v-once="/**/" /></template>',
      errors: ["'v-once' directives require no attribute value."]
    },
    // empty value
    {
      filename: 'comment-value.vue',
      code: '<template><MyComponent v-once="" /></template>',
      errors: ["'v-once' directives require no attribute value."]
    }
  ]
})
