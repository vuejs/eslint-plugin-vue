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
        "Extra space after key 'a'.",
        "Missing space before value for key 'a'."
      ]
    },
    {
      code: '<template><div :[{a:1}[`a`]]="{a:1}[`a`]" /></template>',
      output: '<template><div :[{a:1}[`a`]]="{a : 1}[`a`]" /></template>',
      options: [{ beforeColon: true }],
      errors: [
        "Missing space after key 'a'.",
        "Missing space before value for key 'a'."
      ]
    }
  ]
})
