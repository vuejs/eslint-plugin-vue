/**
 * @author Toru Nagashima
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/array-bracket-spacing')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2015
  }
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
      errors: [
        {
          message: "There should be no space after '['.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      code: '<template><div :attr="[a ]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      errors: [
        {
          message: "There should be no space before ']'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      code: '<template><div :attr="[ a ]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      errors: [
        {
          message: "There should be no space after '['.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 25
        },
        {
          message: "There should be no space before ']'.",
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      code: '<template><div :attr="[ a]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      options: ['never'],
      errors: [
        {
          message: "There should be no space after '['.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      code: '<template><div :attr="[a ]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      options: ['never'],
      errors: [
        {
          message: "There should be no space before ']'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      code: '<template><div :attr="[ a ]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      options: ['never'],
      errors: [
        {
          message: "There should be no space after '['.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 25
        },
        {
          message: "There should be no space before ']'.",
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      code: '<template><div :attr="[ a]" /></template>',
      output: '<template><div :attr="[ a ]" /></template>',
      options: ['always'],
      errors: [
        {
          message: "A space is required before ']'.",
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      code: '<template><div :attr="[a ]" /></template>',
      output: '<template><div :attr="[ a ]" /></template>',
      options: ['always'],
      errors: [
        {
          message: "A space is required after '['.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: '<template><div :attr="[a]" /></template>',
      output: '<template><div :attr="[ a ]" /></template>',
      options: ['always'],
      errors: [
        {
          message: "A space is required after '['.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        },
        {
          message: "A space is required before ']'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      code: '<template><div :[[attr]]="[a]" /></template>',
      output: '<template><div :[[attr]]="[ a ]" /></template>',
      options: ['always'],
      errors: [
        {
          message: "A space is required after '['.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 28
        },
        {
          message: "A space is required before ']'.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 30
        }
      ]
    }
  ]
})
