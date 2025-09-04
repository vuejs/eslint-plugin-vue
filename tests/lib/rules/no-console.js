/**
 * @author ItMaga <https://github.com/ItMaga>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-console')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
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
    },
    {
      filename: 'test.vue',
      code: `
      <template><div /></template>
      <script setup>
        console.log('test')
      </script>
      `
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
          column: 25,
          endLine: 3,
          endColumn: 32
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
          column: 23,
          endLine: 3,
          endColumn: 30
        },
        {
          message: 'Unexpected console statement.',
          line: 3,
          column: 39,
          endLine: 3,
          endColumn: 46
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
          column: 31,
          endLine: 3,
          endColumn: 38
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
          column: 25,
          endLine: 3,
          endColumn: 32
        }
      ]
    }
  ]
})
