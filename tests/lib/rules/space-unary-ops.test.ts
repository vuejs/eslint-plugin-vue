/**
 * @author Toru Nagashima
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/space-unary-ops'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('space-unary-ops', rule, {
  valid: [
    '<template><div :attr="-a" /></template>',
    '<template><div :attr="typeof a" /></template>',
    '<template><div :[typeof(a)]="a" /></template>',
    {
      code: '<template><div :attr="! a" /></template>',
      options: [{ nonwords: true }]
    },
    {
      code: '<template><div :[!a]="a" /></template>',
      options: [{ nonwords: true }]
    },
    // CSS vars injection
    `
    <style>
    .text {
      padding: v-bind(\`\${-num}px\`)
    }
    </style>`
  ],
  invalid: [
    {
      code: '<template><div :attr="- a" /></template>',
      output: '<template><div :attr="-a" /></template>',
      errors: [
        {
          message: "Unexpected space after unary operator '-'.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      code: '<template><div :attr="typeof(a)" /></template>',
      output: '<template><div :attr="typeof (a)" /></template>',
      errors: [
        {
          message:
            "Unary word operator 'typeof' must be followed by whitespace.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      code: '<template><div :[typeof(a)]="typeof(a)" /></template>',
      output: '<template><div :[typeof(a)]="typeof (a)" /></template>',
      errors: [
        {
          message:
            "Unary word operator 'typeof' must be followed by whitespace.",
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      code: '<template><div :[!a]="!a" /></template>',
      output: '<template><div :[!a]="! a" /></template>',
      options: [{ nonwords: true }],
      errors: [
        {
          message: "Unary operator '!' must be followed by whitespace.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 25
        }
      ]
    },

    // CSS vars injection
    {
      code: `
      <style>
      .text {
        padding: v-bind(\`\${- num}px\`)
      }
      </style>`,
      output: `
      <style>
      .text {
        padding: v-bind(\`\${-num}px\`)
      }
      </style>`,
      errors: [
        {
          message: "Unexpected space after unary operator '-'.",
          line: 4,
          column: 28,
          endLine: 4,
          endColumn: 33
        }
      ]
    }
  ]
})
