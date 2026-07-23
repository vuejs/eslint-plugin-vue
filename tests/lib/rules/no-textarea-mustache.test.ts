/**
 * @author Toru Nagashima
 * @copyright 2017 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-textarea-mustache'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

tester.run('no-textarea-mustache', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: ''
    },
    {
      filename: 'test.vue',
      code: '<template><div><textarea v-model="text"></textarea></div></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div><Textarea>{{text}}</Textarea></div></template>'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div><textarea>{{text}}</textarea></div></template>',
      errors: [
        {
          message: "Unexpected mustache. Use 'v-model' instead.",
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><textarea v-model="text">{{text}}</textarea></div></template>',
      errors: [
        {
          message: "Unexpected mustache. Use 'v-model' instead.",
          line: 1,
          column: 41,
          endLine: 1,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div><textarea>{{text}} and {{text}}</textarea></div></template>',
      errors: [
        {
          message: "Unexpected mustache. Use 'v-model' instead.",
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 34
        },
        {
          message: "Unexpected mustache. Use 'v-model' instead.",
          line: 1,
          column: 39,
          endLine: 1,
          endColumn: 47
        }
      ]
    }
  ]
})
