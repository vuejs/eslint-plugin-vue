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
const rule = require('../../../lib/rules/v-on-style')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('v-on-style', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="foo"></div></template>',
      options: ['shorthand']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:foo="foo"></div></template>',
      options: ['longform']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-on:foo="foo"></div></template>',
      output: '<template><div @foo="foo"></div></template>',
      errors: ["Expected '@' instead of 'v-on:'."]
    },
    {
      filename: 'test.vue',
      options: ['shorthand'],
      code: '<template><div v-on:foo="foo"></div></template>',
      output: '<template><div @foo="foo"></div></template>',
      errors: ["Expected '@' instead of 'v-on:'."]
    },
    {
      filename: 'test.vue',
      options: ['longform'],
      code: '<template><div @foo="foo"></div></template>',
      output: '<template><div v-on:foo="foo"></div></template>',
      errors: ["Expected 'v-on:' instead of '@'."]
    }
  ]
})
