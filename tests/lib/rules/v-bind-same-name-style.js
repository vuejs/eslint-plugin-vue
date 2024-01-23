/**
 * @author waynzh
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/v-bind-same-name-style')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

const expectedShorthand = 'Expected shorthand same name.'
const unexpectedShorthand = 'Unexpected shorthand same name.'

tester.run('v-bind-same-name-style', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    // never
    {
      filename: 'test.vue',
      code: '<template><div :foo="bar"/><div v-bind:foo="bar"/></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo" /></template>',
      options: ['never']
    },
    {
      // modifier
      filename: 'test.vue',
      code: '<template><div :foo.prop="foo" /></template>',
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo="foo" /></template>',
      options: ['never']
    },
    // always
    {
      filename: 'test.vue',
      code: '<template><div :foo="bar"/><div v-bind:foo="bar"/></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo /></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo /></template>',
      options: ['always']
    },
    {
      // modifier
      filename: 'test.vue',
      code: '<template><div :foo.prop /></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo /></template>',
      options: ['always']
    }
  ],
  invalid: [
    // never
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo /></template>',
      output: '<template><div v-bind:foo="foo" /></template>',
      errors: [unexpectedShorthand]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo /></template>',
      output: '<template><div :foo="foo" /></template>',
      errors: [unexpectedShorthand]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo /></template>',
      output: '<template><div :foo="foo" /></template>',
      options: ['never'],
      errors: [unexpectedShorthand]
    },
    {
      // modifier
      filename: 'test.vue',
      code: '<template><div :foo.prop /></template>',
      output: '<template><div :foo.prop="foo" /></template>',
      options: ['never'],
      errors: [unexpectedShorthand]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo /></template>',
      output: '<template><div .foo="foo" /></template>',
      options: ['never'],
      errors: [unexpectedShorthand]
    },
    // always
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo" /></template>',
      output: '<template><div :foo /></template>',
      options: ['always'],
      errors: [expectedShorthand]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo" /></template>',
      output: '<template><div v-bind:foo /></template>',
      options: ['always'],
      errors: [expectedShorthand]
    },
    {
      // modifier
      filename: 'test.vue',
      code: '<template><div :foo.prop="foo" /></template>',
      output: '<template><div :foo.prop /></template>',
      options: ['always'],
      errors: [expectedShorthand]
    },
    {
      filename: 'test.vue',
      code: '<template><div .foo="foo" /></template>',
      output: '<template><div .foo /></template>',
      options: ['always'],
      errors: [expectedShorthand]
    }
  ]
})
