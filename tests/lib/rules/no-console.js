/**
 * @author ItMaga <https://github.com/ItMaga>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-console')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-console', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="Console.log">button</button>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button>{{ console.warn('warn') }}</button>
      </template>
      `,
      options: [{ allow: ['warn'] }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button :foo="console.error">button</button>
      </template>
      `,
      options: [{ allow: ['error'] }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button :foo="console.log">{{ console.log('test') }}</button>
        {{ console.warn('test') }}
        {{ console.info('test') }}
      </template>
      `,
      options: [{ allow: ['log', 'warn', 'info'] }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="console.log">button</button>
      </template>
      `,
      errors: [
        {
          message: 'Unexpected console statement.',
          line: 3,
          column: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button :foo="console.log">{{ console.log('test') }}</button>
      </template>
      `,
      errors: [
        {
          message: 'Unexpected console statement.',
          line: 3,
          column: 23
        },
        {
          message: 'Unexpected console statement.',
          line: 3,
          column: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="() => console.log">button</button>
      </template>
      `,
      errors: [
        {
          message: 'Unexpected console statement.',
          line: 3,
          column: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="console.log">button</button>
        {{ console.error('test') }}
      </template>
      `,
      options: [{ allow: ['error'] }],
      errors: [
        {
          message: 'Unexpected console statement.',
          line: 3,
          column: 25
        }
      ]
    }
  ]
})
