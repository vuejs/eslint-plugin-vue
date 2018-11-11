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
const rule = require('../../../lib/rules/valid-v-on')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('valid-v-on', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:click="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @click.prevent.ctrl.left="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.27="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.enter="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.arrow-down="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.esc="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.a="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.b="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.a.b.c="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><el-from @submit.native.prevent></el-form></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:click.prevent></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:click.native.stop></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on="$listeners"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on="{a, b, c: d}"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.bar="foo"></div></template>',
      options: [{ modifiers: ['bar'] }]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:keydown.bar.aaa="foo"></div></template>',
      options: [{ modifiers: ['bar', 'aaa'] }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-on:click.aaa="foo"></div></template>',
      errors: ["'v-on' directives don't support the modifier 'aaa'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:click></div></template>',
      errors: ["'v-on' directives require a value or verb modifier (like 'stop' or 'prevent')."]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click></div></template>',
      errors: ["'v-on' directives require a value or verb modifier (like 'stop' or 'prevent')."]
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.bar.aaa="foo"></div></template>',
      errors: ["'v-on' directives don't support the modifier 'aaa'."],
      options: [{ modifiers: ['bar'] }]
    },
    {
      filename: 'test.vue',
      code: '<template><div @keydown.bar.aaa="foo"></div></template>',
      errors: ["'v-on' directives don't support the modifier 'bar'."],
      options: [{ modifiers: ['aaa'] }]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="const"></div></template>',
      errors: ['Avoid using JavaScript keyword as "v-on" value: "const".']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="delete"></div></template>',
      errors: ['Avoid using JavaScript keyword as "v-on" value: "delete".']
    }
  ]
})
