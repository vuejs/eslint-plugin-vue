/**
 * @author Toru Nagashima
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/object-curly-spacing')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('object-curly-spacing', rule, {
  valid: [
    '<template><div :attr="{a: 1}" /></template>',
    {
      code: '<template><div :attr="{a: 1}" /></template>',
      options: ['never']
    },
    {
      code: '<template><div :attr="{ a: 1 }" /></template>',
      options: ['always']
    },
    '<template><div :[{a:1}]="a" /></template>',
    {
      code: '<template><div :[{a:1}]="a" /></template>',
      options: ['always']
    },
    {
      code: `
      <template>
        <div v-bind="{foo: {bar: 'baz'} }">
          Hello World
        </div>
      </template>`,
      options: [
        'never',
        {
          objectsInObjects: true
        }
      ]
    }
  ],
  invalid: [
    {
      code: '<template><div :attr="{ a: 1}" /></template>',
      output: '<template><div :attr="{a: 1}" /></template>',
      errors: ["There should be no space after '{'."]
    },
    {
      code: '<template><div :attr="{a: 1 }" /></template>',
      output: '<template><div :attr="{a: 1}" /></template>',
      errors: ["There should be no space before '}'."]
    },
    {
      code: '<template><div :attr="{ a: 1 }" /></template>',
      output: '<template><div :attr="{a: 1}" /></template>',
      errors: [
        "There should be no space after '{'.",
        "There should be no space before '}'."
      ]
    },
    {
      code: '<template><div :attr="{ a: 1}" /></template>',
      output: '<template><div :attr="{a: 1}" /></template>',
      options: ['never'],
      errors: ["There should be no space after '{'."]
    },
    {
      code: '<template><div :attr="{a: 1 }" /></template>',
      output: '<template><div :attr="{a: 1}" /></template>',
      options: ['never'],
      errors: ["There should be no space before '}'."]
    },
    {
      code: '<template><div :attr="{ a: 1 }" /></template>',
      output: '<template><div :attr="{a: 1}" /></template>',
      options: ['never'],
      errors: [
        "There should be no space after '{'.",
        "There should be no space before '}'."
      ]
    },
    {
      code: '<template><div :attr="{ a: 1}" /></template>',
      output: '<template><div :attr="{ a: 1 }" /></template>',
      options: ['always'],
      errors: ["A space is required before '}'."]
    },
    {
      code: '<template><div :attr="{a: 1 }" /></template>',
      output: '<template><div :attr="{ a: 1 }" /></template>',
      options: ['always'],
      errors: ["A space is required after '{'."]
    },
    {
      code: '<template><div :attr="{a: 1}" /></template>',
      output: '<template><div :attr="{ a: 1 }" /></template>',
      options: ['always'],
      errors: [
        "A space is required after '{'.",
        "A space is required before '}'."
      ]
    },
    {
      code: '<template><div :[{a:1}]="{a:1}" /></template>',
      output: '<template><div :[{a:1}]="{ a:1 }" /></template>',
      options: ['always'],
      errors: [
        "A space is required after '{'.",
        "A space is required before '}'."
      ]
    },
    {
      code: `
      <template>
        <div v-bind="{ foo: { bar: 'baz' }}">
          Hello World
        </div>
      </template>`,
      output: `
      <template>
        <div v-bind="{foo: {bar: 'baz'} }">
          Hello World
        </div>
      </template>`,
      options: [
        'never',
        {
          objectsInObjects: true
        }
      ],
      errors: [
        "There should be no space after '{'.",
        "There should be no space after '{'.",
        "There should be no space before '}'.",
        "A space is required before '}'."
      ]
    },
    {
      code: `
      <template>
        <div v-bind="{ foo: { bar: 'baz' }}">
          Hello World
        </div>
      </template>`,
      output: `
      <template>
        <div v-bind="{foo: {bar: 'baz'}}">
          Hello World
        </div>
      </template>`,
      options: ['never'],
      errors: [
        "There should be no space after '{'.",
        "There should be no space after '{'.",
        "There should be no space before '}'."
      ]
    }
  ]
})
