/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/v-on-style'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('v-on-style', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="foo"></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="foo"></div></template>',
      options: ['shorthand']
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:foo="foo"></div></template>',
      options: ['longform']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-on:foo="foo"></div></template>',
      output: '<template><div @foo="foo"></div></template>',
      errors: [
        {
          message: "Expected '@' instead of 'v-on:'.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-on:foo="foo"></div></template>',
      output: '<template><div @foo="foo"></div></template>',
      options: ['shorthand'],
      errors: [
        {
          message: "Expected '@' instead of 'v-on:'.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div @foo="foo"></div></template>',
      output: '<template><div v-on:foo="foo"></div></template>',
      options: ['longform'],
      errors: [
        {
          message: "Expected 'v-on:' instead of '@'.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 26
        }
      ]
    }
  ]
})
