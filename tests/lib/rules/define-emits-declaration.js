/**
 * @author Amorites
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/define-emits-declaration')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('define-emits-declaration', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <script setup>
          const emit = defineEmits(['change', 'update'])
        </script>
       `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        const emit = defineEmits<{
          (e: 'change', id: number): void
          (e: 'update', value: string): void
        }>()
        </script>
       `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        const emit = defineEmits<{
          (e: 'change', id: number): void
          (e: 'update', value: string): void
        }>()
        </script>
       `,
      options: ['type-based'],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
       <script setup lang="ts">
       const emit = defineEmits(['change', 'update'])
       </script>
       `,
      options: ['runtime']
    },
    {
      filename: 'test.vue',
      // ignore code without defineEmits
      code: `
        <script setup lang="ts">
        const props = defineProps({
          kind: { type: String },
        })
        </script>
       `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
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
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
       <script setup lang="ts">
       const emit = defineEmits(['change', 'update'])
       </script>
       `,
      errors: [
        {
          message: 'Use type-based declaration instead of runtime declaration.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
       <script setup lang="ts">
       const emit = defineEmits(['change', 'update'])
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
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        const emit = defineEmits<{
          (e: 'change', id: number): void
          (e: 'update', value: string): void
        }>()
        </script>
       `,
      options: ['runtime'],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: 'Use runtime declaration instead of type-based declaration.',
          line: 3
        }
      ]
    }
  ]
})
