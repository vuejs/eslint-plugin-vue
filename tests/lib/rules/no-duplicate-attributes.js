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
const rule = require('../../../lib/rules/no-duplicate-attributes')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-duplicate-attributes', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><div foo :bar baz></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div @click="foo" @click="bar"></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div style :style></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div class :class></div></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><div :class="a" class="b"></div></div></template>',
      options: [{ allowCoexistStyle: true }]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div :style="a" style="b"></div></div></template>',
      options: [{ allowCoexistStyle: true }]
    },
    {
      filename: 'test.vue',
      code: '<template><my-component foo :[foo]></my-component></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><my-component :foo :[foo]></my-component></template>'
    }
  ],
  invalid: [
    // {
    //   filename: 'test.vue',
    //   code: '<template><div><div foo foo></div></div></template>',
    //   errors: ["Duplicate attribute 'foo'."]
    // },
    {
      filename: 'test.vue',
      code: '<template><div><div foo v-bind:foo></div></div></template>',
      errors: ["Duplicate attribute 'foo'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div foo :foo></div></div></template>',
      errors: ["Duplicate attribute 'foo'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div style :style></div></div></template>',
      errors: ["Duplicate attribute 'style'."],
      options: [{ allowCoexistStyle: false }]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div class :class></div></div></template>',
      errors: ["Duplicate attribute 'class'."],
      options: [{ allowCoexistClass: false }]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div :style style></div></div></template>',
      errors: ["Duplicate attribute 'style'."],
      options: [{ allowCoexistStyle: false }]
    },
    {
      filename: 'test.vue',
      code: '<template><div><div :class class></div></div></template>',
      errors: ["Duplicate attribute 'class'."],
      options: [{ allowCoexistClass: false }]
    }
  ]
})
