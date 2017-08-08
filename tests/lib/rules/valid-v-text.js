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
const rule = require('../../../lib/rules/valid-v-text')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('valid-v-text', rule, {
  valid: [
    {
      filename: 'test.js',
      code: 'test'
    },
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-text="foo"></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-text:aaa="foo"></div></template>',
      errors: ["'v-text' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-text.aaa="foo"></div></template>',
      errors: ["'v-text' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-text></div></template>',
      errors: ["'v-text' directives require that attribute value."]
    }
  ]
})
