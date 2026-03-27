/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/valid-v-pre'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('valid-v-pre', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-pre></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-pre:aaa></div></template>',
      errors: [
        {
          message: "'v-pre' directives require no argument.",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-pre.aaa></div></template>',
      errors: [
        {
          message: "'v-pre' directives require no modifier.",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-pre="aaa"></div></template>',
      errors: [
        {
          message: "'v-pre' directives require no attribute value.",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><div v-pre="." /></template>',
      errors: [
        {
          message: "'v-pre' directives require no attribute value.",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    // comment value
    {
      filename: 'comment-value.vue',
      code: '<template><div v-pre="/**/" /></template>',
      errors: [
        {
          message: "'v-pre' directives require no attribute value.",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><div v-pre="" /></template>',
      errors: [
        {
          message: "'v-pre' directives require no attribute value.",
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 24
        }
      ]
    }
  ]
})
