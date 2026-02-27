/**
 * @author Przemyslaw Falowski (@przemkow)
 * @fileoverview disallow using deprecated filters syntax
 */
import rule from '../../../lib/rules/no-deprecated-filter'
import { RuleTester } from '../../eslint-compat.ts'
import vueEslintParser from 'vue-eslint-parser'

const ruleTester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

ruleTester.run('no-deprecated-filter', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template>{{ msg }}</template>'
    },
    {
      filename: 'test.vue',
      code: '<template>{{ method(msg) }}</template>'
    },
    {
      filename: 'test.vue',
      code: '<template>{{ msg | filter }}</template>',
      languageOptions: {
        parserOptions: {
          vueFeatures: { filter: false }
        }
      }
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template>{{ msg | filter }}</template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template>{{ msg | filter(x) }}</template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template>{{ msg | filterA | filterB }}</template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-for="msg in messages">{{ msg | filter }}</div></template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 43,
          endLine: 1,
          endColumn: 55
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:id="msg | filter"></div></template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:id="msg | filter(aaa)"></div></template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-bind:id="msg | filterA | filterB"></div></template>',
      errors: [
        {
          message: 'Filters are deprecated.',
          line: 1,
          column: 27,
          endLine: 1,
          endColumn: 50
        }
      ]
    }
  ]
})
