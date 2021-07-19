/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-useless-concat')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
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
      errors: ['Unexpected string concatenation of literals.']
    },
    {
      code: `<template><div :[\`foo\`+\`bar\`]="a" /></template>`,
      errors: ['Unexpected string concatenation of literals.']
    },
    // CSS vars injection
    {
      code: `
      <style>
      .text {
        color: v-bind('"re" + "d"')
      }
      </style>`,
      errors: ['Unexpected string concatenation of literals.']
    }
  ]
})
