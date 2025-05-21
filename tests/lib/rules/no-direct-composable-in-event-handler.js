/**
 * @fileoverview Disallow direct composable usage in event handler.
 * @author Nils Haberkamp
 */
'use strict'

const rule = require('../../../lib/rules/no-direct-composable-in-event-handler')
const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})

ruleTester.run('no-direct-composable-in-event-handler', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="foo">Click me</button>
      </template>
      <script setup>
      function foo() {}
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') }
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="() => console.log('foo')">Click me</button>
      </template>`,
      languageOptions: { parser: require('vue-eslint-parser') }
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="useFoo">Click me</button>
      </template>
      <script>
      export default {
        setup() {
          function useFoo() {}

          return { useFoo }
        }
      }
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') },
      errors: [
        {
          message: 'Direct composable usage in event handler is not allowed.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="useFoo">Click me</button>
      </template>
      <script setup>
      function useFoo() {}
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') },
      errors: [
        {
          message: 'Direct composable usage in event handler is not allowed.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @keydown.enter="useFoo">Click me</button>
      </template>
      <script setup>
      function useFoo() {}
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') },
      errors: [
        {
          message: 'Direct composable usage in event handler is not allowed.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="useFoo">Click me</button>
      </template>
      <script setup lang="ts">
      function useFoo() {}
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          message: 'Direct composable usage in event handler is not allowed.',
          line: 3
        }
      ]
    }
  ]
})
