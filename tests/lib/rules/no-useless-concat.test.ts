/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-useless-concat'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('no-useless-concat', rule, {
  valid: [
    `<template><div :attr="'foo-bar'" /></template>`,
    '<template><div attr="foo-bar" /></template>',
    `<template><div :[\`foo-bar\`]="a" /></template>`,
    // CSS vars injection
    `
    <style>
    .text {
      color: v-bind('"red"')
    }
    </style>`
  ],
  invalid: [
    {
      code: `<template><div :attr="'foo'+'bar'" /></template>`,
      errors: [
        {
          message: 'Unexpected string concatenation of literals.',
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `<template><div :[\`foo\`+\`bar\`]="a" /></template>`,
      errors: [
        {
          message: 'Unexpected string concatenation of literals.',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    // CSS vars injection
    {
      code: `
      <style>
      .text {
        color: v-bind('"re" + "d"')
      }
      </style>`,
      errors: [
        {
          message: 'Unexpected string concatenation of literals.',
          line: 4,
          column: 29,
          endLine: 4,
          endColumn: 30
        }
      ]
    }
  ]
})
