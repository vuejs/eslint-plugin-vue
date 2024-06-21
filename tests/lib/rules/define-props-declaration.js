/**
 * @author Amorites
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/define-props-declaration')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: '2020',
    sourceType: 'module',
    parserOptions: {
      parser: require.resolve('@typescript-eslint/parser')
    }
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
    // default
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
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    /* TYPE-BASED */
    // shorthand syntax
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: String
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind?: string }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // String
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
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // Number
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: { type: Number}
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind?: number }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // Boolean
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: { type: Boolean}
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind?: boolean }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // Object
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: { type:Object}
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind?: Record<string, any> }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // Array
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: { type:Array}
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind?: any[] }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // Function
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: { type: Function}
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind?: (...args: any[]) => any }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // Custom type
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: User
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind?: User }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // Native Type with PropType
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: {
          type: String as PropType<'a' | 'b'>,
        }
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind?: 'a' | 'b' }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // Object with PropType
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: {
          type: Object as PropType<{ id: number; name: string }>,
        }
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind?: { id: number; name: string } }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // Object with PropType with separate type
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Kind { id: number; name: string }
      
      const props = defineProps({
        kind: {
          type: Object as PropType<Kind>,
        }
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      interface Kind { id: number; name: string }
      
      const props = defineProps<{ kind?: Kind }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 5
        }
      ]
    },
    // Object with PropType with separate imported type
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      import Kind from 'test'
      
      const props = defineProps({
        kind: {
          type: Object as PropType<Kind>,
        }
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      import Kind from 'test'
      
      const props = defineProps<{ kind?: Kind }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 5
        }
      ]
    },
    // Array with PropType
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: {
          type: Array as PropType<string[]>
        }
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind?: string[] }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // Function with PropType
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps({
        kind: {
          type: Function as PropType<(a: number, b: string) => boolean>,
        }
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind?: (a: number, b: string) => boolean }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // required
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        const props = defineProps({
          kind: {
            type: String,
            required: true
          }
        })
        </script>
        `,
      output: `
        <script setup lang="ts">
        const props = defineProps<{ kind: string }>()
        </script>
        `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // not required
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        const props = defineProps({
          kind: {
            type: String,
            required: false
          }
        })
        </script>
        `,
      output: `
        <script setup lang="ts">
        const props = defineProps<{ kind?: string }>()
        </script>
        `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // default value
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        const props = defineProps({
          kind: {
            type: String,
            default: 'foo'
          }
        })
        </script>
        `,
      output: `
        <script setup lang="ts">
        const props = withDefaults(defineProps<{ kind?: string }>(), { kind: 'foo' })
        </script>
        `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // separate interface
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        const props = defineProps({
          kind: {
            type: Object as PropType<{ id: number; name: string }>
          }
        })
        </script>
        `,
      output: `
        <script setup lang="ts">
        interface Props { kind?: { id: number, name: string } }; const props = defineProps<Props>()
        </script>
        `,
      options: ['type-based', { separateInterface: true }],
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // Array of types
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        const props = defineProps({
          kind: {
            type: [String, Number]
          }
        })
        </script>
      `,
      output: `
        <script setup lang="ts">
        const props = defineProps<{ kind?: string | number }>()
        </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // Union type (Number || String)
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        const props = defineProps({
          kind: {
            type: Number || String
          }
        })
        </script>
      `,
      output: `
        <script setup lang="ts">
        const props = defineProps<{ kind?: number | string }>()
        </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // Some unhandled expression type
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        const props = defineProps({
          kind: {
            type: typeof Test
          }
        })
        </script>
      `,
      output: `
        <script setup lang="ts">
        const props = defineProps<{ kind?: typeof Test }>()
        </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    // runtime
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
      errors: [
        {
          message: 'Use runtime declaration instead of type-based declaration.',
          line: 3
        }
      ],
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    }
  ]
})
