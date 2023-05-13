/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-define-emits')

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
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1656
      filename: 'test.vue',
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      code: `
      <script setup lang="ts">
      import type { PropType } from 'vue';

      type X = string;

      const props = defineProps({
        myProp: Array as PropType<string[]>,
      });

      const emit = defineEmits({
        myProp: (x: X) => true,
      });
      </script>
      `
    },
    {
      filename: 'test.vue',
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      code: `
      <script setup lang="ts">
      import type { PropType } from 'vue';

      const strList = ['a', 'b', 'c']
      const str = 'abc'

      const props = defineProps({
        myProp: Array as PropType<typeof strList>,
      });

      const emit = defineEmits({
        myProp: (x: typeof str) => true,
      });
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { propsDef, emitsDef } from './defs';

      defineProps(propsDef);
      defineEmits(emitsDef);
      </script>`
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
          message: '`defineEmits` is referencing locally declared variables.',
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
