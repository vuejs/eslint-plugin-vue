/**
 * @author Kamogelo Moalusi <github.com/thesheppard>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-restricted-v-on')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-restricted-v-on', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><button click="foo"></button></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><button :click="foo"></button></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @v-model="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div @bar="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div foo="foo"></div></template>',
      options: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="foo"></div></template>',
      options: [{ argument: 'foo', modifiers: ['prevent'] }]
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="foo"></div></template>',
      options: [{ argument: 'foo', element: 'input' }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div @test="foo"></div></template>',
      options: ['test'],
      errors: [
        {
          message: 'Using `@test` is not allowed on this element.',
          line: 1,
          column: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="bar" @bar="foo"></div></template>',
      options: ['foo'],
      errors: ['Using `@foo` is not allowed on this element.']
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="bar" @bar="foo"></div></template>',
      options: ['foo', 'bar'],
      errors: [
        'Using `@foo` is not allowed on this element.',
        'Using `@bar` is not allowed on this element.'
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="bar" @bar="foo"></div></template>',
      options: [{ argument: '/^(foo|bar)$/' }],
      errors: [
        'Using `@foo` is not allowed on this element.',
        'Using `@bar` is not allowed on this element.'
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo.once="foo" /><div @foo="foo" /></template>',
      options: [{ argument: 'foo', modifiers: ['once'] }],
      errors: ['Using `@foo.once` is not allowed on this element.']
    },
    {
      filename: 'test.vue',
      code: '<template><div @v-on="foo" @foo.prevent="bar" /><div @foo="foo" v-on="listener" /></template>',
      options: ['/^v-/', { argument: 'foo', modifiers: ['prevent'] }, null],
      errors: [
        'Using `@v-on` is not allowed on this element.',
        'Using `@foo.prevent` is not allowed on this element.',
        'Using `v-on` is not allowed on this element.'
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on="foo" /></template>',
      options: [null],
      errors: ['Using `v-on` is not allowed on this element.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @v-on @foo.once="bar" />
        <MyButton @foo="foo" @bar="bar" />
      </template>`,
      options: ['/^v-/', { argument: 'foo', element: `/^My/` }],
      errors: [
        'Using `@v-on` is not allowed on this element.',
        'Using `@foo` is not allowed on this <MyButton>.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @foo="x" />
      </template>`,
      options: ['/^f/', { argument: 'foo' }],
      errors: ['Using `@foo` is not allowed on this element.']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @foo="x" />
      </template>`,
      options: [{ argument: 'foo', message: 'foo' }],
      errors: ['foo']
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="foo"></div></template>',
      options: [{ argument: 'foo', element: 'div' }],
      errors: [
        {
          message: 'Using `@foo` is not allowed on this <div>.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:foo="foo"></div></template>',
      options: ['foo'],
      errors: [
        {
          message: 'Using `v-on:foo` is not allowed on this element.'
        }
      ]
    }
  ]
})
