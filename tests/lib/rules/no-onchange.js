'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-onchange')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

const expectedError = `onBlur must be used instead of onchange, \
  unless absolutely necessary and it causes no negative consequences \
  for keyboard only or screen reader users.`

tester.run('no-onchange', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><select v-on:onblur="() => {}"></select></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><option></option></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><option v-on:onBlur="() => {}" v-on:onChange="() => {}"></option></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><input v-on:onChange="() => {}"></option></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><input v-on:onChange="handleOnChange" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><input /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><input v-on:onChange="() => {}" v-on:onChange="() => {}" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><option v-bind="props" /></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><select v-on:onchange="() => {}" /></template>',
      errors: [expectedError]
    },
    {
      filename: 'test.vue',
      code: '<template><select v-on:onChange="handleOnChange" /></template>',
      errors: [expectedError]
    },
    {
      filename: 'test.vue',
      code: '<template><option v-on:onChange="() => {}" /></template>',
      errors: [expectedError]
    },
    {
      filename: 'test.vue',
      code: '<template><option onChange="() => {}" /></template>',
      errors: [expectedError]
    },
    {
      filename: 'test.vue',
      code: '<template><option onChange="() => {}" v-bind="props" /></template>',
      errors: [expectedError]
    }
  ]
})
