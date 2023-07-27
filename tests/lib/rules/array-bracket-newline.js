/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/array-bracket-newline')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

tester.run('array-bracket-newline', rule, {
  valid: [
    '<template><div :attr="[a]" /></template>',
    '<template><div :attr="[\na,\nb,\nc\n]" /></template>',
    {
      code: '<template><div :attr="[a]" /></template>',
      options: ['never']
    },
    {
      code: '<template><div :attr="[\na\n]" /></template>',
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
      code: '<template><div :attr="[\na]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      errors: ["There should be no linebreak after '['."]
    },
    {
      code: '<template><div :attr="[a\n]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      errors: ["There should be no linebreak before ']'."]
    },
    {
      code: '<template><div :attr="[\na\n]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      errors: [
        "There should be no linebreak after '['.",
        "There should be no linebreak before ']'."
      ]
    },
    {
      code: '<template><div :attr="[\na]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      options: ['never'],
      errors: ["There should be no linebreak after '['."]
    },
    {
      code: '<template><div :attr="[a\n]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      options: ['never'],
      errors: ["There should be no linebreak before ']'."]
    },
    {
      code: '<template><div :attr="[\na\n]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      options: ['never'],
      errors: [
        "There should be no linebreak after '['.",
        "There should be no linebreak before ']'."
      ]
    },
    {
      code: '<template><div :attr="[\na]" /></template>',
      output: '<template><div :attr="[\na\n]" /></template>',
      options: ['always'],
      errors: ["A linebreak is required before ']'."]
    },
    {
      code: '<template><div :attr="[a\n]" /></template>',
      output: '<template><div :attr="[\na\n]" /></template>',
      options: ['always'],
      errors: ["A linebreak is required after '['."]
    },
    {
      code: '<template><div :attr="[a]" /></template>',
      output: '<template><div :attr="[\na\n]" /></template>',
      options: ['always'],
      errors: [
        "A linebreak is required after '['.",
        "A linebreak is required before ']'."
      ]
    },
    {
      code: '<template><div :[[attr]]="[a]" /></template>',
      output: '<template><div :[[attr]]="[\na\n]" /></template>',
      options: ['always'],
      errors: [
        "A linebreak is required after '['.",
        "A linebreak is required before ']'."
      ]
    }
  ]
})
