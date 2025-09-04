/**
 * @author Toru Nagashima
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/key-spacing')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
})

tester.run('key-spacing', rule, {
  valid: [
    '<template><div :attr="{a: 1}" /></template>',
    '<template><div :[{a:1}[`a`]]="a" /></template>',
    {
      code: '<template><div :[{a:1}[`a`]]="a" /></template>',
      options: [{ beforeColon: true }]
    }
  ],
  invalid: [
    {
      code: '<template><div :attr="{a :1}" /></template>',
      output: '<template><div :attr="{a: 1}" /></template>',
      errors: [
        {
          message: "Extra space after key 'a'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 26
        },
        {
          message: "Missing space before value for key 'a'.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      code: '<template><div :[{a:1}[`a`]]="{a:1}[`a`]" /></template>',
      output: '<template><div :[{a:1}[`a`]]="{a : 1}[`a`]" /></template>',
      options: [{ beforeColon: true }],
      errors: [
        {
          message: "Missing space after key 'a'.",
          line: 1,
          column: 32,
          endLine: 1,
          endColumn: 33
        },
        {
          message: "Missing space before value for key 'a'.",
          line: 1,
          column: 34,
          endLine: 1,
          endColumn: 35
        }
      ]
    }
  ]
})
