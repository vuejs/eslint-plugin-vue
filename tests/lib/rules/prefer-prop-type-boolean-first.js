/**
 * @author Pig Fang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/prefer-prop-type-boolean-first')
const {
  getTypeScriptFixtureTestOptions
} = require('../../test-utils/typescript')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('prefer-prop-type-boolean-first', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              a: Boolean,
              b: String,
              c: [Boolean],
              d: [String],
              e: [Boolean, String],
              f: { type: Boolean },
              g: { type: String },
              h: { type: [Boolean] },
              i: { type: [String] },
              j: { type: [Boolean, String] },
              k: {},
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default Vue.extend({
            props: {
              a: [Boolean, String],
              b: { type: [Boolean, String] },
            }
          })
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          defineProps({
            a: [Boolean, String],
            b: { type: [Boolean, String] },
          })
        </script>
      `
    },
    {
      code: `
      <script setup lang="ts">
      import {Props1 as Props} from './test01'
      defineProps<Props>()
      </script>`,
      ...getTypeScriptFixtureTestOptions()
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              foo: [String, Boolean]
            }
          }
        </script>
      `,
      errors: [
        {
          messageId: 'shouldBeFirst',
          line: 5,
          column: 29,
          suggestions: [
            {
              messageId: 'moveToFirst',
              output: `
        <script>
          export default {
            props: {
              foo: [Boolean, String]
            }
          }
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              foo: { type: [String, Boolean] }
            }
          }
        </script>
      `,
      errors: [
        {
          messageId: 'shouldBeFirst',
          line: 5,
          column: 37,
          suggestions: [
            {
              messageId: 'moveToFirst',
              output: `
        <script>
          export default {
            props: {
              foo: { type: [Boolean, String] }
            }
          }
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default Vue.extend({
            props: {
              foo: [String, Boolean]
            }
          })
        </script>
      `,
      errors: [
        {
          messageId: 'shouldBeFirst',
          line: 5,
          column: 29,
          suggestions: [
            {
              messageId: 'moveToFirst',
              output: `
        <script>
          export default Vue.extend({
            props: {
              foo: [Boolean, String]
            }
          })
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default Vue.extend({
            props: {
              foo: { type: [String, Boolean] }
            }
          })
        </script>
      `,
      errors: [
        {
          messageId: 'shouldBeFirst',
          line: 5,
          column: 37,
          suggestions: [
            {
              messageId: 'moveToFirst',
              output: `
        <script>
          export default Vue.extend({
            props: {
              foo: { type: [Boolean, String] }
            }
          })
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          defineProps({
            foo: [String, Boolean]
          })
        </script>
      `,
      errors: [
        {
          messageId: 'shouldBeFirst',
          line: 4,
          column: 27,
          suggestions: [
            {
              messageId: 'moveToFirst',
              output: `
        <script setup>
          defineProps({
            foo: [Boolean, String]
          })
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          defineProps({
            foo: { type: [String, Boolean] }
          })
        </script>
      `,
      errors: [
        {
          messageId: 'shouldBeFirst',
          line: 4,
          column: 35,
          suggestions: [
            {
              messageId: 'moveToFirst',
              output: `
        <script setup>
          defineProps({
            foo: { type: [Boolean, String] }
          })
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          defineProps({
            foo: { type: [String, Boolean, Number] }
          })
        </script>
      `,
      errors: [
        {
          messageId: 'shouldBeFirst',
          line: 4,
          column: 35,
          suggestions: [
            {
              messageId: 'moveToFirst',
              output: `
        <script setup>
          defineProps({
            foo: { type: [Boolean, String, Number] }
          })
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          defineProps({
            foo: { type: [String, Number, Boolean] }
          })
        </script>
      `,
      errors: [
        {
          messageId: 'shouldBeFirst',
          line: 4,
          column: 43,
          suggestions: [
            {
              messageId: 'moveToFirst',
              output: `
        <script setup>
          defineProps({
            foo: { type: [Boolean, String, Number] }
          })
        </script>
      `
            }
          ]
        }
      ]
    }
  ]
})
