/**
 * @author Amorites
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/prefer-type-props-decl')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('prefer-type-props-decl', rule, {
  valid: [
    {
      filename: 'test.vue',
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
      const props = defineProps<{
        kind: string;
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
      const emit = defineEmits({
        click: (event: PointerEvent) => !!event
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
      const props = defineProps({
        kind: { type: String },
      })
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
