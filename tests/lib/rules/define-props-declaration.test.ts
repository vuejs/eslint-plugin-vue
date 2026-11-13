/**
 * @author Amorites
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/define-props-declaration'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('define-props-declaration', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps<{
        kind: string;
      }>()
      </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps<{
        kind: string;
      }>()
      </script>
      `,
      options: ['type-based'],
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: { type: String },
      })
      </script>
      `,
      options: ['runtime']
    },
    {
      filename: 'test.vue',
      // ignore script without lang="ts"
      code: `
      <script setup>
      const props = defineProps({
        kind: { type: String },
      })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits({
        click: (event: PointerEvent) => !!event
      })
      </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      // ignore non-setup script
      code: `
        <script lang="ts">
        import { PropType } from 'vue'

        export default {
          props: {
            kind: { type: String as PropType<'primary' | 'secondary'> },
          },
          emits: ['check']
        }
        </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: { type: String },
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind?: string }>()
      </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3,
          column: 21,
          endLine: 5,
          endColumn: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: { type: String },
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind?: string }>()
      </script>
      `,
      options: ['type-based'],
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3,
          column: 21,
          endLine: 5,
          endColumn: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        a: String,
        b: Number,
        c: Boolean,
        d: Object,
        e: Array,
        f: Function,
        g: Symbol,
        h: Date
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ a?: string; b?: number; c?: boolean; d?: Record<string, any>; e?: any[]; f?: (...args: any[]) => any; g?: symbol; h?: Date }>()
      </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3,
          column: 21,
          endLine: 12,
          endColumn: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: { type: String, required: true },
        'is-open': { type: [Boolean, String], required: false },
        size: [Number, String]
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind: string; 'is-open'?: boolean | string; size?: number | string }>()
      </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3,
          column: 21,
          endLine: 7,
          endColumn: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      import type { PropType } from 'vue'
      import type { User } from './types'
      const props = defineProps({
        foo: String as PropType<'a' | 'b'>,
        bar: { type: Object as PropType<User>, required: true },
        baz: Number,
        list: { type: Array as PropType<string[]> },
        callback: { type: Function as PropType<(id: number) => void> },
        value: [String, Number] as PropType<string | number>
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      import type { PropType } from 'vue'
      import type { User } from './types'
      const props = defineProps<{ foo?: 'a' | 'b'; bar: User; baz?: number; list?: string[]; callback?: (id: number) => void; value?: string | number }>()
      </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 5,
          column: 21,
          endLine: 12,
          endColumn: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: { type: String, default: 'primary' },
        items: { type: Array as PropType<string[]>, default: () => [] },
        count: { type: Number, required: true, default: (1, 2) }
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = withDefaults(defineProps<{ kind?: string; items?: string[]; count: number }>(), { kind: 'primary', items: () => [], count: (1, 2) })
      </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3,
          column: 21,
          endLine: 7,
          endColumn: 9
        }
      ]
    },
    ...[
      `defineProps(['kind'])`,
      `defineProps([kind])`,
      `defineProps(propsOptions)`,
      `defineProps({})`,
      `defineProps({ ...baseProps, kind: String })`,
      `defineProps({ [key]: String })`,
      `defineProps({ kind })`,
      `defineProps({ kind: User })`,
      `defineProps({ kind: null })`,
      `defineProps({ kind: {} })`,
      `defineProps({ kind: { type: null } })`,
      `defineProps({ kind: { default: 'a' } })`,
      `defineProps({ kind: Number || String })`,
      `defineProps({ kind: [String, ...types] })`,
      `defineProps({ kind: { type: String, validator: (value) => value !== '' } })`,
      `defineProps({ kind: { type: String, required: isRequired } })`,
      `defineProps({ kind: { type: Array, default() { return [] } } })`,
      `defineProps({ kind: { type, required: true } })`,
      `defineProps({ kind: { ['type']: String } })`,
      `defineProps({ kind: Boolean as PropType<Toggle> })`,
      `defineProps({ kind: [Boolean, String] as PropType<boolean | 'auto'> })`,
      `defineProps({ kind: User as PropType<Admin> })`,
      `defineProps({ kind: String as unknown as PropType<'a'> })`,
      `defineProps({ kind: String as Vue.PropType<'a'> })`,
      `defineProps(/* options */ { kind: String })`,
      `defineProps<{ kind: string }>({ kind: String })`
    ].map((declaration) => ({
      filename: 'test.vue',
      code: `<script setup lang="ts">const props = ${declaration}</script>`,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 1,
          column: 39,
          endLine: 1,
          endColumn: 39 + declaration.length
        }
      ]
    })),
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        // the kind
        kind: String
      })
      </script>
      `,
      output: null,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3,
          column: 21,
          endLine: 6,
          endColumn: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      class String {}
      </script>
      <script setup lang="ts">
      const props = defineProps({ kind: String })
      </script>
      `,
      output: null,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 6,
          column: 21,
          endLine: 6,
          endColumn: 50
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const { kind } = defineProps({ kind: { type: String, default: 'a' } })
      </script>
      `,
      output: null,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 77
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps<{
        kind: string;
      }>()
      </script>
      `,
      output: null,
      options: ['runtime'],
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Use runtime declaration instead of type-based declaration.',
          line: 3,
          column: 21,
          endLine: 5,
          endColumn: 11
        }
      ]
    }
  ]
})
