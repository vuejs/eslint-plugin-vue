/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/valid-v-cloak'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('valid-v-cloak', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-cloak></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-cloak:aaa></div></template>',
      errors: [
        {
          message: "'v-cloak' directives require no argument.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-cloak.aaa></div></template>',
      errors: [
        {
          message: "'v-cloak' directives require no modifier.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-cloak="aaa"></div></template>',
      errors: [
        {
          message: "'v-cloak' directives require no attribute value.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><div v-cloak="."></div></template>',
      errors: [
        {
          message: "'v-cloak' directives require no attribute value.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    // comment value
    {
      filename: 'comment-value.vue',
      code: '<template><div v-cloak="/**/" /></template>',
      errors: [
        {
          message: "'v-cloak' directives require no attribute value.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><div v-cloak="" /></template>',
      errors: [
        {
          message: "'v-cloak' directives require no attribute value.",
          line: 1,
          column: 24,
          endLine: 1,
          endColumn: 26
        }
      ]
    }
  ]
})
