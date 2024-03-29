/**
 * @author Toru Nagashima
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/space-unary-ops')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2015 }
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
      errors: ["Unexpected space after unary operator '-'."]
    },
    {
      code: '<template><div :attr="typeof(a)" /></template>',
      output: '<template><div :attr="typeof (a)" /></template>',
      errors: ["Unary word operator 'typeof' must be followed by whitespace."]
    },
    {
      code: '<template><div :[typeof(a)]="typeof(a)" /></template>',
      output: '<template><div :[typeof(a)]="typeof (a)" /></template>',
      errors: ["Unary word operator 'typeof' must be followed by whitespace."]
    },
    {
      code: '<template><div :[!a]="!a" /></template>',
      output: '<template><div :[!a]="! a" /></template>',
      options: [{ nonwords: true }],
      errors: ["Unary operator '!' must be followed by whitespace."]
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
      errors: ["Unexpected space after unary operator '-'."]
    }
  ]
})
