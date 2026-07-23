/**
 * @author ItMaga <https://github.com/ItMaga>
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-restricted-component-names'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-restricted-component-names', rule as RuleModule, {
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
          column: 15,
          endLine: 4,
          endColumn: 25
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
          column: 15,
          endLine: 4,
          endColumn: 25
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
          column: 15,
          endLine: 4,
          endColumn: 25
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
          column: 15,
          endLine: 4,
          endColumn: 23
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
          endLine: 4,
          endColumn: 25,
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
          endLine: 4,
          endColumn: 25,
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
          column: 15,
          endLine: 4,
          endColumn: 25
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
          column: 15,
          endLine: 4,
          endColumn: 16
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
          column: 15,
          endLine: 4,
          endColumn: 37
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
          column: 15,
          endLine: 4,
          endColumn: 36
        }
      ]
    }
  ]
})
