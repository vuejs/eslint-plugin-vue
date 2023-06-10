/**
 * @author ItMaga <https://github.com/ItMaga>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-restricted-component-names')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-restricted-component-names', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        name: 'Allow'
      }
      `
    },
    {
      filename: 'test.vue',
      code: `
      new Vue({
        name: 'Allow',
      })
    `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineOptions({
        name: 'Allow'
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
        name: 'Disallow'
      }
      </script>
      `,
      options: ['Disallow', 'Disallow2'],
      errors: [
        {
          message: 'Using component name `Disallow` is not allowed.',
          line: 4,
          column: 15
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      new Vue({
        name: 'Disallow',
      })
      </script>
      `,
      options: ['Disallow'],
      errors: [
        {
          message: 'Using component name `Disallow` is not allowed.',
          line: 4,
          column: 15
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineOptions({
        name: 'Disallow'
      })
      </script>
      `,
      options: ['Disallow'],
      errors: [
        {
          message: 'Using component name `Disallow` is not allowed.',
          line: 4,
          column: 15
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineOptions({
        name: 'FooBar'
      })
      </script>
      `,
      options: ['/^Foo(Bar|Baz)/'],
      errors: [
        {
          message: 'Using component name `FooBar` is not allowed.',
          line: 4,
          column: 15
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineOptions({
        name: 'Disallow',
        inheritAttrs: false,
      })
      </script>
      `,
      options: [
        { name: 'Disallow', message: 'Custom message', suggest: 'Allow' }
      ],
      errors: [
        {
          message: 'Custom message',
          line: 4,
          column: 15,
          suggestions: [
            {
              desc: 'Instead, change to `Allow`.',
              output: `
      <script setup>
      defineOptions({
        name: "Allow",
        inheritAttrs: false,
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
      defineOptions({
        name: 'Disallow',
        inheritAttrs: false,
      })
      </script>
      `,
      options: [{ name: 'Disallow', suggest: 'Allow' }],
      errors: [
        {
          message: 'Using component name `Disallow` is not allowed.',
          line: 4,
          column: 15,
          suggestions: [
            {
              desc: 'Instead, change to `Allow`.',
              output: `
      <script setup>
      defineOptions({
        name: "Allow",
        inheritAttrs: false,
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
      defineOptions({
        name: 'Disallow',
        inheritAttrs: false,
      })
      </script>
      `,
      options: [{ name: 'Disallow', message: 'Custom message' }],
      errors: [
        {
          message: 'Custom message',
          line: 4,
          column: 15
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineOptions({
        name: 1
      })
      </script>
      `,
      options: ['1'],
      errors: [
        {
          message: 'Using component name `1` is not allowed.',
          line: 4,
          column: 15
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineOptions({
        name: 'disallowed-component',
      })
      </script>
      `,
      options: ['DisallowedComponent'],
      errors: [
        {
          message:
            'Using component name `disallowed-component` is not allowed.',
          line: 4,
          column: 15
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineOptions({
        name: 'DisallowedComponent',
      })
      </script>
      `,
      options: ['disallowed-component'],
      errors: [
        {
          message: 'Using component name `DisallowedComponent` is not allowed.',
          line: 4,
          column: 15
        }
      ]
    }
  ]
})
