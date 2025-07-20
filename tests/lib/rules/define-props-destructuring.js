/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/define-props-destructuring')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2015,
    sourceType: 'module'
  }
})

tester.run('define-props-destructuring', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps()
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const { foo = 'default' } = defineProps(['foo'])
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const { foo = 'default' } = defineProps<{ foo?: string }>()
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps(['foo'])
      </script>
      `,
      options: [{ destructure: 'never' }]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = withDefaults(defineProps(['foo']), { foo: 'default' })
      </script>
      `,
      options: [{ destructure: 'never' }]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps<{ foo?: string }>()
      </script>
      `,
      options: [{ destructure: 'never' }],
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps(['foo'])
      </script>
      `,
      errors: [
        {
          messageId: 'preferDestructuring',
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = withDefaults(defineProps(['foo']), { foo: 'default' })
      </script>
      `,
      errors: [
        {
          messageId: 'preferDestructuring',
          line: 3,
          column: 34,
          endLine: 3,
          endColumn: 54
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const { foo } = withDefaults(defineProps(['foo']), { foo: 'default' })
      </script>
      `,
      errors: [
        {
          messageId: 'avoidWithDefaults',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = withDefaults(defineProps<{ foo?: string }>(), { foo: 'default' })
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'preferDestructuring',
          line: 3,
          column: 34,
          endLine: 3,
          endColumn: 65
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const { foo } = withDefaults(defineProps<{ foo?: string }>(), { foo: 'default' })
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'avoidWithDefaults',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const { foo } = defineProps(['foo'])
      </script>
      `,
      options: [{ destructure: 'never' }],
      errors: [
        {
          messageId: 'avoidDestructuring',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 43
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const { foo } = withDefaults(defineProps(['foo']), { foo: 'default' })
      </script>
      `,
      options: [{ destructure: 'never' }],
      errors: [
        {
          messageId: 'avoidDestructuring',
          line: 3,
          column: 36,
          endLine: 3,
          endColumn: 56
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const { foo } = defineProps<{ foo?: string }>()
      </script>
      `,
      options: [{ destructure: 'never' }],
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'avoidDestructuring',
          line: 3,
          column: 23,
          endLine: 3,
          endColumn: 54
        }
      ]
    }
  ]
})
