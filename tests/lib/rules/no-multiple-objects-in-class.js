/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-multiple-objects-in-class')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' }
})

ruleTester.run('no-multiple-objects-in-class', rule, {
  valid: [
    `<template><div :class="[{'foo': isFoo}]" /></template>`,
    `<template><div :class="[{'foo': isFoo, 'bar': isBar}]" /></template>`,
    `<template><div v-foo:class="[{'foo': isFoo}, {'bar': isBar}]" /></template>`
  ],
  invalid: [
    {
      code: `<template><div v-bind:class="[{'foo': isFoo}, {'bar': isBar}]" /></template>`,
      errors: [
        {
          message: 'Unexpected multiple objects. Merge objects.',
          type: 'VAttribute'
        }
      ]
    },
    {
      code: `<template><div :class="[{'foo': isFoo}, {'bar': isBar}]" /></template>`,
      errors: [
        {
          message: 'Unexpected multiple objects. Merge objects.',
          type: 'VAttribute'
        }
      ]
    },

    // sparse array
    {
      code: `<template><div v-bind:class="[,{'foo': isFoo}, {'bar': isBar}]" /></template>`,
      errors: [
        {
          message: 'Unexpected multiple objects. Merge objects.',
          type: 'VAttribute'
        }
      ]
    }
  ]
})
