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
    },
    ...[undefined, 'type-based'].flatMap((option) =>
      [
        'defineModel<string>()',
        "defineModel<string>('title')",
        'defineModel<string>({ required: true })',
        "defineModel<string>('title', { default: '' })",
        `defineModel<string, 'trim'>({
          get(value) { return value },
          set(value) { return value.trim() }
        })`
      ].map((declaration) => ({
        filename: 'test.vue',
        code: `<script setup lang="ts">const model = ${declaration}</script>`,
        options: option ? [option] : [],
        languageOptions: {
          parserOptions: {
            parser: require.resolve('@typescript-eslint/parser')
          }
        }
      }))
    ),
    ...[
      'defineModel()',
      "defineModel('title')",
      'defineModel({ type: String })',
      "defineModel('title', { type: String, required: true })",
      "defineModel({ default: '' })"
    ].map((declaration) => ({
      filename: 'test.vue',
      code: `<script setup lang="ts">const model = ${declaration}</script>`,
      options: ['runtime']
    })),
    {
      filename: 'test.vue',
      // ignore script without lang="ts"
      code: `<script setup>const model = defineModel({ type: String })</script>`
    },
    {
      filename: 'test.vue',
      // ignore non-setup script
      code: `<script lang="ts">const model = defineModel({ type: String })</script>`
    },
    {
      filename: 'test.vue',
      // ignore calls outside script setup when both scripts are present
      code: `
        <script lang="ts">const model = defineModel({ type: String })</script>
        <script setup lang="ts">const props = defineProps<{ title: string }>()</script>
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
        defineModel()
        defineModel({ type: String })
        const title = defineModel<string>('title')
        defineProps({ kind: String })
        </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          messageId: 'hasArg',
          line: 3,
          column: 9,
          endLine: 3,
          endColumn: 22
        },
        {
          messageId: 'hasArg',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 38
        },
        {
          messageId: 'hasArg',
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 38
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
    },
    ...[undefined, 'type-based'].flatMap((option) =>
      [
        'defineModel()',
        "defineModel('title')",
        'defineModel({ type: String })',
        "defineModel('title', { type: String })",
        'defineModel({})',
        "defineModel({ default: '' })",
        "defineModel('title', { required: true })"
      ].map((declaration) => ({
        filename: 'test.vue',
        code: `<script setup lang="ts">const model = ${declaration}</script>`,
        options: option ? [option] : [],
        errors: [{ messageId: 'hasArg' }]
      }))
    ),
    ...[
      'defineModel<string>()',
      "defineModel<string>('title')",
      'defineModel<string>({ required: true })',
      "defineModel<string>('title', { default: '' })",
      "defineModel<string, 'trim'>()"
    ].map((declaration) => ({
      filename: 'test.vue',
      code: `<script setup lang="ts">const model = ${declaration}</script>`,
      options: ['runtime'],
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [{ messageId: 'hasTypeArg' }]
    }))
  ]
})
