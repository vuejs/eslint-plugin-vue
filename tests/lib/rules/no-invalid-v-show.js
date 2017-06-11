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
const rule = require('../../../lib/rules/no-invalid-v-show')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-invalid-v-show', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show="foo"></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-show:aaa="foo"></div></template>',
      errors: ["'v-show' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show.aaa="foo"></div></template>',
      errors: ["'v-show' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show></div></template>',
      errors: ["'v-show' directives require that attribute value."]
    }
  ]
})
