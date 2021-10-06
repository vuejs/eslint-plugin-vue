/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-define-emits')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' }
})

tester.run('valid-define-emits', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
        /* ✓ GOOD */
        defineEmits({ notify: null })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        /* ✓ GOOD */
        defineEmits(['notify'])
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
        /* ✓ GOOD */
        defineEmits<(e: 'notify')=>void>()
      </script>
      `,
      parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        const def = { notify: null }
      </script>
      <script setup>
        /* ✓ GOOD */
        defineEmits(def)
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineEmits({
          notify (payload) {
            return typeof payload === 'string'
          }
        })
      </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
        /* ✗ BAD */
        const def = { notify: null }
        defineEmits(def)
      </script>
      `,
      errors: [
        {
          message: '`defineEmits` are referencing locally declared variables.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
        /* ✗ BAD */
        defineEmits<(e: 'notify')=>void>({ submit: null })
      </script>
      `,
      parserOptions: { parser: require.resolve('@typescript-eslint/parser') },
      errors: [
        {
          message: '`defineEmits` has both a type-only emit and an argument.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        /* ✗ BAD */
        defineEmits({ notify: null })
        defineEmits({ submit: null })
      </script>
      `,
      errors: [
        {
          message: '`defineEmits` has been called multiple times.',
          line: 4
        },
        {
          message: '`defineEmits` has been called multiple times.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: ['notify']
      }
      </script>
      <script setup>
        /* ✗ BAD */
        defineEmits({ submit: null })
      </script>
      `,
      errors: [
        {
          message:
            'Custom events are defined in both `defineEmits` and `export default {}`.',
          line: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        /* ✗ BAD */
        defineEmits()
      </script>
      `,
      errors: [
        {
          message: 'Custom events are not defined.',
          line: 4
        }
      ]
    }
  ]
})
