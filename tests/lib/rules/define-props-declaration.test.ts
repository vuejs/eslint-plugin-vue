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
      interface User { name: string }
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
      interface User { name: string }
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
      `defineProps({ kind: User as PropType<Admin> })`,
      `defineProps({ kind: String as unknown as PropType<'a'> })`,
      `defineProps({ kind: String as Vue.PropType<'a'> })`,
      `defineProps(/* options */ { kind: String })`,
      `defineProps<{ kind: string }>({ kind: String })`,
      // the inferred runtime type would add the `Boolean` casting
      `defineProps({ kind: String as PropType<boolean | string> })`,
      `defineProps({ kind: { type: String as PropType<string | boolean>, required: true } })`,
      `defineProps({ kind: { type: String as PropType<boolean>, default: 'a' } })`,
      `defineProps({ kind: [String, Number] as PropType<string | true> })`,
      `defineProps({ kind: Object as PropType<false> })`,
      `defineProps({ kind: Object as PropType<(boolean)> })`,
      `defineProps({ kind: Object as PropType<boolean & {}> })`,
      `defineProps({ kind: Object as PropType<NonNullable<boolean | null>> })`,
      `defineProps({ kind: Object as PropType<Exclude<boolean | string, string>> })`,
      `defineProps({ kind: Object as PropType<Options['enabled']> })`,
      `defineProps({ kind: Object as PropType<typeof enabled> })`,
      `defineProps({ kind: Object as PropType<string extends 'a' ? boolean : never> })`
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
    ...[
      // the inferred runtime type would add the `Boolean` casting
      [
        `defineProps({ kind: String as PropType<Flag> })`,
        `type Flag = boolean`
      ],
      [
        `defineProps({ kind: String as PropType<Kind> })`,
        `type Kind = 'auto' | Flag; type Flag = true`
      ],
      [
        `defineProps({ kind: Object as PropType<Maybe<boolean>> })`,
        `type Maybe<T> = T | null`
      ],
      [
        `defineProps({ kind: Object as PropType<Record<string, boolean>> })`,
        `type Record<K extends string, V> = V`
      ],
      // the runtime type cannot be inferred from a type that is not declared
      // in the file
      [
        `defineProps({ kind: String as PropType<Flag> })`,
        `import type { Flag } from './types'`
      ],
      [
        `defineProps({ kind: Object as PropType<NS.Flag> })`,
        `declare namespace NS { type Flag = boolean | string }`
      ],
      [
        `defineProps({ kind: { type: Function as PropType<Formatter>, default: (value: string) => value } })`,
        `import type { Formatter } from 'formatter'`
      ],
      [
        `defineProps({ kind: Object as PropType<T> })`,
        ``,
        `<script setup lang="ts" generic="T">const props = `
      ],
      [`defineProps({ kind: Object as PropType<Box> })`, `type Box<T> = T`],
      [
        `defineProps({ kind: String as PropType<Kind> })`,
        `type Kind = Size; type Size = Kind`
      ],
      // the compiler resolves the type arguments of a local generic type in
      // its own way
      [
        `defineProps({ kind: String as PropType<Wrap<string>> })`,
        `type T = boolean; type Wrap<T> = T`
      ],
      [
        `defineProps({ kind: { type: Object as PropType<Wrap<{ a: 1 }>>, default: () => ({}) } })`,
        `type T = () => void; type Wrap<T> = T`
      ],
      [
        `defineProps({ kind: Object as PropType<Wrap<{ a: 1 }>> })`,
        `type Id<T> = T; type Wrap<T> = Id<T>`
      ],
      [
        `defineProps({ kind: String as PropType<Opt<string>> })`,
        `type Nullable<T> = T | null; type Opt<T> = Nullable<T>`
      ],
      [
        `defineProps({ kind: Object as PropType<NonNullable<Box<{ a: 1 }>>> })`,
        `type Box<T> = T | T`
      ],
      [
        `defineProps({ kind: Object as PropType<Maybe<boolean>> })`,
        `interface Maybe<T> { value: T }`
      ],
      // the inferred runtime type would be another one
      [
        `defineProps({ kind: { type: Object as PropType<() => void>, default: () => {} } })`
      ],
      [`defineProps({ kind: Object as PropType<{ (): void }> })`],
      [
        `defineProps({ kind: Object as PropType<Callback> })`,
        `interface Callback { (): void }`
      ],
      [
        `defineProps({ kind: Function as PropType<Options> })`,
        `interface Options { enabled: boolean }`
      ],
      [`defineProps({ kind: [String, Number] as PropType<string> })`],
      [`defineProps({ kind: String as PropType<string | null> })`],
      [`defineProps({ kind: String as PropType<string | undefined> })`],
      [
        `defineProps({ kind: Number as PropType<Level> })`,
        `enum Level { A = 'a' }; enum Level { B = 'b' }`
      ],
      // the runtime type would not be an array, which changes whether the
      // default value is called as a factory
      [`defineProps({ kind: { type: [Function], default: () => 'a' } })`],
      [
        `defineProps({ kind: { type: [Function, Function], default: () => 'a' } })`
      ],
      [
        `defineProps({ kind: { type: [Function] as PropType<() => string>, default: () => 'a' } })`
      ],
      [`defineProps({ kind: { type: [String], default: 'a' } })`],
      // the reactive props destructure has default values
      [
        `defineProps({ kind: [String, Function] })`,
        ``,
        `<script setup lang="ts">const { kind = () => 'a' } = `
      ],
      [
        `defineProps({ kind: Object })`,
        ``,
        `<script setup lang="ts">const { kind = () => ({}) } = `
      ],
      [
        `defineProps({ kind: Number })`,
        ``,
        `<script setup lang="ts">const { kind = 'a' } = `
      ],
      // the last one of duplicate keys would be used
      [`defineProps({ kind: { type: String, type: Number } })`],
      [`defineProps({ kind: { type: String, default: 'a', default: 'b' } })`],
      [
        `defineProps({ kind: { type: String, required: true, required: false } })`
      ],
      [`defineProps({ kind: String, kind: Number })`],
      [`defineProps({ 'is-open': String, isOpen: Number })`],
      [`defineProps({ __proto__: String })`],
      [`defineProps({ '__proto__': String })`],
      // the emitted type would refer to the local declaration
      [`defineProps({ kind: Object })`, `type Record = string`],
      [`defineProps({ kind: [Object, String] })`, `interface Record { a: 1 }`],
      [
        `defineProps({ kind: { type: Object, default: () => ({}) } })`,
        `import type { Record } from './types'`
      ],
      [`defineProps({ kind: Date })`, `type Date = string`]
    ].map(
      ([
        declaration,
        declarations = '',
        before = '<script setup lang="ts">const props = '
      ]) => ({
        filename: 'test.vue',
        code: `${before}${declaration}; ${declarations}</script>`,
        output: null,
        languageOptions: {
          parserOptions: {
            parser: require.resolve('@typescript-eslint/parser')
          }
        },
        errors: [
          {
            message:
              'Use type-based declaration instead of runtime declaration.',
            line: 1,
            column: before.length + 1,
            endLine: 1,
            endColumn: before.length + 1 + declaration.length
          }
        ]
      })
    ),
    ...[
      [
        `defineProps({ kind: [String, Function] })`,
        `defineProps<{ kind?: string | ((...args: any[]) => any) }>()`
      ],
      [
        `defineProps({ kind: { type: [Function, Array], default: () => [] } })`,
        `withDefaults(defineProps<{ kind?: ((...args: any[]) => any) | any[] }>(), { kind: () => [] })`
      ],
      [
        `defineProps({ kind: [Function], size: [String, String] })`,
        `defineProps<{ kind?: (...args: any[]) => any; size?: string }>()`
      ],
      [
        `defineProps({ kind: { type: Boolean, default: true } })`,
        `withDefaults(defineProps<{ kind?: boolean }>(), { kind: true })`
      ],
      [
        `defineProps({ kind: { type: [String, Boolean], required: true } })`,
        `defineProps<{ kind: string | boolean }>()`
      ],
      [
        `defineProps({ kind: { type: [Boolean, String], default: 'auto' } })`,
        `withDefaults(defineProps<{ kind?: boolean | string }>(), { kind: 'auto' })`
      ],
      [
        `defineProps({ kind: [Boolean, String] as PropType<boolean | 'auto'> })`,
        `defineProps<{ kind?: boolean | 'auto' }>()`
      ],
      [
        `defineProps({ kind: Object as PropType<{ enabled: boolean }> })`,
        `defineProps<{ kind?: { enabled: boolean } }>()`
      ],
      [
        `defineProps({ kind: Array as PropType<Array<boolean>> })`,
        `defineProps<{ kind?: Array<boolean> }>()`
      ],
      [
        `defineProps({ kind: Function as PropType<() => boolean> })`,
        `defineProps<{ kind?: () => boolean }>()`
      ],
      [
        `defineProps({ kind: Object as PropType<Record<string, boolean>> })`,
        `defineProps<{ kind?: Record<string, boolean> }>()`
      ],
      [
        `defineProps({ kind: [Object, Function] as PropType<{ a: 1 } | (() => void)> })`,
        `defineProps<{ kind?: { a: 1 } | (() => void) }>()`
      ],
      [
        `defineProps({ kind: String as PropType<Kind | 'auto'>, options: Object as PropType<Options> })`,
        `defineProps<{ kind?: Kind | 'auto'; options?: Options }>()`,
        `type Kind = 'a' | 'b'; interface Options { enabled: boolean }`
      ],
      [
        `defineProps({ kind: String as PropType<Size>, options: Object as PropType<Partial<Options>> })`,
        `defineProps<{ kind?: Size; options?: Partial<Options> }>()`,
        `type Size = Kind; type Kind = 'a' | 'b'; interface Options { enabled: boolean }`
      ],
      [
        `defineProps({ kind: Function as PropType<Callback> })`,
        `defineProps<{ kind?: Callback }>()`,
        `interface Callback { (): void }`
      ],
      [
        `defineProps({ kind: String as PropType<Size>, level: String as PropType<Level> })`,
        `defineProps<{ kind?: Size; level?: Level }>()`,
        `enum Size { S = 's' }; enum Level { A, B }`
      ],
      [
        `defineProps({ kind: Object as PropType<User> })`,
        `defineProps<{ kind?: User }>()`,
        `interface User { name: string }; type Record = string`
      ],
      [
        `defineProps({ kind: Number })`,
        `defineProps<{ kind?: number }>()`,
        ``,
        `<script setup lang="ts">const { kind } = `
      ]
    ].map(
      ([
        declaration,
        output,
        declarations = '',
        before = '<script setup lang="ts">const props = '
      ]) => ({
        filename: 'test.vue',
        code: `${before}${declaration}; ${declarations}</script>`,
        output: `${before}${output}; ${declarations}</script>`,
        languageOptions: {
          parserOptions: {
            parser: require.resolve('@typescript-eslint/parser')
          }
        },
        errors: [
          {
            message:
              'Use type-based declaration instead of runtime declaration.',
            line: 1,
            column: before.length + 1,
            endLine: 1,
            endColumn: before.length + 1 + declaration.length
          }
        ]
      })
    ),
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
