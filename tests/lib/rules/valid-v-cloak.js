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
const rule = require('../../../lib/rules/valid-v-cloak')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('valid-v-cloak', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-cloak></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-cloak:aaa></div></template>',
      errors: ["'v-cloak' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-cloak.aaa></div></template>',
      errors: ["'v-cloak' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-cloak="aaa"></div></template>',
      errors: ["'v-cloak' directives require no attribute value."]
    }
  ]
})
