/**
 * @fileoverview disallow using deprecated number (keyCodes) modifiers
 * @author yoyo930021
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deprecated-v-on-number-modifiers')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('no-deprecated-v-bind-sync', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.page-down='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.page-down='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.9='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.9='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.0='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.0='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.4='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.4='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.page-down.native='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.page-down.native='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.0.native='onArrowUp'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.0.native='onArrowUp'></template>"
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.34='onArrowUp'></template>",
      output: "<template><input v-on:keyup.page-down='onArrowUp'></template>",
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.34.native='onArrowUp'></template>",
      output: "<template><input v-on:keyup.page-down.native='onArrowUp'></template>",
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.unknown.34='onArrowUp'></template>",
      output: "<template><input v-on:keyup.unknown.page-down='onArrowUp'></template>",
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:[dynamicArg].34='onArrowUp'></template>",
      output: "<template><input v-on:[dynamicArg].page-down='onArrowUp'></template>",
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:[dynamicArg].unknown.34='onArrowUp'></template>",
      output: "<template><input v-on:[dynamicArg].unknown.page-down='onArrowUp'></template>",
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:[dynamicArg].34.unknown='onArrowUp'></template>",
      output: "<template><input v-on:[dynamicArg].page-down.unknown='onArrowUp'></template>",
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.34='onArrowUp'></template>",
      output: "<template><input @keyup.page-down='onArrowUp'></template>",
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.34.native='onArrowUp'></template>",
      output: "<template><input @keyup.page-down.native='onArrowUp'></template>",
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.unknown.34='onArrowUp'></template>",
      output: "<template><input @keyup.unknown.page-down='onArrowUp'></template>",
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input @[dynamicArg].34='onArrowUp'></template>",
      output: "<template><input @[dynamicArg].page-down='onArrowUp'></template>",
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input @[dynamicArg].unknown.34='onArrowUp'></template>",
      output: "<template><input @[dynamicArg].unknown.page-down='onArrowUp'></template>",
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input @[dynamicArg].34.unknown='onArrowUp'></template>",
      output: "<template><input @[dynamicArg].page-down.unknown='onArrowUp'></template>",
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.10='onArrowUp'></template>",
      output: null,
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.10.native='onArrowUp'></template>",
      output: null,
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.unknown.10='onArrowUp'></template>",
      output: null,
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    },
    {
      filename: 'test.vue',
      code: "<template><input @[dynamicArg].unknown.10='onArrowUp'></template>",
      output: null,
      errors: ["'KeyboardEvent.keyCode' modifier on 'v-on' directive is deprecated. Using 'KeyboardEvent.key' instead."]
    }
  ]
})
