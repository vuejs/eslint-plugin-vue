/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/dot-notation')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('dot-notation', rule, {
  valid: [
    `<template><div :attr="foo.bar" /></template>`,
    '<template><div attr="foo[\'bar\']" /></template>',
    `<template><div :[foo.bar]="a" /></template>`,
    `<template><div :attr="foo[bar]" /></template>`,
    `<template><div :[foo[bar]]="a" /></template>`,
    // CSS vars injection
    `
    <style>
    .text {
      color: v-bind(foo.bar)
    }
    </style>`
  ],
  invalid: [
    {
      code: `<template><div :attr="foo['bar']" /></template>`,
      output: `<template><div :attr="foo.bar" /></template>`,
      errors: [
        {
          message: '["bar"] is better written in dot notation.',
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      code: `<template><div :[foo[\`bar\`]]="a" /></template>`,
      output: `<template><div :[foo.bar]="a" /></template>`,
      errors: [
        {
          message: '[`bar`] is better written in dot notation.',
          line: 1,
          column: 22,
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
        color: v-bind(foo[\`bar\`])
      }
      </style>`,
      output: `
      <style>
      .text {
        color: v-bind(foo.bar)
      }
      </style>`,
      errors: [
        {
          message: '[`bar`] is better written in dot notation.',
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 32
        }
      ]
    },
    {
      code: `
      <style>
      .text {
        color: v-bind("foo[\`bar\`]")
      }
      </style>`,
      output: `
      <style>
      .text {
        color: v-bind("foo.bar")
      }
      </style>`,
      errors: [
        {
          message: '[`bar`] is better written in dot notation.',
          line: 4,
          column: 28,
          endLine: 4,
          endColumn: 33
        }
      ]
    }
  ]
})
