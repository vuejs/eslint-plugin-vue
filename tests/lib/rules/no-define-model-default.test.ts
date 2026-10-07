/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-define-model-default'
import tsParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-define-model-default', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const model = defineModel()
      const count = defineModel('count')
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const model = defineModel({ type: String, required: true })
      const count = defineModel('count', { type: Number })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const model = defineModel<string>({ required: true })
      const count = defineModel<number>('count')
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const options = { default: '' }
      const model = defineModel(options)
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          modelValue: { type: String, default: '' }
        }
      }
      </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const model = defineModel({ type: String, default: '' })
      </script>
      `,
      errors: [
        {
          message: 'Unexpected default value for the "modelValue" model.',
          line: 3,
          column: 49,
          endLine: 3,
          endColumn: 60
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const modelValue = defineModel<string>({ default: '' })
      const count = defineModel<number>('count', { default: 0 })
      const items = defineModel<string[]>('items', { default: () => [] })
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          message: 'Unexpected default value for the "modelValue" model.',
          line: 3,
          column: 48,
          endLine: 3,
          endColumn: 59
        },
        {
          message: 'Unexpected default value for the "count" model.',
          line: 4,
          column: 52,
          endLine: 4,
          endColumn: 62
        },
        {
          message: 'Unexpected default value for the "items" model.',
          line: 5,
          column: 54,
          endLine: 5,
          endColumn: 71
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const model = defineModel({ default: 'foo' } as const)
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          message: 'Unexpected default value for the "modelValue" model.',
          line: 3,
          column: 35,
          endLine: 3,
          endColumn: 49
        }
      ]
    }
  ]
})
