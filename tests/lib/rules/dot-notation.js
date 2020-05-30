/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/dot-notation')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('dot-notation', rule, {
  valid: [
    `<template><div :attr="foo.bar" /></template>`,
    '<template><div attr="foo[\'bar\']" /></template>',
    `<template><div :[foo.bar]="a" /></template>`,
    `<template><div :attr="foo[bar]" /></template>`,
    `<template><div :[foo[bar]]="a" /></template>`
  ],
  invalid: [
    {
      code: `<template><div :attr="foo['bar']" /></template>`,
      output: `<template><div :attr="foo.bar" /></template>`,
      errors: ['["bar"] is better written in dot notation.']
    },
    {
      code: `<template><div :[foo[\`bar\`]]="a" /></template>`,
      output: `<template><div :[foo.bar]="a" /></template>`,
      errors: ['[`bar`] is better written in dot notation.']
    }
  ]
})
