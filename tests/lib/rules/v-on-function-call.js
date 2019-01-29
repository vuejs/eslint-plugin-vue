/**
 * @author Niklas Higi
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/v-on-function-call')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('v-on-function-call', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo(123)"></div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo(123)"></div></template>',
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo()"></div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo"></div></template>',
      options: ['never']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div @click="foo"></div></template>',
      output: `<template><div @click="foo"></div></template>`,
      errors: ["Method calls inside of 'v-on' directives must have parentheses."],
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo()"></div></template>',
      output: `<template><div @click="foo"></div></template>`,
      errors: ["Method calls without arguments inside of 'v-on' directives must not have parentheses."],
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo( )"></div></template>',
      output: `<template><div @click="foo"></div></template>`,
      errors: ["Method calls without arguments inside of 'v-on' directives must not have parentheses."],
      options: ['never']
    }
  ]
})
