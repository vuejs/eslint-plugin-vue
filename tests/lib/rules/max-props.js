/**
 * @author kevsommer Kevin Sommer
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/max-props')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('max-props', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>

      </template>
      <script setup>
      defineProps({ prop1: '', prop2: '' })
      </script>
      `,
      options: [{ maxProps: 5 }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>

      </template>
      <script>
      export default {
        props: {
          prop1: String,
          prop2: String
        }
      }
      </script>
      `,
      options: [{ maxProps: 5 }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>

      </template>
      <script>
      export default {
        props: {
          prop1: String,
          prop2: String,
          prop3: String,
          prop4: String,
          prop5: String
        }
      }
      </script>
      `,
      options: [{ maxProps: 5 }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>

      </template>
      <script>
      export default {
        props: {}
      }
      </script>
      `,
      options: [{ maxProps: 5 }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>

      </template>
      <script setup>
      defineProps({})
      </script>
      `,
      options: [{ maxProps: 5 }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>

      </template>
      <script>
      </script>
      `,
      options: [{ maxProps: 5 }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
      </template>
      <script setup>
      defineProps({ prop1: '', prop2: '' })
      </script>
      `,
      options: [{ maxProps: 1 }],
      errors: [
        {
          message: 'Component has too many props (2). Maximum allowed is 1.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
      </template>
      <script>
      export default {
        props: {
          prop1: String,
          prop2: String
        }
      }
      </script>
      `,
      options: [{ maxProps: 1 }],
      errors: [
        {
          message: 'Component has too many props (2). Maximum allowed is 1.',
          line: 7
        }
      ]
    }
  ]
})
