/**
 * @fileoverview enforce unified spacing in directive interpolations.
 * @author Rafael Milewski <https://github.com/milewski>
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/directive-interpolation-spacing')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

ruleTester.run('directive-interpolation-spacing', rule, {

  valid: [
    `<template><div :class="test"></div></template>`,
    `<template><div :class="test && { a: true }"></div></template>`,
    '<template><div :class="[ 1, 2, 3 ]"></div></template>',
    '<template><div :class="[ 1, 2, { test: 1 } ]"></div></template>',
    '<template><div :class="[ 1, 2, { test: [ 1, 2, 3 ] } ]"></div></template>',
    '<template><div :class="{ a: 123 }"></div></template>',
    '<template><div :class="{ [a]: 123 }"></div></template>',
    '<template><div :class="{ 1: 123 }"></div></template>',
    '<template><div :class="{ test && { a: 123 } }"></div></template>',
    '<template><div :class="{ test && { a: 123 } && test }"></div></template>',
    `<template><div :class="{ a: 123 }" :styles="{ backgroundColor: 'red' }"></div></template>`,
    `<template><div :class="{ a: 'a', b: 'b' }"></div></template>`,
    `<template><div :class="{ [ true ? 'a' : 'b' ]: 123 }"></div></template>`,
    `<template><div :class="{ [ false ? 'a' : true ? 'c' : 'b' ]: 123 }"></div></template>`,
    {
      code: `<template><div :class="{a: 'a', b: 'b'}"></div></template>`,
      options: ['never']
    },
    {
      code: `<template><div :class="[1, 2, 3]"></div></template>`,
      options: ['never']
    }
  ],

  invalid: [
    {
      code: `<template><div :class="{ a: 'a', b: 'b'}"></div></template>`,
      output: `<template><div :class="{ a: 'a', b: 'b' }"></div></template>`,
      options: ['always'],
      errors: [
        `Expected 1 space before '}', but not found.`
      ]
    },
    {
      code: '<template><div :class="{a: 123}"></div></template>',
      output: '<template><div :class="{ a: 123 }"></div></template>',
      options: ['always'],
      errors: [
        `Expected 1 space after '{', but not found.`,
        `Expected 1 space before '}', but not found.`
      ]
    },
    {
      code: '<template><div :class="   { a: 123 }   "></div></template>',
      output: '<template><div :class="{ a: 123 }"></div></template>',
      options: ['always'],
      errors: [
        `Expected no space before '{', but found.`,
        `Expected no space after '}', but found.`
      ]
    },
    {
      code: '<template><div :class="{ a: 123 , b:123 }"></div></template>',
      output: '<template><div :class="{ a: 123, b: 123 }"></div></template>',
      options: ['always'],
      errors: [
        `Expected no space before ',', but found.`,
        `Expected 1 space after ':', but not found.`
      ]
    },
    {
      code: '<template><div :class="{ a: 123,b: 123 }"></div></template>',
      output: '<template><div :class="{ a: 123, b: 123 }"></div></template>',
      options: ['always'],
      errors: [
        `Expected 1 space after ',', but not found.`
      ]
    },
    {
      code: '<template><div :class="{ [true?1:2]: 123 }"></div></template>',
      output: '<template><div :class="{ [true ? 1: 2]: 123 }"></div></template>',
      options: ['always'],
      errors: [
        `Expected 1 space before '?', but not found.`,
        `Expected 1 space after '?', but not found.`,
        `Expected 1 space after ':', but not found.`
      ]
    },
    {
      code: '<template><div :class="test &&{ test: 123 }"></div></template>',
      output: '<template><div :class="test && { test: 123 }"></div></template>',
      options: ['always'],
      errors: [
        `Expected 1 space before '{', but not found.`
      ]
    },
    {
      code: '<template><div :class="test &&{ test: 123 }&& test"></div></template>',
      output: '<template><div :class="test && { test: 123 } && test"></div></template>',
      options: ['always'],
      errors: [
        `Expected 1 space before '{', but not found.`,
        `Expected 1 space after '}', but not found.`
      ]
    },
    {
      code: '<template><div :class=" [ 1, 2, 3 ] "></div></template>',
      output: '<template><div :class="[ 1, 2, 3 ]"></div></template>',
      options: ['always'],
      errors: [
        `Expected no space before '[', but found.`,
        `Expected no space after ']', but found.`
      ]
    },
    {
      code: '<template><div :class="[1,2,3]"></div></template>',
      output: '<template><div :class="[ 1, 2, 3 ]"></div></template>',
      options: ['always'],
      errors: [
        `Expected 1 space after '[', but not found.`,
        `Expected 1 space after ',', but not found.`,
        `Expected 1 space after ',', but not found.`,
        `Expected 1 space before ']', but not found.`
      ]
    },
    /**
     * Options: never
     */
    {
      code: '<template><div :class="{ a: 123, b: 123 }"></div></template>',
      output: '<template><div :class="{a: 123, b: 123}"></div></template>',
      options: ['never'],
      errors: [
        `Expected no space after '{', but found.`,
        `Expected no space before '}', but found.`
      ]
    },
    {
      code: '<template><div :class="{a:123,b:123}"></div></template>',
      output: '<template><div :class="{a: 123, b: 123}"></div></template>',
      options: ['never'],
      errors: [
        `Expected 1 space after ':', but not found.`,
        `Expected 1 space after ',', but not found.`,
        `Expected 1 space after ':', but not found.`
      ]
    },
    {
      code: '<template><div :class="test &&{ test: 123 }&& test"></div></template>',
      output: '<template><div :class="test && {test: 123} && test"></div></template>',
      options: ['never'],
      errors: [
        `Expected 1 space before '{', but not found.`,
        `Expected no space after '{', but found.`,
        `Expected no space before '}', but found.`,
        `Expected 1 space after '}', but not found.`
      ]
    },
    {
      code: '<template><div :class="[ 1, 2, 3 ]"></div></template>',
      output: '<template><div :class="[1, 2, 3]"></div></template>',
      options: ['never'],
      errors: [
        `Expected no space after '[', but found.`,
        `Expected no space before ']', but found.`
      ]
    }
  ]
})
