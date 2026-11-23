/**
 * @author clean99
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/return-in-prop-default'
import tsParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('return-in-prop-default', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          props: {
            a: { type: Object, default() { return {} } },
            b: { type: Array, default: function () { return [] } },
            c: { type: Object, default: () => ({}) },
            d: { type: Object, default: () => undefined },
            e: { type: Object, default() { return undefined } },
            f: { type: Object, default() { return null } },
            g: { type: Object, default() { return } },
            h: { type: Object, default: null },
            i: { type: String, default: 'value' },
            j: { type: Object, default: async () => {} },
            k: { type: Object, *default() {} }
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          props: {
            a: { type: Object, default() { if (flag) return {}; else return } },
            b: { type: Object, default() { throw new Error() } },
            c: { type: Object, default() { if (flag) throw new Error(); return {} } },
            d: { type: Array, default() {
              const result = []
              values.forEach(value => { result.push(value) })
              return result
            } }
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          props: {
            a: { type: Function, default() {} },
            b: { type: [Function, Object], default: () => {} },
            c: { type: CustomType, default() {} },
            d: { type: [Object, CustomType], default() {} },
            e: { type: getType(), default() {} },
            f: { type: [], default() {} },
            g: { type: [Object, ...types], default() {} },
            h: { default() {} },
            i: { type: Object, default: factory },
            j: { type: Object, get default() {} },
            k: Object,
            l: { type: Object },
            m: options,
            n: { type: Object, default() {}, ...options },
            o: { type: Object, default() {}, [key]: value },
            ...otherProps
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: '<script>export default { props: ["a"] }</script>'
    },
    {
      filename: 'test.vue',
      code: '<script>export default { props: options }</script>'
    },
    {
      filename: 'test.js',
      code: 'const options = { props: { a: { type: Object, default() {} } } }'
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
        defineProps({
          a: { type: Object, default: () => ({}) },
          b: { type: Array, default() { return [] } },
          c: { type: Object, default() { return } },
          d: { type: Object, default: () => undefined },
          e: { type: Object, default() { throw new Error() } },
          f: { type: Function, default() {} },
          g: { type: [Object, Function], default() {} },
          h: { type: getType(), default() {} }
        })
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        withDefaults(defineProps<{ a?: object }>(), { a: () => {} })
        </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } }
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
        const { a = () => {} } = defineProps({ a: Function })
        defineModel({ type: Object, default() {} })
        </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          props: {
            a: { type: Object, default() {} },
            b: { type: Object, default: () => {} },
            c: { type: Array, default: function () {} }
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'expectedReturn',
          data: { name: 'a' },
          line: 5,
          column: 39,
          endLine: 5,
          endColumn: 44
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'b' },
          line: 6,
          column: 41,
          endLine: 6,
          endColumn: 49
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'c' },
          line: 7,
          column: 40,
          endLine: 7,
          endColumn: 54
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          props: {
            settings: { type: Object, default() { const result = {} } },
            items: { type: Array, default() { if (enabled) return [] } }
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'expectedReturn',
          data: { name: 'settings' },
          line: 5,
          column: 46,
          endLine: 5,
          endColumn: 70
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'items' },
          line: 6,
          column: 42,
          endLine: 6,
          endColumn: 71
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          props: {
            a: { type: Object, default() { /* intentionally empty */ } },
            b: { type: Object, default() {
              function nested() { return {} }
              nested()
            } },
            c: { type: Array, default() { values.map(value => { return value }) } }
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'expectedReturn',
          data: { name: 'a' },
          line: 5,
          column: 39,
          endLine: 5,
          endColumn: 71
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'b' },
          line: 6,
          column: 39,
          endLine: 9,
          endColumn: 14
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'c' },
          line: 10,
          column: 38,
          endLine: 10,
          endColumn: 82
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          props: {
            a: { type: [Object, Array], default() {} },
            b: { type: String, default() {} },
            c: { type: Number, default() {} },
            d: { type: Boolean, default() {} },
            e: { type: Symbol, default() {} },
            f: { type: BigInt, default() {} }
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'expectedReturn',
          data: { name: 'a' },
          line: 5,
          column: 48,
          endLine: 5,
          endColumn: 53
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'b' },
          line: 6,
          column: 39,
          endLine: 6,
          endColumn: 44
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'c' },
          line: 7,
          column: 39,
          endLine: 7,
          endColumn: 44
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'd' },
          line: 8,
          column: 40,
          endLine: 8,
          endColumn: 45
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'e' },
          line: 9,
          column: 39,
          endLine: 9,
          endColumn: 44
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'f' },
          line: 10,
          column: 39,
          endLine: 10,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
        defineProps({
          a: { type: Object, default() {} },
          b: { type: Array, default: () => {} },
          c: { type: Object, default: function () { const result = {} } },
          d: { type: Array, default() { if (enabled) return [] } },
          e: { type: Object, default() { const nested = () => ({}); nested() } }
        })
        </script>
      `,
      errors: [
        {
          messageId: 'expectedReturn',
          data: { name: 'a' },
          line: 4,
          column: 37,
          endLine: 4,
          endColumn: 42
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'b' },
          line: 5,
          column: 38,
          endLine: 5,
          endColumn: 46
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'c' },
          line: 6,
          column: 39,
          endLine: 6,
          endColumn: 72
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'd' },
          line: 7,
          column: 36,
          endLine: 7,
          endColumn: 65
        },
        {
          messageId: 'expectedReturn',
          data: { name: 'e' },
          line: 8,
          column: 37,
          endLine: 8,
          endColumn: 79
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          props: {
            'foo-bar': { 'type': Object, ['default']() {} },
            [propName]: { type: Array, default: () => {} },
            '': { type: Object, default() {} }
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'expectedReturn',
          data: { name: 'foo-bar' },
          line: 5,
          column: 53,
          endLine: 5,
          endColumn: 58
        },
        {
          messageId: 'expectedReturn',
          data: { name: '[propName]' },
          line: 6,
          column: 49,
          endLine: 6,
          endColumn: 57
        },
        {
          messageId: 'expectedReturn',
          data: { name: '' },
          line: 7,
          column: 40,
          endLine: 7,
          endColumn: 45
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import type { PropType } from 'vue'
        defineProps({
          a: { type: Object as PropType<object>, default: (() => {}) as () => object },
          b: { type: Function as PropType<() => void>, default() {} }
        })
        </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          messageId: 'expectedReturn',
          data: { name: 'a' },
          line: 5,
          column: 60,
          endLine: 5,
          endColumn: 68
        }
      ]
    }
  ]
})
