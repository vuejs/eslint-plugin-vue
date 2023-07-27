/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-define-options')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' }
})

tester.run('valid-define-options', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineOptions({ name: 'foo' })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      const def = { name: 'foo' }
      </script>
      <script setup>
      defineOptions(def)
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      type X = string;

      defineOptions({ name: 'foo' as X })
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
      const str = 'abc'

      defineOptions({ name: 'foo' as (typeof str) })
      </script>
      `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { def } from './defs';

      defineOptions(def);
      </script>`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const def = { name: 'Foo' }
        defineOptions(def)
      </script>
      `,
      errors: [
        {
          message: '`defineOptions` is referencing locally declared variables.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineOptions({ name: 'Foo' })
        defineOptions({ name: 'Bar' })
      </script>
      `,
      errors: [
        {
          message: '`defineOptions` has been called multiple times.',
          line: 3
        },
        {
          message: '`defineOptions` has been called multiple times.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineOptions()
      </script>
      `,
      errors: [
        {
          message: 'Options are not defined.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineOptions<{ name: 'Foo' }>()
      </script>
      `,
      parserOptions: { parser: require.resolve('@typescript-eslint/parser') },
      errors: [
        {
          message: 'Options are not defined.',
          line: 3
        },
        {
          message: '`defineOptions()` cannot accept type arguments.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineOptions({ props: { msg: String } })
      </script>
      `,
      errors: [
        {
          message:
            '`defineOptions()` cannot be used to declare `props`. Use `defineProps()` instead.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineOptions({ emits: ['click'] })
      </script>
      `,
      errors: [
        {
          message:
            '`defineOptions()` cannot be used to declare `emits`. Use `defineEmits()` instead.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineOptions({ expose: ['foo'] })
      </script>
      `,
      errors: [
        {
          message:
            '`defineOptions()` cannot be used to declare `expose`. Use `defineExpose()` instead.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineOptions({ slots: Object })
      </script>
      `,
      errors: [
        {
          message:
            '`defineOptions()` cannot be used to declare `slots`. Use `defineSlots()` instead.',
          line: 3
        }
      ]
    }
  ]
})
