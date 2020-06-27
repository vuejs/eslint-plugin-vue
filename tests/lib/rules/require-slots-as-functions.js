/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-slots-as-functions')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2018, sourceType: 'module' }
})
ruleTester.run('require-slots-as-functions', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          var children = this.$slots.default()
          var children = this.$slots.default && this.$slots.default()

          return h('div', this.$slots.default)
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
        render (h) {
          var children = unknown.$slots.default
          var children = unknown.$slots.default.filter(test)

          return h('div', [...children])
        }
      }
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
        render (h) {
          var children = this.$slots.default
          var children = this.$slots.default.filter(test)

          return h('div', [...children])
        }
      }
      </script>
      `,
      errors: [
        {
          message: 'Property in `$slots` should be used as function.',
          line: 5,
          column: 38,
          endLine: 5,
          endColumn: 45
        },
        {
          message: 'Property in `$slots` should be used as function.',
          line: 6,
          column: 38,
          endLine: 6,
          endColumn: 45
        }
      ]
    },

    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          let children

          const [node] = this.$slots.foo
          const bar = [this.$slots[foo]]

          children = this.$slots.foo

          return h('div', children.filter(test))
        }
      }
      </script>
      `,
      errors: [
        'Property in `$slots` should be used as function.',
        'Property in `$slots` should be used as function.',
        'Property in `$slots` should be used as function.'
      ]
    }
  ]
})
