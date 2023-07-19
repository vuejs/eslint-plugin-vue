/**
 * @author Flo Edelmann
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-deprecated-model-definition')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-deprecated-model-definition', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <script>
        export default { name: 'test' }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          model: {
            prop: 'fooBar',
            event: 'update:fooBar'
          }
        }
        </script>
      `,
      options: [{ allowVue3Compat: true }]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default defineComponent({
          model: {
            prop: 'foo-bar',
            event: 'update:foo-bar'
          }
        })
        </script>
      `,
      options: [{ allowVue3Compat: true }]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          model: {
            prop: 'foo',
          }
        }
        </script>
      `,
      errors: [
        {
          message: '`model` definition is deprecated.',
          line: 4,
          column: 11,
          endLine: 6,
          endColumn: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default Vue.extend({
          model: {
            event: 'update'
          }
        })
        </script>
      `,
      errors: [
        {
          message: '`model` definition is deprecated.',
          line: 4,
          column: 11,
          endLine: 6,
          endColumn: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default defineComponent({
          model: {
            prop: 'foo',
            event: 'update'
          }
        })
        </script>
      `,
      errors: [
        {
          message: '`model` definition is deprecated.',
          line: 4,
          column: 11,
          endLine: 7,
          endColumn: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          model: {
            prop: 'foo',
          }
        }
        </script>
      `,
      options: [{ allowVue3Compat: true }],
      errors: [
        {
          message: '`model` definition is deprecated.',
          line: 4,
          column: 11,
          endLine: 6,
          endColumn: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default Vue.extend({
          model: {
            event: 'update'
          }
        })
        </script>
      `,
      options: [{ allowVue3Compat: true }],
      errors: [
        {
          message: '`model` definition is deprecated.',
          line: 4,
          column: 11,
          endLine: 6,
          endColumn: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default defineComponent({
          model: {
            prop: 'foo',
            event: 'update'
          }
        })
        </script>
      `,
      options: [{ allowVue3Compat: true }],
      errors: [
        {
          message: '`model` definition is deprecated.',
          line: 4,
          column: 11,
          endLine: 7,
          endColumn: 12,
          suggestions: [
            {
              desc: 'Rename event to `update:foo`.',
              output: `
        <script>
        export default defineComponent({
          model: {
            prop: 'foo',
            event: 'update:foo'
          }
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
