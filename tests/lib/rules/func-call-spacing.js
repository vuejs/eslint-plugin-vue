/**
 * @author Yosuke Ota
 */
'use strict'

const semver = require('semver')
const { RuleTester } = require('../../eslint-compat')
const rule = require('../../../lib/rules/func-call-spacing')
const { eslintStylisticVersion } = require('../../test-utils/eslint-stylistic')

const tester = new RuleTester({
  languageOptions: { parser: require('vue-eslint-parser'), ecmaVersion: 2020 }
})

/**
 * @param {number} line
 * @param {number} column
 * @param {'unexpected' | 'missing'} errorType
 * @returns {{line: number, column: number, endLine: number, endColumn: number}}
 */
function getErrorPosition(line, column, errorType) {
  if (
    eslintStylisticVersion !== undefined &&
    semver.lt(eslintStylisticVersion, '3.0.0')
  ) {
    return {
      line,
      column: column - 3,
      endLine: undefined,
      endColumn: undefined
    }
  }

  if (
    eslintStylisticVersion === undefined ||
    semver.satisfies(process.version, '<19.0.0 || ^21.0.0')
  ) {
    return {
      line,
      column: errorType === 'unexpected' ? column : column - 1,
      endLine: line,
      endColumn: column
    }
  }

  return {
    line,
    column,
    endLine: line,
    endColumn: errorType === 'unexpected' ? column + 1 : column
  }
}

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
    },
    // CSS vars injection
    `
    <style>
    .text {
      color: v-bind('foo()')
    }
    </style>`
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
          message: 'Unexpected whitespace between function name and paren.',
          ...getErrorPosition(3, 23, 'unexpected')
        }
      ]
    },
    {
      code: `
      <template>
        <div :foo="foo()" />
      </template>
      `,
      output: `
      <template>
        <div :foo="foo ()" />
      </template>
      `,
      options: ['always'],
      errors: [
        {
          message: 'Missing space between function name and paren.',
          ...getErrorPosition(3, 23, 'missing')
        }
      ]
    },

    // CSS vars injection
    {
      code: `
      <style>
      .text {
        color: v-bind('foo ()')
      }
      </style>`,
      output: `
      <style>
      .text {
        color: v-bind('foo()')
      }
      </style>`,
      errors: [
        {
          message: 'Unexpected whitespace between function name and paren.',
          ...getErrorPosition(4, 27, 'unexpected')
        }
      ]
    }
  ]
})
