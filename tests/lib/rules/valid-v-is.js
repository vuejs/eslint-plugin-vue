/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-v-is')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020 }
})

tester.run('valid-v-is', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-is="foo" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:foo="foo" /></template>'
    },
    {
      filename: 'test.vue',
      code: `<template><div v-is="'foo'" /></template>`
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><div v-is="." /></template>'
    },
    // comment value (parsing error)
    {
      filename: 'comment-value.vue',
      code: '<template><div v-is="/**/" /></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-is:a="foo" /></template>',
      errors: [
        {
          message: "'v-is' directives require no argument.",
          column: 16,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-is.a="foo" /></template>',
      errors: [
        {
          message: "'v-is' directives require no modifier.",
          column: 16,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-is /></template>',
      errors: [
        {
          message: "'v-is' directives require that attribute value.",
          column: 16,
          endColumn: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-is="" /></template>',
      errors: [
        {
          message: "'v-is' directives require that attribute value.",
          column: 16,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><MyComponent v-is="foo" /></template>',
      errors: [
        {
          message:
            "'v-is' directive must be owned by a native HTML element, but 'mycomponent' is not.",
          column: 24,
          endColumn: 34
        }
      ]
    }
  ]
})
