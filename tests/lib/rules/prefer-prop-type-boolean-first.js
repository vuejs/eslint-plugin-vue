/**
 * @author Pig Fang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/prefer-prop-type-boolean-first')

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
              foo: Boolean
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              foo: String
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              foo: [Boolean]
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              foo: [String]
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              foo: [Boolean, String]
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              foo: { type: Boolean }
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              foo: { type: String }
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              foo: { type: [Boolean] }
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              foo: { type: [String] }
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              foo: { type: [Boolean, String] }
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
              foo: [Boolean, String]
            }
          })
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default Vue.extend({
            props: {
              foo: { type: [Boolean, String] }
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
            foo: [Boolean, String]
          })
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          defineProps({
            foo: { type: [Boolean, String] }
          })
        </script>
      `
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
    }
  ]
})
