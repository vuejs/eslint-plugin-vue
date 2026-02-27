/**
 * @author Yosuke Ota
 */
import { RuleTester, ESLint } from '../../eslint-compat.ts'
import semver from 'semver'
import rule from '../../../lib/rules/no-sparse-arrays'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
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
