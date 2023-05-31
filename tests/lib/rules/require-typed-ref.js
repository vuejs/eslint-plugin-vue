/**
 * @author Ivan Demchuk <https://github.com/Demivan>
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/require-typed-ref')

const tester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

tester.run('require-typed-ref', rule, {
  valid: [
    `
      import { ref } from 'vue'
      const count = ref(0)
    `,
    `
      import { shallowRef } from 'vue'
      const count = shallowRef(0)
    `,
    `
      import { ref } from 'vue'
      const count = ref<number>()
    `,
    `
      import { ref } from 'vue'
      const count = ref<number>(0)
    `,
    `
      import { ref } from 'vue'
      const counter: Ref<number | undefined> = ref()
    `,
    `
      import { ref } from 'vue'
      const count = ref(0)
    `,
    {
      parser: require.resolve('vue-eslint-parser'),
      filename: 'test.vue',
      code: `
        <script setup>
          import { ref } from 'vue'
          const count = ref()
        </script>
      `
    }
  ],
  invalid: [
    {
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
      parser: require.resolve('vue-eslint-parser'),
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          import { ref } from 'vue'
          const count = ref()
        </script>
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
    }
  ]
})
