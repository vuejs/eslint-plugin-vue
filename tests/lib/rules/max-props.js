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
      <script setup>
      defineProps({ prop1: '', prop2: '' })
      </script>
      `,
      options: [{ maxProps: 5 }]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps(['prop1', 'prop2'])
      </script>
      `,
      options: [{ maxProps: 5 }]
    },
    {
      filename: 'test.vue',
      code: `
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
      <script setup>
      defineProps({})
      </script>
      `,
      options: [{ maxProps: 5 }]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      </script>
      `,
      options: [{ maxProps: 5 }]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps<{ prop1: string, prop2: string }>();
      </script>
      `,
      options: [{ maxProps: 5 }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps<{prop1: string, prop2: string} | {prop1: number}>()
      </script>
      `,
      options: [{ maxProps: 2 }],
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({ prop1: '', prop2: '' })
      </script>
      `,
      options: [{ maxProps: 1 }],
      errors: [
        {
          message: 'Component has too many props (2). Maximum allowed is 1.',
          line: 3,
          endLine: 3,
          column: 7,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
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
          line: 4,
          endLine: 7,
          column: 9,
          endColumn: 10
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps<{ prop1: string, prop2: string, prop3: string }>();
      </script>
      `,
      options: [{ maxProps: 2 }],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Component has too many props (3). Maximum allowed is 2.',
          line: 3,
          endLine: 3,
          column: 7,
          endColumn: 69
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps<{prop1: string, prop2: string} | {prop1: number, prop3: string}>()
      </script>
      `,
      options: [{ maxProps: 2 }],
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Component has too many props (3). Maximum allowed is 2.',
          line: 3,
          endLine: 3,
          column: 7,
          endColumn: 85
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps<{
        prop1: string
      } & {
        prop2?: true;
        prop3?: never;
      } | {
        prop2?: false;
        prop3?: boolean;
      }>()
      </script>
      `,
      options: [{ maxProps: 2 }],
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: 'Component has too many props (3). Maximum allowed is 2.',
          line: 3,
          endLine: 11,
          column: 7,
          endColumn: 11
        }
      ]
    }
  ]
})
