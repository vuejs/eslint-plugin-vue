import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/prefer-v-model'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('prefer-v-model', rule, {
  valid: [
    '<template><my-component v-model="foo" /></template>',
    '<template><my-component v-model:foo="bar" /></template>',
    '<template><my-component :foo="bar" @update:foo="baz = $event" /></template>',
    '<template><my-component :foo="bar" @update:foo="updateFoo($event)" /></template>',
    '<template><my-component :foo="bar" @update:foo="(val) => updateFoo(val)" /></template>',
    '<template><my-component :foo="bar" /></template>',
    '<template><my-component @update:foo="bar = $event" /></template>',
    '<template><input :value="bar" @update:value="bar = $event" /></template>',
    '<template><my-component :foo="bar" @update:foo.once="bar = $event" /></template>',
    '<template><my-component :foo.sync="bar" @update:foo="bar = $event" /></template>',
    '<template><my-component :foo="bar" @update:foo="bar = $event; doSomething()" /></template>',
    '<template><my-component :foo="bar" @update:foo="bar += $event" /></template>',
    '<template><my-component :foo="bar" @update:foo="(val) => { bar = val; doSomething() }" /></template>',
    '<template><my-component :foo="bar" @update:foo="(val, extra) => bar = val" /></template>',
    '<template><my-component :[prop]="bar" @update:foo="bar = $event" /></template>'
  ],
  invalid: [
    // <template><my-component :modelValue="foo" @update:modelValue="foo = $event" /></template>
    //                         ^^^^^^^^^^^^^^^^^
    {
      code: '<template><my-component :modelValue="foo" @update:modelValue="foo = $event" /></template>',
      errors: [
        {
          message:
            'Prefer `v-model` over the `:modelValue`/`@update:modelValue` pair.',
          line: 1,
          endLine: 1,
          column: 25,
          endColumn: 42,
          suggestions: [
            {
              desc: 'Replace with `v-model`.',
              output: '<template><my-component v-model="foo" /></template>'
            }
          ]
        }
      ]
    },
    // <template><my-component :model-value="foo" @update:model-value="foo = $event" /></template>
    //                         ^^^^^^^^^^^^^^^^^^
    {
      code: '<template><my-component :model-value="foo" @update:model-value="foo = $event" /></template>',
      errors: [
        {
          message:
            'Prefer `v-model` over the `:model-value`/`@update:model-value` pair.',
          line: 1,
          endLine: 1,
          column: 25,
          endColumn: 43,
          suggestions: [
            {
              desc: 'Replace with `v-model`.',
              output: '<template><my-component v-model="foo" /></template>'
            }
          ]
        }
      ]
    },
    // Multiline: on directive on separate line
    {
      code: `
        <template>
          <my-component
            :foo="bar"
            bar
            @update:foo="bar = $event"
          />
        </template>
      `,
      errors: [
        {
          message: 'Prefer `v-model:foo` over the `:foo`/`@update:foo` pair.',
          line: 4,
          endLine: 4,
          column: 13,
          endColumn: 23,
          suggestions: [
            {
              desc: 'Replace with `v-model:foo`.',
              output: `
        <template>
          <my-component
            v-model:foo="bar"
            bar
          />
        </template>
      `
            }
          ]
        }
      ]
    },
    // Longhand syntax with single-quoted values preserves quoting
    {
      code: `<template><my-component v-bind:foo='bar["baz"]' v-on:update:foo='bar["baz"] = $event' /></template>`,
      errors: [
        {
          message: 'Prefer `v-model:foo` over the `:foo`/`@update:foo` pair.',
          line: 1,
          endLine: 1,
          column: 25,
          endColumn: 48,
          suggestions: [
            {
              desc: 'Replace with `v-model:foo`.',
              output: `<template><my-component v-model:foo='bar["baz"]' /></template>`
            }
          ]
        }
      ]
    },
    // <template><my-component :foo="bar" @update:foo="(val) => bar = val" /></template>
    //                         ^^^^^^^^^^
    {
      code: '<template><my-component :foo="bar" @update:foo="(val) => bar = val" /></template>',
      errors: [
        {
          message: 'Prefer `v-model:foo` over the `:foo`/`@update:foo` pair.',
          line: 1,
          endLine: 1,
          column: 25,
          endColumn: 35,
          suggestions: [
            {
              desc: 'Replace with `v-model:foo`.',
              output: '<template><my-component v-model:foo="bar" /></template>'
            }
          ]
        }
      ]
    },
    // <template><my-component :foo="obj.bar" @update:foo="obj.bar = $event" /></template>
    //                         ^^^^^^^^^^^^^^
    {
      code: '<template><my-component :foo="obj.bar" @update:foo="obj.bar = $event" /></template>',
      errors: [
        {
          message: 'Prefer `v-model:foo` over the `:foo`/`@update:foo` pair.',
          line: 1,
          endLine: 1,
          column: 25,
          endColumn: 39,
          suggestions: [
            {
              desc: 'Replace with `v-model:foo`.',
              output:
                '<template><my-component v-model:foo="obj.bar" /></template>'
            }
          ]
        }
      ]
    },
    // <template><my-component :foo="obj.bar" @update:foo="(val) => obj.bar = val" /></template>
    //                         ^^^^^^^^^^^^^^
    {
      code: '<template><my-component :foo="obj.bar" @update:foo="(val) => obj.bar = val" /></template>',
      errors: [
        {
          message: 'Prefer `v-model:foo` over the `:foo`/`@update:foo` pair.',
          line: 1,
          endLine: 1,
          column: 25,
          endColumn: 39,
          suggestions: [
            {
              desc: 'Replace with `v-model:foo`.',
              output:
                '<template><my-component v-model:foo="obj.bar" /></template>'
            }
          ]
        }
      ]
    },
    // <template><my-component :foo="a" @update:foo="a = $event" :bar="b" @update:bar="b = $event" /></template>
    //                         ^^^^^^^^                          ^^^^^^^^
    {
      code: '<template><my-component :foo="a" @update:foo="a = $event" :bar="b" @update:bar="b = $event" /></template>',
      errors: [
        {
          message: 'Prefer `v-model:foo` over the `:foo`/`@update:foo` pair.',
          line: 1,
          endLine: 1,
          column: 25,
          endColumn: 33,
          suggestions: [
            {
              desc: 'Replace with `v-model:foo`.',
              output:
                '<template><my-component v-model:foo="a" :bar="b" @update:bar="b = $event" /></template>'
            }
          ]
        },
        {
          message: 'Prefer `v-model:bar` over the `:bar`/`@update:bar` pair.',
          line: 1,
          endLine: 1,
          column: 59,
          endColumn: 67,
          suggestions: [
            {
              desc: 'Replace with `v-model:bar`.',
              output:
                '<template><my-component :foo="a" @update:foo="a = $event" v-model:bar="b" /></template>'
            }
          ]
        }
      ]
    }
  ]
})
