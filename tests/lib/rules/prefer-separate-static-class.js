/**
 * @author Flo Edelmann
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/prefer-separate-static-class')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('prefer-separate-static-class', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `<template><div class="static-class" /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><div :class="dynamicClass" /></template>`
    },
    {
      filename: 'test.vue',
      code: '<template><div :class="`dynamic-class-${foo}`" /></template>'
    },
    {
      filename: 'test.vue',
      code: `<template><div :class="'dynamic-class-' + foo" /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><div class="static-class" :class="dynamicClass" /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><div class="static-class" :class="[dynamicClass]" /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><div class="static-class" :class="{'dynamic-class': foo}" /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><div class="static-class" :class="{foo, [computedName]: true}" /></template>`
    },
    {
      filename: 'test.vue',
      code: `<template><div class="static-class" :class="[dynamicClass, {'dynamic-class': foo}]" /></template>`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `<template><div v-bind:class="'static-class'" /></template>`,
      output: `<template><div class="static-class" /></template>`,
      errors: [
        {
          message:
            'Static class "static-class" should be in a static `class` attribute.',
          line: 1,
          endLine: 1,
          column: 30,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :class="'static-class'" /></template>`,
      output: `<template><div class="static-class" /></template>`,
      errors: [
        {
          message:
            'Static class "static-class" should be in a static `class` attribute.',
          line: 1,
          endLine: 1,
          column: 24,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :class="`static-class`" /></template>',
      output: '<template><div class="static-class" /></template>',
      errors: [
        {
          message:
            'Static class "static-class" should be in a static `class` attribute.',
          line: 1,
          endLine: 1,
          column: 24,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :class='"static-class"' /></template>`,
      output: `<template><div class="static-class" /></template>`,
      errors: [
        {
          message:
            'Static class "static-class" should be in a static `class` attribute.',
          line: 1,
          endLine: 1,
          column: 24,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :class="['static-class']" /></template>`,
      output: `<template><div class="static-class" /></template>`,
      errors: [
        {
          message:
            'Static class "static-class" should be in a static `class` attribute.',
          line: 1,
          endLine: 1,
          column: 25,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :class="{'static-class': true}" /></template>`,
      output: `<template><div class="static-class" /></template>`,
      errors: [
        {
          message:
            'Static class "static-class" should be in a static `class` attribute.',
          line: 1,
          endLine: 1,
          column: 25,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :class="{foo: true}" /></template>`,
      output: `<template><div class="foo" /></template>`,
      errors: [
        {
          message:
            'Static class "foo" should be in a static `class` attribute.',
          line: 1,
          endLine: 1,
          column: 25,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :class="{['static-class']: true}" /></template>`,
      output: `<template><div class="static-class" /></template>`,
      errors: [
        {
          message:
            'Static class "static-class" should be in a static `class` attribute.',
          line: 1,
          endLine: 1,
          column: 26,
          endColumn: 40
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :class="['static-class', dynamicClass]" /></template>`,
      output: `<template><div class="static-class" :class="[dynamicClass]" /></template>`,
      errors: [
        {
          message:
            'Static class "static-class" should be in a static `class` attribute.',
          line: 1,
          endLine: 1,
          column: 25,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :class="[dynamicClass, otherDynamicClass, 'static-class']" /></template>`,
      output: `<template><div class="static-class" :class="[dynamicClass, otherDynamicClass]" /></template>`,
      errors: [
        {
          message:
            'Static class "static-class" should be in a static `class` attribute.',
          line: 1,
          endLine: 1,
          column: 58,
          endColumn: 72
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :class="{'static-class': true, 'dynamic-class': foo}" /></template>`,
      output: `<template><div class="static-class" :class="{'dynamic-class': foo}" /></template>`,
      errors: [
        {
          message:
            'Static class "static-class" should be in a static `class` attribute.',
          line: 1,
          endLine: 1,
          column: 25,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :class="[{'dynamic-class': foo, 'static-class': true}]" /></template>`,
      output: `<template><div class="static-class" :class="[{'dynamic-class': foo}]" /></template>`,
      errors: [
        {
          message:
            'Static class "static-class" should be in a static `class` attribute.',
          line: 1,
          endLine: 1,
          column: 48,
          endColumn: 62
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `<template><div :class="[dynamicClass, {staticClass: true}]" /></template>`,
      output: `<template><div class="staticClass" :class="[dynamicClass]" /></template>`,
      errors: [
        {
          message:
            'Static class "staticClass" should be in a static `class` attribute.',
          line: 1,
          endLine: 1,
          column: 40,
          endColumn: 51
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div
            class="other-class"
            other-attribute
            :class="[
              {'dynamic-class-a': foo, 'static-class': true},
              dynamicClassB,
            ]" />
        </template>
      `,
      output: `
        <template>
          <div
            class="other-class static-class"
            other-attribute
            :class="[
              {'dynamic-class-a': foo},
              dynamicClassB,
            ]" />
        </template>
      `,
      errors: [
        {
          message:
            'Static class "static-class" should be in a static `class` attribute.',
          line: 7,
          endLine: 7,
          column: 40,
          endColumn: 54
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div
            class="other-class-a other-class-b"
            other-attribute
            :class="[
              'static-class-a',
              {'static-class-b': true, 'dynamic-class-a': foo},
              dynamicClassB,
            ]" />
        </template>
      `,
      output: `
        <template>
          <div
            class="other-class-a other-class-b static-class-a"
            other-attribute
            :class="[
              {'static-class-b': true, 'dynamic-class-a': foo},
              dynamicClassB,
            ]" />
        </template>
      `,
      errors: [
        {
          message:
            'Static class "static-class-a" should be in a static `class` attribute.',
          line: 7,
          endLine: 7,
          column: 15,
          endColumn: 31
        },
        {
          message:
            'Static class "static-class-b" should be in a static `class` attribute.',
          line: 8,
          endLine: 8,
          column: 16,
          endColumn: 32
        }
      ]
    }
  ]
})
