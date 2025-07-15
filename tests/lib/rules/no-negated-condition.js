/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-negated-condition')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-negated-condition', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :class="foo ? 'baz' : 'bar'" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :style="{ color: isActive ? 'red' : 'blue' }" />
      </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :class="!foo ? 'bar' : 'baz'" />
      </template>
      `,
      errors: [
        {
          message: 'Unexpected negated condition.',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 42
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :style="{
          'display': !isVisible ? 'none' : 'block',
          'color': 'red'
        }" />
      </template>
      `,
      errors: [
        {
          message: 'Unexpected negated condition.',
          line: 4,
          column: 22,
          endLine: 4,
          endColumn: 51
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :class="{
          'hidden': !foo ? true : false,
          'visible': bar
        }" />
      </template>
      `,
      errors: [
        {
          message: 'Unexpected negated condition.',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 40
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :disabled="!enabled ? true : false" />
      </template>
      `,
      errors: [
        {
          message: 'Unexpected negated condition.',
          line: 3,
          column: 25,
          endLine: 3,
          endColumn: 48
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :class="a !== b ? 'different' : 'same'" />
      </template>
      `,
      errors: [
        {
          message: 'Unexpected negated condition.',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 52
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :class="a != b ? 'not-equal' : 'equal'" />
      </template>
      `,
      errors: [
        {
          message: 'Unexpected negated condition.',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 52
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :style="{
          opacity: !(x && y) ? 0 : 1
        }" />
      </template>
      `,
      errors: [
        {
          message: 'Unexpected negated condition.',
          line: 4,
          column: 20,
          endLine: 4,
          endColumn: 37
        }
      ]
    }
  ]
})
