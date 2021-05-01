/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-restricted-block')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020 }
})

tester.run('no-restricted-block', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<style>.foo {}</style>',
      options: ['foo']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<style>.foo {}</style><foo></foo>`,
      options: ['style', 'foo'],
      errors: [
        {
          message: 'Using `<style>` is not allowed.',
          line: 1,
          column: 1
        },
        {
          message: 'Using `<foo>` is not allowed.',
          line: 1,
          column: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<forbidden-block></forbidden-block>
      <block-forbidden></block-forbidden>`,
      options: ['/forbidden/'],
      errors: [
        'Using `<forbidden-block>` is not allowed.',
        'Using `<block-forbidden>` is not allowed.'
      ]
    },
    {
      filename: 'test.vue',
      code: `<style>.foo {}</style>
      <forbidden-block></forbidden-block>
      <block-forbidden></block-forbidden>`,
      options: [
        {
          element: 'style',
          message: 'Do not use <style> block in this project.'
        },
        {
          element: '/forbidden/',
          message: 'Do not use blocks that include `forbidden` in their name.'
        }
      ],
      errors: [
        {
          message: 'Do not use <style> block in this project.',
          line: 1,
          column: 1
        },
        {
          message: 'Do not use blocks that include `forbidden` in their name.',
          line: 2,
          column: 7
        },
        {
          message: 'Do not use blocks that include `forbidden` in their name.',
          line: 3,
          column: 7
        }
      ]
    }
  ]
})
