/**
 * @author Przemyslaw Falowski (@przemkow)
 * @fileoverview disallow using deprecated filters syntax
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deprecated-filter')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('no-deprecated-filter', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template>{{ msg }}</template>'
    },
    {
      filename: 'test.vue',
      code: '<template>{{ method(msg) }}</template>'
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template>{{ msg | filter }}</template>',
      errors: ['Filters are deprecated.']
    },
    {
      filename: 'test.vue',
      code: '<template>{{ msg | filter(x) }}</template>',
      errors: ['Filters are deprecated.']
    },
    {
      filename: 'test.vue',
      code: '<template>{{ msg | filterA | filterB }}</template>',
      errors: ['Filters are deprecated.']
    },
    {
      filename: 'test.vue',
      code:
        '<template><div v-for="msg in messages">{{ msg | filter }}</div></template>',
      errors: ['Filters are deprecated.']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:id="msg | filter"></div></template>',
      errors: ['Filters are deprecated.']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:id="msg | filter(aaa)"></div></template>',
      errors: ['Filters are deprecated.']
    },
    {
      filename: 'test.vue',
      code:
        '<template><div v-bind:id="msg | filterA | filterB"></div></template>',
      errors: ['Filters are deprecated.']
    }
  ]
})
