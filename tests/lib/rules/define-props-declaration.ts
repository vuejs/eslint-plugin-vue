/**
 * @author Amorites
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat.ts'
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
      options: ['type-based'],
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
      const props = defineProps<{
        kind: string;
      }>()
      </script>
      `,
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
