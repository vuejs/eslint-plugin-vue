/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-sparse-arrays')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('no-sparse-arrays', rule, {
  valid: [
    `<template>
      <div :class="['foo', 'bar']" />
    </template>`,
    `<template>
      <div v-bind:[['foo'][0]]="bar" />
    </template>`
  ],
  invalid: [
    {
      code: `
      <template>
        <div :class="[, 'foo', 'bar']" />
      </template>`,
      errors: [
        {
          message: 'Unexpected comma in middle of array.',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 38
        }
      ]
    },
    {
      code: `
      <template>
        <div v-bind:[[,'foo'][1]]="bar" />
      </template>`,
      errors: [
        {
          message: 'Unexpected comma in middle of array.',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 30
        }
      ]
    }
  ]
})
