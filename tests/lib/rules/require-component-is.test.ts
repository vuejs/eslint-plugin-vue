/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/require-component-is'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('require-component-is', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><component v-bind:is="type"></component></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><component :is="type"></component></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><component is="type"></component></template>',
      errors: [
        {
          message:
            "Expected '<component>' elements to have 'v-bind:is' attribute.",
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><component v-foo:is="type"></component></template>',
      errors: [
        {
          message:
            "Expected '<component>' elements to have 'v-bind:is' attribute.",
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 50
        }
      ]
    }
  ]
})
