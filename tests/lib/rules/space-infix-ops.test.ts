/**
 * @author Toru Nagashima
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/space-infix-ops'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

const message = (operator: string) => `Operator '${operator}' must be spaced.`

tester.run('space-infix-ops', rule, {
  valid: [
    '<template><div :attr="a + 1" /></template>',
    '<template><div :attr="a ? 1 : 2" /></template>',
    '<template><div :[1+2]="a" /></template>',

    // CSS vars injection
    `
    <style>
    .text {
      padding: v-bind('a + b + "px"')
    }
    </style>`
  ],
  invalid: [
    {
      code: '<template><div :attr="a+1" /></template>',
      output: '<template><div :attr="a + 1" /></template>',
      errors: [
        {
          message: message('+'),
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      code: '<template><div :attr="a?1 : 2" /></template>',
      output: '<template><div :attr="a ? 1 : 2" /></template>',
      errors: [
        {
          message: message('?'),
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      code: '<template><div :attr="a ? 1:2" /></template>',
      output: '<template><div :attr="a ? 1 : 2" /></template>',
      errors: [
        {
          message: message(':'),
          line: 1,
          column: 28,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: '<template><div :[1+2]="1+2" /></template>',
      output: '<template><div :[1+2]="1 + 2" /></template>',
      errors: [
        {
          message: message('+'),
          line: 1,
          column: 25,
          endLine: 1,
          endColumn: 26
        }
      ]
    },

    // CSS vars injection
    {
      code: `
      <style>
      .text {
        padding: v-bind('a+b+"px"')
      }
      </style>`,
      output: `
      <style>
      .text {
        padding: v-bind('a + b + "px"')
      }
      </style>`,
      errors: [
        {
          message: message('+'),
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 28
        },
        {
          message: message('+'),
          line: 4,
          column: 29,
          endLine: 4,
          endColumn: 30
        }
      ]
    }
  ]
})
