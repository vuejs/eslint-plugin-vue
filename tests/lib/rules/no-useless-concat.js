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
    `<template><div :[\`foo-bar\`]="a" /></template>`
  ],
  invalid: [
    {
      code: `<template><div :attr="'foo'+'bar'" /></template>`,
      errors: ['Unexpected string concatenation of literals.']
    },
    {
      code: `<template><div :[\`foo\`+\`bar\`]="a" /></template>`,
      errors: ['Unexpected string concatenation of literals.']
    }
  ]
})
