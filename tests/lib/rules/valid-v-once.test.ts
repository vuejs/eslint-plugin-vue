/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/valid-v-once'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('valid-v-once', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div v-once></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div v-once:aaa></div></template>',
      errors: ["'v-once' directives require no argument."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-once.aaa></div></template>',
      errors: ["'v-once' directives require no modifier."]
    },
    {
      filename: 'test.vue',
      code: '<template><div v-once="aaa"></div></template>',
      errors: ["'v-once' directives require no attribute value."]
    },
    // parsing error
    {
      filename: 'parsing-error.vue',
      code: '<template><MyComponent v-once="." /></template>',
      errors: ["'v-once' directives require no attribute value."]
    },
    // comment value
    {
      filename: 'comment-value.vue',
      code: '<template><MyComponent v-once="/**/" /></template>',
      errors: ["'v-once' directives require no attribute value."]
    },
    // empty value
    {
      filename: 'comment-value.vue',
      code: '<template><MyComponent v-once="" /></template>',
      errors: ["'v-once' directives require no attribute value."]
    }
  ]
})
