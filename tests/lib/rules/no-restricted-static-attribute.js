/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-restricted-static-attribute')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020 }
})

tester.run('no-restricted-static-attribute', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div v-model="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div bar="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo"></div></template>',
      options: [{ key: 'foo', value: 'bar' }]
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo"></div><input bar></template>',
      options: [{ key: 'foo', element: 'input' }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div foo="foo"></div></template>',
      options: ['foo'],
      errors: [
        {
          message: 'Using `foo` is not allowed.',
          line: 1,
          column: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="bar" bar="foo"></div></template>',
      options: ['foo'],
      errors: ['Using `foo` is not allowed.']
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo" bar="bar"></div></template>',
      options: ['/^f/'],
      errors: ['Using `foo` is not allowed.']
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="bar" bar="foo"></div></template>',
      options: ['foo', 'bar'],
      errors: ['Using `foo` is not allowed.', 'Using `bar` is not allowed.']
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="bar" bar></div></template>',
      options: [{ key: '/^(foo|bar)$/' }],
      errors: ['Using `foo` is not allowed.', 'Using `bar` is not allowed.']
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo" /><div foo="bar" /></template>',
      options: [{ key: 'foo', value: 'bar' }],
      errors: ['Using `foo="bar"` is not allowed.']
    },
    {
      filename: 'test.vue',
      code:
        '<template><div foo v bar /><div foo="foo" vv="foo" bar="vfoo" /><div vvv="foo" bar="vv" /></template>',
      options: [
        '/^vv/',
        { key: 'foo', value: true },
        { key: 'bar', value: '/^vv/' }
      ],
      errors: [
        'Using `foo` set to `true` is not allowed.',
        'Using `foo="foo"` is not allowed.',
        'Using `vv` is not allowed.',
        'Using `vvv` is not allowed.',
        'Using `bar="vv"` is not allowed.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div foo />
        <MyButton foo bar />
      </template>`,
      options: [{ key: 'foo', element: `/^My/` }],
      errors: ['Using `foo` on `<MyButton>` is not allowed.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div foo="x" />
      </template>`,
      options: ['/^f/', { key: 'foo' }],
      errors: ['Using `foo` is not allowed.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div foo="x" />
      </template>`,
      options: [{ key: 'foo', message: 'foo' }],
      errors: ['foo']
    }
  ]
})
