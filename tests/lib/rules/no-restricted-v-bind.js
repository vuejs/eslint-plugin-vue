/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-restricted-v-bind')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2020 }
})

tester.run('no-restricted-v-bind', rule, {
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
      code: '<template><div foo="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div :v-model="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div :bar="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>',
      options: [{ argument: 'foo', modifiers: ['sync'] }]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="foo"></div></template>',
      options: [{ argument: 'foo', element: 'input' }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div :v-model="foo"></div></template>',
      errors: [
        {
          message:
            'Using `:v-xxx` is not allowed. Instead, remove `:` and use it as directive.',
          line: 1,
          column: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:v-model="foo"></div></template>',
      errors: [
        'Using `:v-xxx` is not allowed. Instead, remove `:` and use it as directive.'
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="bar" :bar="foo"></div></template>',
      options: ['foo'],
      errors: ['Using `:foo` is not allowed.']
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="bar" :bar="foo"></div></template>',
      options: ['foo', 'bar'],
      errors: ['Using `:foo` is not allowed.', 'Using `:bar` is not allowed.']
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo="bar" :bar.sync="foo"></div></template>',
      options: [{ argument: '/^(foo|bar)$/' }],
      errors: ['Using `:foo` is not allowed.', 'Using `:bar` is not allowed.']
    },
    {
      filename: 'test.vue',
      code: '<template><div :foo.sync="foo" /><div :foo="foo" /></template>',
      options: [{ argument: 'foo', modifiers: ['sync'] }],
      errors: ['Using `:foo.sync` is not allowed.']
    },
    {
      filename: 'test.vue',
      code: '<template><div :v-on :foo.sync /><div :foo="foo" v-bind="listener" /></template>',
      options: ['/^v-/', { argument: 'foo', modifiers: ['sync'] }, null],
      errors: [
        'Using `:v-on` is not allowed.',
        'Using `:foo.sync` is not allowed.',
        'Using `v-bind` is not allowed.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :v-on :foo.sync />
        <MyButton :foo="foo" :bar="bar" />
      </template>`,
      options: ['/^v-/', { argument: 'foo', element: `/^My/` }],
      errors: [
        'Using `:v-on` is not allowed.',
        'Using `:foo` on `<MyButton>` is not allowed.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :foo="x" />
      </template>`,
      options: ['/^f/', { argument: 'foo' }],
      errors: ['Using `:foo` is not allowed.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :foo="x" />
      </template>`,
      options: [{ argument: 'foo', message: 'foo' }],
      errors: ['foo']
    },

    {
      filename: 'test.vue',
      code: '<template><div :foo.attr="foo" /><div :bar.attr="foo" /></template>',
      options: [{ argument: 'foo', modifiers: ['attr'] }],
      errors: ['Using `:foo.attr` is not allowed.']
    }
  ]
})
