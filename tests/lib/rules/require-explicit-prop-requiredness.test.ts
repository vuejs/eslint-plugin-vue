/**
 * @author clean99
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/require-explicit-prop-requiredness'
import vueEslintParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('require-explicit-prop-requiredness', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          foo: { type: String, required: true },
          bar: { type: Boolean, required: false, default: true },
          baz: { required: isRequired },
          qux: { required }
        }
      }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        foo: { type: String, required: true },
        bar: { type: Boolean, required: false, default: true },
        baz: { required: isRequired },
        qux: { required }
      })
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          foo: { 'required': false },
          bar: { ['required']: true },
          baz: { [\`required\`]: false }
        }
      }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        foo: { 'required': false },
        bar: { ['required']: true },
        baz: { [\`required\`]: false }
      })
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          foo: { type: String, ...options },
          bar: { ...options, type: String },
          baz: { type: String, [key]: true },
          qux: { get required() { return true } }
        }
      }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        foo: { type: String, ...options },
        bar: { ...options, type: String },
        baz: { type: String, [key]: true },
        qux: { get required() { return true } }
      })
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          ...otherProps,
          foo: String,
          bar: [String, Number],
          baz: options,
          qux: makeProp()
        }
      }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        ...otherProps,
        foo: String,
        bar: [String, Number],
        baz: options,
        qux: makeProp()
      })
      </script>`
    },
    {
      filename: 'test.vue',
      code: '<script>export default { props: ["foo"] }</script>'
    },
    {
      filename: 'test.vue',
      code: '<script setup>defineProps(["foo"])</script>'
    },
    {
      filename: 'test.vue',
      code: '<script>export default { props: externalProps }</script>'
    },
    {
      filename: 'test.vue',
      code: '<script setup>defineProps(externalProps)</script>'
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps<{ foo: string; bar?: boolean }>()
      </script>`,
      languageOptions: { parserOptions: { parser: tsParser } }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      withDefaults(defineProps<{ foo?: string }>(), { foo: '' })
      </script>`,
      languageOptions: { parserOptions: { parser: tsParser } }
    },
    {
      filename: 'test.vue',
      code: '<script setup>defineModel({ type: String })</script>'
    },
    {
      filename: 'test.js',
      code: 'const options = { props: { foo: { type: String } } }'
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          myProp: { type: String },
          enabled: { type: Boolean, default: true }
        }
      }
      </script>`,
      errors: [
        {
          message:
            'Prop "myProp" should explicitly define its required option.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 35
        },
        {
          message:
            'Prop "enabled" should explicitly define its required option.',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 52
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        myProp: { type: String },
        enabled: { type: Boolean, default: true }
      })
      </script>`,
      errors: [
        {
          messageId: 'missingRequired',
          data: { name: 'myProp' },
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 33
        },
        {
          messageId: 'missingRequired',
          data: { name: 'enabled' },
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 50
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          foo: {},
          ['bar']: { validator: value => value != null },
          [name]: { type: String }
        }
      }
      </script>`,
      errors: [
        {
          messageId: 'missingRequired',
          data: { name: 'foo' },
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 18
        },
        {
          messageId: 'missingRequired',
          data: { name: 'bar' },
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 57
        },
        {
          messageId: 'missingRequired',
          data: { name: '[name]' },
          line: 7,
          column: 11,
          endLine: 7,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({ ...otherProps, foo: {}, ['bar']: { type: String } })
      </script>`,
      errors: [
        {
          messageId: 'missingRequired',
          data: { name: 'foo' },
          line: 3,
          column: 36,
          endLine: 3,
          endColumn: 43
        },
        {
          messageId: 'missingRequired',
          data: { name: 'bar' },
          line: 3,
          column: 45,
          endLine: 3,
          endColumn: 70
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default defineComponent({ props: { foo: { type: String } } })
      </script>`,
      errors: [
        {
          messageId: 'missingRequired',
          data: { name: 'foo' },
          line: 3,
          column: 49,
          endLine: 3,
          endColumn: 70
        }
      ]
    },
    {
      filename: 'test.js',
      code: 'Vue.component("test", { props: { foo: { type: String } } })',
      errors: [
        {
          messageId: 'missingRequired',
          data: { name: 'foo' },
          line: 1,
          column: 34,
          endLine: 1,
          endColumn: 55
        }
      ]
    },
    {
      filename: 'test.js',
      code: 'new Vue({ props: { foo: { type: String } } })',
      errors: [
        {
          messageId: 'missingRequired',
          data: { name: 'foo' },
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default Vue.extend({
        props: { foo: { type: String } as PropOptions<string> }
      })
      </script>`,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          messageId: 'missingRequired',
          data: { name: 'foo' },
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 62
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps({ foo: { type: String } as PropOptions<string> })
      </script>`,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          messageId: 'missingRequired',
          data: { name: 'foo' },
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 65
        }
      ]
    }
  ]
})
