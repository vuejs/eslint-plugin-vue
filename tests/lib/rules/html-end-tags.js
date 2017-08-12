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
const rule = require('../../../lib/rules/html-end-tags')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('html-end-tags', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><div></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><p></p></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><br></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><input></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><img></div></template>'
    }
  ],
  invalid: [
    // {
    //   filename: 'test.vue',
    //   code: '<template><div><hr></hr></div></template>',
    //   output: '<template><div><hr></template>',
    //   errors: ["'<hr>' should not have end tag."]
    // },
    // {
    //   filename: 'test.vue',
    //   code: '<template><div><img></img></div></template>',
    //   output: '<template><div><img></template>',
    //   errors: ["'<img>' should not have end tag."]
    // },
    // {
    //   filename: 'test.vue',
    //   code: '<template><div><input></input></div></template>',
    //   output: '<template><div><input></template>',
    //   errors: ["'<input>' should not have end tag."]
    // },
    {
      filename: 'test.vue',
      code: '<template><div><div></div></template>',
      output: '<template><div><div></div></div></template>',
      errors: ["'<div>' should have end tag."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><p></div></template>',
      output: '<template><div><p></p></div></template>',
      errors: ["'<p>' should have end tag."]
    }
  ]
})
