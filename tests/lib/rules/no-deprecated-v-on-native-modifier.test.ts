/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
import rule from '../../../lib/rules/no-deprecated-v-on-native-modifier'
import { RuleTester } from '../../eslint-compat'
import vueEslintParser from 'vue-eslint-parser'

const ruleTester = new RuleTester({
  languageOptions: { parser: vueEslintParser, ecmaVersion: 2015 }
})

ruleTester.run('no-deprecated-v-on-native-modifier', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.enter='fire'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @keyup.enter='fire'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input v-native:foo.native.foo.bar='fire'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input @native.enter='fire'></template>"
    },
    {
      filename: 'test.vue',
      code: "<template><input :keydown.native='fire'></template>"
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.native='fore'></template>",
      errors: [
        {
          messageId: 'deprecated',
          line: 1,
          column: 29,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: "<template><input v-on:keyup.foo.native.bar='fore'></template>",
      errors: [
        {
          messageId: 'deprecated',
          line: 1,
          column: 33,
          endLine: 1,
          endColumn: 39
        }
      ]
    }
  ]
})
