/**
 * @author Yosuke Ota
 */
'use strict'

const { RuleTester, CLIEngine } = require('eslint')
const semver = require('semver')
const rule = require('../../../lib/rules/func-call-spacing')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020 }
})

tester.run('func-call-spacing', rule, {
  valid: [
    `
    <template>
      <div :foo="foo()" />
    </template>
    `,
    {
      code: `
      <template>
        <div :foo="foo ()" />
      </template>
      `,
      options: ['always']
    },
    `
    <template>
      <div :[foo()]="value" />
    </template>
    `,
    {
      code: `
      <template>
        <div :[foo()]="value" />
      </template>
      `,
      options: ['always']
    }
  ],
  invalid: [
    {
      code: `
      <template>
        <div :foo="foo ()" />
      </template>
      `,
      output: `
      <template>
        <div :foo="foo()" />
      </template>
      `,
      errors: [
        {
          message: semver.lt(CLIEngine.version, '7.0.0')
            ? 'Unexpected newline between function name and paren.'
            : 'Unexpected whitespace between function name and paren.',
          line: 3
        }
      ]
    },
    {
      code: `
      <template>
        <div :foo="foo()" />
      </template>
      `,
      options: ['always'],
      output: `
      <template>
        <div :foo="foo ()" />
      </template>
      `,
      errors: [
        {
          message: 'Missing space between function name and paren.',
          line: 3
        }
      ]
    }
  ]
})
