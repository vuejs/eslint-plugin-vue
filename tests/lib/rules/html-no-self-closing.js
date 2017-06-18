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
const rule = require('../../../lib/rules/html-no-self-closing')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('html-no-self-closing', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><svg><path/></svg></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><img></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><br></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><br/></div></template>',
      output: '<template><div><br></div></template>',
      errors: ['Self-closing should not be used.']
    },
    {
      filename: 'test.vue',
      code: '<template><div><input/></div></template>',
      output: '<template><div><input></div></template>',
      errors: ['Self-closing should not be used.']
    },
    {
      filename: 'test.vue',
      code: '<template><div><div/></div></template>',
      output: '<template><div><div></div></template>',
      errors: ['Self-closing should not be used.']
    }
  ]
})
