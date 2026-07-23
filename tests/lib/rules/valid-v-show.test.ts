/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/valid-v-show'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('valid-v-show', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show="foo"></div></template>'
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><MyComponent v-show="." /></template>'
    },
    // comment value (parsing error)
    {
      filename: 'comment-value.vue',
      code: '<template><MyComponent v-show="/**/" /></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-show:aaa="foo"></div></template>',
      errors: [
        {
          message: "'v-show' directives require no argument.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show.aaa="foo"></div></template>',
      errors: [
        {
          message: "'v-show' directives require no modifier.",
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-show></div></template>',
      errors: [
        {
          message: "'v-show' directives require that attribute value.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    // empty value
    {
      filename: 'empty-value.vue',
      code: '<template><div v-show=""></div></template>',
      errors: [
        {
          message: "'v-show' directives require that attribute value.",
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><template v-show="condition"></template></template>',
      errors: [
        {
          message: "'v-show' directives cannot be put on <template> tags.",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><template v-show="condition" /></template>',
      errors: [
        {
          message: "'v-show' directives cannot be put on <template> tags.",
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 39
        }
      ]
    }
  ]
})
