/**
 * @author Yosuke Ota
 */
'use strict'

const { RuleTester, ESLint } = require('../../eslint-compat')
const semver = require('semver')
const rule = require('../../../lib/rules/no-sparse-arrays')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
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
          endLine: 3,
          ...(semver.gte(ESLint.version, '9.5.0')
            ? { column: 23, endColumn: 24 }
            : { column: 22, endColumn: 38 })
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
          endLine: 3,
          ...(semver.gte(ESLint.version, '9.5.0')
            ? { column: 23, endColumn: 24 }
            : { column: 22, endColumn: 30 })
        }
      ]
    }
  ]
})
