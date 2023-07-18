/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/v-bind-style')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('v-bind-style', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>',
      options: ['shorthand']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo"></div></template>',
      options: ['longform']
    },

    // Don't enforce `.prop` shorthand because of experimental.
    {
      filename: 'test.vue',
      code: '<template><div :foo.prop="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo.prop="foo"></div></template>',
      options: ['shorthand']
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo="foo"></div></template>',
      options: ['shorthand']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo"></div></template>',
      output: '<template><div :foo="foo"></div></template>',
      errors: ["Unexpected 'v-bind' before ':'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo"></div></template>',
      output: '<template><div :foo="foo"></div></template>',
      options: ['shorthand'],
      errors: ["Unexpected 'v-bind' before ':'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>',
      output: '<template><div v-bind:foo="foo"></div></template>',
      options: ['longform'],
      errors: ["Expected 'v-bind' before ':'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo="foo"></div></template>',
      output: '<template><div v-bind:foo.prop="foo"></div></template>',
      options: ['longform'],
      errors: ["Expected 'v-bind:' instead of '.'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo.sync="foo"></div></template>',
      output: '<template><div v-bind:foo.prop.sync="foo"></div></template>',
      options: ['longform'],
      errors: ["Expected 'v-bind:' instead of '.'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo.prop="foo"></div></template>',
      output: '<template><div v-bind:foo.prop="foo"></div></template>',
      options: ['longform'],
      errors: ["Expected 'v-bind:' instead of '.'."]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo.sync.prop="foo"></div></template>',
      output: '<template><div v-bind:foo.sync.prop="foo"></div></template>',
      options: ['longform'],
      errors: ["Expected 'v-bind:' instead of '.'."]
    }
  ]
})
