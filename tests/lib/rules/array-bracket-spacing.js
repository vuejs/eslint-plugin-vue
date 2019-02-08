/**
 * @author Toru Nagashima
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/array-bracket-spacing')

const tester = new RuleTester({
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('array-bracket-spacing', rule, {
  valid: [
    '<template><div :attr="[a]" /></template>',
    {
      code: '<template><div :attr="[a]" /></template>',
      options: ['never']
    },
    {
      code: '<template><div :attr="[ a ]" /></template>',
      options: ['always']
    },
    '<template><div :[attr]="a" /></template>',
    {
      code: '<template><div :[attr]="a" /></template>',
      options: ['always']
    },
    '<template><div :[[attr]]="a" /></template>',
    {
      code: '<template><div :[[attr]]="a" /></template>',
      options: ['always']
    }
  ],
  invalid: [
    {
      code: '<template><div :attr="[ a]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      errors: ["There should be no space after '['."]
    },
    {
      code: '<template><div :attr="[a ]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      errors: ["There should be no space before ']'."]
    },
    {
      code: '<template><div :attr="[ a ]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      errors: [
        "There should be no space after '['.",
        "There should be no space before ']'."
      ]
    },
    {
      code: '<template><div :attr="[ a]" /></template>',
      options: ['never'],
      output: '<template><div :attr="[a]" /></template>',
      errors: ["There should be no space after '['."]
    },
    {
      code: '<template><div :attr="[a ]" /></template>',
      options: ['never'],
      output: '<template><div :attr="[a]" /></template>',
      errors: ["There should be no space before ']'."]
    },
    {
      code: '<template><div :attr="[ a ]" /></template>',
      options: ['never'],
      output: '<template><div :attr="[a]" /></template>',
      errors: [
        "There should be no space after '['.",
        "There should be no space before ']'."
      ]
    },
    {
      code: '<template><div :attr="[ a]" /></template>',
      options: ['always'],
      output: '<template><div :attr="[ a ]" /></template>',
      errors: ["A space is required before ']'."]
    },
    {
      code: '<template><div :attr="[a ]" /></template>',
      options: ['always'],
      output: '<template><div :attr="[ a ]" /></template>',
      errors: ["A space is required after '['."]
    },
    {
      code: '<template><div :attr="[a]" /></template>',
      options: ['always'],
      output: '<template><div :attr="[ a ]" /></template>',
      errors: [
        "A space is required after '['.",
        "A space is required before ']'."
      ]
    },
    {
      code: '<template><div :[[attr]]="[a]" /></template>',
      options: ['always'],
      output: '<template><div :[[attr]]="[ a ]" /></template>',
      errors: [
        "A space is required after '['.",
        "A space is required before ']'."
      ]
    }
  ]
})
