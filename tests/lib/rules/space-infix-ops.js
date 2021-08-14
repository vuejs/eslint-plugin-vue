/**
 * @author Toru Nagashima
 */
'use strict'

const { RuleTester, ESLint } = require('../../eslint-compat')
const semver = require('semver')
const rule = require('../../../lib/rules/space-infix-ops')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015 }
})

const message = semver.lt(ESLint.version, '5.10.0')
  ? () => 'Infix operators must be spaced.'
  : (operator) => `Operator '${operator}' must be spaced.`

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
      errors: [message('+')]
    },
    {
      code: '<template><div :attr="a?1 : 2" /></template>',
      output: '<template><div :attr="a ? 1 : 2" /></template>',
      errors: [message('?')]
    },
    {
      code: '<template><div :attr="a ? 1:2" /></template>',
      output: '<template><div :attr="a ? 1 : 2" /></template>',
      errors: [message(':')]
    },
    {
      code: '<template><div :[1+2]="1+2" /></template>',
      output: '<template><div :[1+2]="1 + 2" /></template>',
      errors: [message('+')]
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
      errors: [message('+'), message('+')]
    }
  ]
})
