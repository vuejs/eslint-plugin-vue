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
    ecmaVersion: 'latest',
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
      const props = defineProps<{ kind: string }>()
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
      const props = defineProps<{ kind: number }>()
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
        kind: { type:Boolean}
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind: boolean }>()
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
      const props = defineProps<{ kind: Record<string, any> }>()
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
      const props = defineProps<{ kind: any[] }>()
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
      const props = defineProps<{ kind: () => void }>()
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
      const props = defineProps<{ kind: 'a' | 'b' }>()
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
      const props = defineProps<{ kind: { id: number; name: string } }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
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
          type: Array as PropType<string[]>,
          default: () => []
        }
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind: string[] }>()
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
          required: true
        }
      })
      </script>
      `,
      output: `
      <script setup lang="ts">
      const props = defineProps<{ kind: (a: number, b: string) => boolean }>()
      </script>
      `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    }
  ]
})
