/**
 * @author Ivan Demchuk <https://github.com/Demivan>
 */
import { RuleTester } from '../../eslint-compat.ts'
import rule from '../../../lib/rules/require-typed-ref'
import tsEslintParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: tsEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

// Note: Need to specify filename for each test,
// as only TypeScript files are being checked
tester.run('require-typed-ref', rule, {
  valid: [
    {
      filename: 'test.ts',
      code: `
        import { shallowRef } from 'vue'
        const count = shallowRef(0)
      `
    },
    {
      filename: 'test.ts',
      code: `
        import { ref } from 'vue'
        const count = ref<number>()
      `
    },
    {
      filename: 'test.ts',
      code: `
        import { ref } from 'vue'
        const count = ref<number>(0)
      `
    },
    {
      filename: 'test.ts',
      code: `
        import { ref } from 'vue'
        const counter: Ref<number | undefined> = ref()
      `
    },
    {
      filename: 'test.ts',
      code: `
        import { ref } from 'vue'
        const count = ref(0)
      `
    },
    {
      filename: 'test.ts',
      code: `
        import { ref } from 'vue'
        function useCount() {
          return {
            count: ref<number>()
          }
        }
      `
    },
    {
      filename: 'test.ts',
      code: `
      import { ref, defineComponent } from 'vue'
      defineComponent({
        setup() {
          const count = ref<number>()
          return { count }
        }
      })
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          import { ref } from 'vue'
          const count = ref()
        </script>
      `,
      languageOptions: { parser: vueEslintParser }
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          import { ref } from 'vue'
          export default {
            setup() {
              const count = ref()
            }
          }
        </script>
      `,
      languageOptions: { parser: vueEslintParser }
    },
    {
      filename: 'test.js',
      code: `
        import { ref } from 'vue'
        const count = ref()
      `
    }
  ],
  invalid: [
    {
      filename: 'test.ts',
      code: `
        import { ref } from 'vue'
        const count = ref()
      `,
      errors: [
        {
          messageId: 'noType',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.ts',
      code: `
        import { ref } from 'vue'
        const count = ref(null)
      `,
      errors: [
        {
          messageId: 'noType',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.ts',
      code: `
        import { ref } from 'vue'
        const count = ref(undefined)
      `,
      errors: [
        {
          messageId: 'noType',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.ts',
      code: `
        import { shallowRef } from 'vue'
        const count = shallowRef()
      `,
      errors: [
        {
          messageId: 'noType',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.ts',
      code: `
        import { ref } from 'vue'
        function useCount() {
          const count = ref()
          return { count }
        }
      `,
      errors: [
        {
          messageId: 'noType',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.ts',
      code: `
        import { ref } from 'vue'
        function useCount() {
          return {
            count: ref()
          }
        }
      `,
      errors: [
        {
          messageId: 'noType',
          line: 5,
          column: 20,
          endLine: 5,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          import { ref } from 'vue'
          const count = ref()
        </script>
      `,
      languageOptions: { parser: vueEslintParser },
      errors: [
        {
          messageId: 'noType',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script lang="ts">
          import { ref } from 'vue'
          export default {
            setup() {
              const count = ref()
            }
          }
        </script>
      `,
      languageOptions: { parser: vueEslintParser },
      errors: [
        {
          messageId: 'noType',
          line: 6,
          column: 29,
          endLine: 6,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'test.ts',
      code: `
        import { ref, defineComponent } from 'vue'
        defineComponent({
          setup() {
            const count = ref()
            return { count }
          }
        })
      `,
      errors: [
        {
          messageId: 'noType',
          line: 5,
          column: 27,
          endLine: 5,
          endColumn: 32
        }
      ]
    }
  ]
})
