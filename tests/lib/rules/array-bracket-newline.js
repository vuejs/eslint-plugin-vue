/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/array-bracket-newline')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2015
  }
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
      errors: [
        {
          message: "There should be no linebreak after '['.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: '<template><div :attr="[a\n]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      errors: [
        {
          message: "There should be no linebreak before ']'.",
          line: 2,
          column: 1,
          endLine: 2,
          endColumn: 2
        }
      ]
    },
    {
      code: '<template><div :attr="[\na\n]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      errors: [
        {
          message: "There should be no linebreak after '['.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        },
        {
          message: "There should be no linebreak before ']'.",
          line: 3,
          column: 1,
          endLine: 3,
          endColumn: 2
        }
      ]
    },
    {
      code: '<template><div :attr="[\na]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      options: ['never'],
      errors: [
        {
          message: "There should be no linebreak after '['.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: '<template><div :attr="[a\n]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      options: ['never'],
      errors: [
        {
          message: "There should be no linebreak before ']'.",
          line: 2,
          column: 1,
          endLine: 2,
          endColumn: 2
        }
      ]
    },
    {
      code: '<template><div :attr="[\na\n]" /></template>',
      output: '<template><div :attr="[a]" /></template>',
      options: ['never'],
      errors: [
        {
          message: "There should be no linebreak after '['.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        },
        {
          message: "There should be no linebreak before ']'.",
          line: 3,
          column: 1,
          endLine: 3,
          endColumn: 2
        }
      ]
    },
    {
      code: '<template><div :attr="[\na]" /></template>',
      output: '<template><div :attr="[\na\n]" /></template>',
      options: ['always'],
      errors: [
        {
          message: "A linebreak is required before ']'.",
          line: 2,
          column: 2,
          endLine: 2,
          endColumn: 3
        }
      ]
    },
    {
      code: '<template><div :attr="[a\n]" /></template>',
      output: '<template><div :attr="[\na\n]" /></template>',
      options: ['always'],
      errors: [
        {
          message: "A linebreak is required after '['.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: '<template><div :attr="[a]" /></template>',
      output: '<template><div :attr="[\na\n]" /></template>',
      options: ['always'],
      errors: [
        {
          message: "A linebreak is required after '['.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 24
        },
        {
          message: "A linebreak is required before ']'.",
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      code: '<template><div :[[attr]]="[a]" /></template>',
      output: '<template><div :[[attr]]="[\na\n]" /></template>',
      options: ['always'],
      errors: [
        {
          message: "A linebreak is required after '['.",
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 28
        },
        {
          message: "A linebreak is required before ']'.",
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 30
        }
      ]
    }
  ]
})
