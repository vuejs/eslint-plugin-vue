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
      code: `<template><div :class="{'static-class': true, 'dynamic-class': foo}" /></template>`,
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
