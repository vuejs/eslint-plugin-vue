/**
 * @author Doug Wade <douglas.b.wade@gmail.com>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-attribute-name')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('valid-attribute-name', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><p foo /></template>'
    },
    {
      filename: 'test.vue',
      code: `<template><p foo="bar" /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><p foo-bar /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><p _foo-bar /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><p :foo-bar /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><p foo.bar /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><p quux-.9 /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><MyComponent 0abc="foo" /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><MyComponent :0abc="foo" /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><a :href="url"> ... </a></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><div v-bind:class="{ active: isActive }"></div></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><p v-if="seen">Now you see me</p></template>`
    },
    {
      filename: 'test.vue',
      code: `<a v-on:[eventName]="doSomething"> ... </a>`
    },
    {
      filename: 'test.vue',
      code: `<form v-on:submit.prevent="onSubmit"> ... </form>`
    },
    {
      filename: 'test.vue',
      code: `<a @[event]="doSomething"> ... </a>`
    },
    {
      filename: 'test.vue',
      code: `<template><div v-bind="..."></div></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><div v-0abc="..."></div></template>`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template><p 0abc /></template>`,
      errors: [
        {
          message: 'Attribute name 0abc is not valid.',
          line: 1,
          column: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><p -def></template>`,
      errors: [
        {
          message: 'Attribute name -def is not valid.',
          line: 1,
          column: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><p !ghi /></template>`,
      errors: [
        {
          message: 'Attribute name !ghi is not valid.',
          line: 1,
          column: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><p v-bind:0abc=""></template>`,
      errors: [
        {
          message: 'Attribute name 0abc is not valid.',
          line: 1,
          column: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><p :0abc="..." /></template>`,
      errors: [
        {
          message: 'Attribute name 0abc is not valid.',
          line: 1,
          column: 14
        }
      ]
    }
  ]
})
