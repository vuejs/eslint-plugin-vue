/**
 * @author Flo Edelmann
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/prefer-single-event-payload'
import vueEslintParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

const tsLanguageOptions = {
  parser: vueEslintParser,
  ecmaVersion: 2020 as const,
  sourceType: 'module' as const,
  parserOptions: { parser: tsParser }
}

tester.run('prefer-single-event-payload', rule, {
  valid: [
    // Template - no payload
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('change')" />
      </template>
      `
    },
    // Template - single payload value
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('change', value)" />
      </template>
      `
    },
    // Template - single object payload
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('change', { a, b })" />
      </template>
      `
    },
    // Options API - no payload
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit('change')
          }
        }
      }
      </script>
      `
    },
    // Options API - single payload
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit('change', value)
          }
        }
      }
      </script>
      `
    },
    // Options API - single object payload
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit('change', { a, b })
          }
        }
      }
      </script>
      `
    },
    // setup() with context - single payload
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props, context) {
          context.emit('change', value)
        }
      }
      </script>
      `
    },
    // setup() with destructured emit - single payload
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props, { emit }) {
          emit('change', value)
        }
      }
      </script>
      `
    },
    // script setup - no payload
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits(['change'])
      emit('change')
      </script>
      `
    },
    // script setup - single payload
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits(['change'])
      emit('change', value)
      </script>
      `
    },
    // script setup - single object payload
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits(['change'])
      emit('change', { a, b })
      </script>
      `
    },
    // defineEmits not assigned to variable - cannot track
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineEmits(['change'])
      </script>
      `
    },
    // Options API emit declaration - null validator (no params)
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: {
          change: null
        },
      }
      </script>
      `
    },
    // Options API emit declaration - single-param validator
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: {
          change: (value) => true
        },
      }
      </script>
      `
    },
    // TypeScript - call signature with single payload
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{
        (e: 'change', value: string): void
      }>()
      </script>
      `,
      languageOptions: tsLanguageOptions
    },
    // TypeScript - call signature with no payload
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{
        (e: 'change'): void
      }>()
      </script>
      `,
      languageOptions: tsLanguageOptions
    },
    // TypeScript - property signature with single-element tuple
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{
        change: [value: string]
      }>()
      </script>
      `,
      languageOptions: tsLanguageOptions
    },
    // TypeScript - property signature with empty tuple
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{
        change: []
      }>()
      </script>
      `,
      languageOptions: tsLanguageOptions
    },
    // TypeScript - method signature with single param
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{
        change(value: string): void
      }>()
      </script>
      `,
      languageOptions: tsLanguageOptions
    },
    // TypeScript - method signature with no params
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{
        change(): void
      }>()
      </script>
      `,
      languageOptions: tsLanguageOptions
    }
  ],

  invalid: [
    // Template - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('change', value1, value2)" />
      </template>
      `,
      errors: [
        {
          message:
            'Pass a single payload object instead of multiple arguments when emitting the "change" event.',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 53
        }
      ]
    },
    // Template - three payload args
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('update', a, b, c)" />
      </template>
      `,
      errors: [
        {
          message:
            'Pass a single payload object instead of multiple arguments when emitting the "update" event.',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 46
        }
      ]
    },
    // Options API - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit('change', value1, value2)
          }
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'Pass a single payload object instead of multiple arguments when emitting the "change" event.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 49
        }
      ]
    },
    // Options API optional chaining - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit?.('change', value1, value2)
          }
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'Pass a single payload object instead of multiple arguments when emitting the "change" event.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 51
        }
      ]
    },
    // setup() with context - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props, context) {
          context.emit('change', value1, value2)
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'Pass a single payload object instead of multiple arguments when emitting the "change" event.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 49
        }
      ]
    },
    // setup() with destructured emit - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props, { emit }) {
          emit('change', value1, value2)
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'Pass a single payload object instead of multiple arguments when emitting the "change" event.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 41
        }
      ]
    },
    // script setup - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits(['change'])
      emit('change', value1, value2)
      </script>
      `,
      errors: [
        {
          message:
            'Pass a single payload object instead of multiple arguments when emitting the "change" event.',
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 37
        }
      ]
    },
    // script setup - three payloads
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits(['update'])
      emit('update', a, b, c)
      </script>
      `,
      errors: [
        {
          message:
            'Pass a single payload object instead of multiple arguments when emitting the "update" event.',
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 30
        }
      ]
    },
    // Dynamic event name - multiple payloads
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit(eventName, value1, value2)
          }
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'Pass a single payload object instead of multiple arguments when emitting the "unknown" event.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 50
        }
      ]
    },
    // Options API emit declaration - multiple-param validator
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: {
          change: (value1, value2) => true
        },
      }
      </script>
      `,
      errors: [
        {
          message:
            'Declare a single payload parameter instead of multiple parameters for the "change" event.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 43
        }
      ]
    },
    // TypeScript - call signature with multiple payloads
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{
        (e: 'change', value1: string, value2: number): void
      }>()
      </script>
      `,
      languageOptions: tsLanguageOptions,
      errors: [
        {
          message:
            'Declare a single payload parameter instead of multiple parameters for the "change" event.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 60
        }
      ]
    },
    // TypeScript - property signature with multi-element tuple
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{
        change: [value1: string, value2: number]
      }>()
      </script>
      `,
      languageOptions: tsLanguageOptions,
      errors: [
        {
          message:
            'Declare a single payload parameter instead of multiple parameters for the "change" event.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 49
        }
      ]
    },
    // TypeScript - method signature with multiple params
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{
        change(value1: string, value2: number): void
      }>()
      </script>
      `,
      languageOptions: tsLanguageOptions,
      errors: [
        {
          message:
            'Declare a single payload parameter instead of multiple parameters for the "change" event.',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 53
        }
      ]
    }
  ]
})
