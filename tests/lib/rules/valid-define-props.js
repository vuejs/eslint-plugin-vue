/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/valid-define-props')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' }
})

tester.run('valid-define-props', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
        /* ✓ GOOD */
        defineProps({ msg: String })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        /* ✓ GOOD */
        defineProps(['msg'])
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
        /* ✓ GOOD */
        defineProps<{ msg?:string }>()
      </script>
      `,
      parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        const def = { msg: String }
      </script>
      <script setup>
        /* ✓ GOOD */
        defineProps(def)
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineProps({
          addFunction: {
            type: Function,
            default (a, b) {
              return a + b
            }
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
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
        /* ✗ BAD */
        const def = { msg: String }
        defineProps(def)
      </script>
      `,
      errors: [
        {
          message: '`defineProps` are referencing locally declared variables.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
        /* ✗ BAD */
        defineProps<{ msg?:string }>({ msg: String })
      </script>
      `,
      parserOptions: { parser: require.resolve('@typescript-eslint/parser') },
      errors: [
        {
          message: '`defineProps` has both a type-only props and an argument.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        /* ✗ BAD */
        defineProps({ msg: String })
        defineProps({ count: Number })
      </script>
      `,
      errors: [
        {
          message: '`defineProps` has been called multiple times.',
          line: 4
        },
        {
          message: '`defineProps` has been called multiple times.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: { msg: String }
      }
      </script>
      <script setup>
        /* ✗ BAD */
        defineProps({ count: Number })
      </script>
      `,
      errors: [
        {
          message:
            'Props are defined in both `defineProps` and `export default {}`.',
          line: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        /* ✗ BAD */
        defineProps()
      </script>
      `,
      errors: [
        {
          message: 'Props are not defined.',
          line: 4
        }
      ]
    }
  ]
})
