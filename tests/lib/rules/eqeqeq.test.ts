/**
 * @author Toru Nagashima
 */
import semver from 'semver'
import { RuleTester, ESLint } from '../../eslint-compat'
import rule from '../../../lib/rules/eqeqeq'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('eqeqeq', rule, {
  valid: [
    '<template><div :attr="a === 1" /></template>',
    // CSS vars injection
    `
    <style>
    .text {
      color: v-bind(a === 1 ? 'red' : 'blue')
    }
    </style>`
  ],
  invalid: [
    {
      code: '<template><div :attr="a == 1" /></template>',
      errors: [
        {
          message: "Expected '===' and instead saw '=='.",
          suggestions: semver.gte(ESLint.version, '9.26.0')
            ? [
                {
                  desc: "Use '===' instead of '=='.",
                  output: `<template><div :attr="a === 1" /></template>`
                }
              ]
            : [],
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    // CSS vars injection
    {
      code: `
      <style>
      .text {
        color: v-bind(a == 1 ? 'red' : 'blue')
      }
      </style>`,
      errors: [
        {
          message: "Expected '===' and instead saw '=='.",
          suggestions: semver.gte(ESLint.version, '9.26.0')
            ? [
                {
                  desc: "Use '===' instead of '=='.",
                  output: `
      <style>
      .text {
        color: v-bind(a === 1 ? 'red' : 'blue')
      }
      </style>`
                }
              ]
            : [],
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 27
        }
      ]
    }
  ]
})
