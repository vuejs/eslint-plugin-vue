/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import rule from '../../../lib/rules/no-deprecated-html-element-is'
import { RuleTester } from '../../eslint-compat.ts'
import vueEslintParser from 'vue-eslint-parser'

const ruleTester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2019 }
})

ruleTester.run('no-deprecated-html-element-is', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: '<template><component is="foo" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><div /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><Foo is="foo" /></template>'
    },
    {
      filename: 'test.vue',
      code: '<template><component :is="\'foo\'" /></template>'
    },

    // is="vue:xxx"
    {
      filename: 'test.vue',
      code: '<template><div is="vue:foo" /></template>'
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: '<template><div is="foo" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: '<template><div :is="foo" /></template>',
      errors: [
        {
          messageId: 'unexpected',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 25
        }
      ]
    }
  ]
})
