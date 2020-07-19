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
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020 }
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
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo.bar()"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo.bar()"></div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div @[foo()]="bar"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @[foo]="bar()"></div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="()=>foo.bar()"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="()=>foo.bar()"></div></template>',
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="
          fn()
          fn()
        "></div>
      </template>`,
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="{}"></div>
      </template>`,
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="{return}"></div>
      </template>`,
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="fn() /* comment */"></div>
      </template>`,
      options: ['never', { ignoreIncludesComment: true }]
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo?.()"></div></template>',
      options: ['never']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div @click="foo"></div></template>',
      output: `<template><div @click="foo"></div></template>`,
      errors: [
        "Method calls inside of 'v-on' directives must have parentheses."
      ],
      options: ['always']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo()"></div></template>',
      output: `<template><div @click="foo"></div></template>`,
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ],
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo( )"></div></template>',
      output: `<template><div @click="foo"></div></template>`,
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ],
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: '<template><div @click="foo(/**/)"></div></template>',
      output: null,
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ],
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="/*comment*/fn()"></div>
        <div @click="fn()/*comment*/"></div>
        <div @click=fn()/*comment*/></div>
        <div @click="fn()// comment
          "></div>
      </template>`,
      output: null,
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses.",
        "Method calls without arguments inside of 'v-on' directives must not have parentheses.",
        "Method calls without arguments inside of 'v-on' directives must not have parentheses.",
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ],
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="fn();"></div>
      </template>`,
      output: `
      <template>
        <div @click="fn"></div>
      </template>`,
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ],
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click=fn();></div>
      </template>`,
      output: `
      <template>
        <div @click=fn></div>
      </template>`,
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ],
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click=" beforeSpace()"></div>
        <div @click='afterSpace() '></div>
      </template>`,
      output: `
      <template>
        <div @click="beforeSpace"></div>
        <div @click='afterSpace'></div>
      </template>`,
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses.",
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ],
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click=" &#x66;oo ( ) "></div>
      </template>`,
      output: `
      <template>
        <div @click="&#x66;oo"></div>
      </template>`,
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ],
      options: ['never']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="{(fn());;;}"></div>
      </template>`,
      output: `
      <template>
        <div @click="fn"></div>
      </template>`,
      errors: [
        "Method calls without arguments inside of 'v-on' directives must not have parentheses."
      ],
      options: ['never']
    }
  ]
})
