/**
 * @author Yizack Rangel
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-duplicate-class-names')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-duplicate-class-names', rule, {
  valid: [
    {
      filename: 'no-classes.vue',
      code: '<template><div></div></template>'
    },
    {
      filename: 'one-class.vue',
      code: '<template><div class="foo"></div></template>'
    },
    {
      filename: 'multiple-different-classes.vue',
      code: '<template><div class="foo bar baz"></div></template>'
    },
    {
      filename: 'no-duplicate-class-in-directive-string.vue',
      code: `<template><div :class="'foo bar baz'"></div></template>`
    },
    {
      filename: 'no-duplicate-class-in-directive-object.vue',
      code: `<template><div :class="{ 'foo bar baz': true }"></div></template>`
    },
    {
      filename: 'duplicate-class-and-directive.vue',
      code: `<template><div class="foo" :class="'foo'"></div></template>`
    },
    {
      filename: 'duplicate-class-in-different-directive-object-keys.vue',
      code: `<template><div :class="{ 'foo': true, 'foo bar': true }"></div></template>`
    },
    {
      filename: 'duplicate-class-in-different-directive-array-items.vue',
      code: `<template><div :class="['foo', 'foo bar']"></div></template>`
    },
    {
      filename: 'duplicate-class-in-different-directive-mixed.vue',
      code: `<template><div :class="['foo', { 'foo bar': true }]"></div></template>`
    }
  ],
  invalid: [
    {
      filename: 'duplicate-class.vue',
      code: '<template><div class="foo foo"></div></template>',
      output: '<template><div class="foo"></div></template>',
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'multiple-duplicate-classes.vue',
      code: '<template><div class="foo bar foo baz bar"></div></template>',
      output: '<template><div class="foo bar baz"></div></template>',
      errors: [
        {
          message: "Duplicate class name 'foo, bar'.",
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'duplicate-class-in-directive-string-literal.vue',
      code: `<template><div :class="'foo foo'"></div></template>`,
      output: `<template><div :class="'foo'"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'duplicate-class-directive-object-key.vue',
      code: `<template><div :class="{ 'foo foo': true }"></div></template>`,
      output: `<template><div :class="{ 'foo': true }"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal'
        }
      ]
    },
    {
      filename: 'multiple-duplicate-class-directive-object-keys.vue',
      code: `<template><div :class="{ 'foo foo bar': true, 'bar bar baz': true }"></div></template>`,
      output: `<template><div :class="{ 'foo bar': true, 'bar baz': true }"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'Literal'
        },
        {
          message: "Duplicate class name 'bar'.",
          type: 'Literal'
        }
      ]
    },
    {
      filename: 'duplicate-class-directive-array-item.vue',
      code: `<template><div :class="['foo foo']"></div></template>`,
      output: `<template><div :class="['foo']"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'multiple-duplicate-classes-directive-array-items.vue',
      code: `<template><div :class="['foo foo', 'bar bar baz']"></div></template>`,
      output: `<template><div :class="['foo', 'bar baz']"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VAttribute'
        },
        {
          message: "Duplicate class name 'bar'.",
          type: 'VAttribute'
        }
      ]
    },
    {
      filename: 'duplicate-class-in-mixed-directive.vue',
      code: `<template><div :class="['foo foo', { 'bar bar baz': true }]"></div></template>`,
      output: `<template><div :class="['foo', { 'bar baz': true }]"></div></template>`,
      errors: [
        {
          message: "Duplicate class name 'foo'.",
          type: 'VAttribute'
        },
        {
          message: "Duplicate class name 'bar'.",
          type: 'Literal'
        }
      ]
    }
  ]
})
