/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-multiple-slot-args')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})
ruleTester.run('no-multiple-slot-args', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          var children = this.$scopedSlots.default()
          var children = this.$scopedSlots.foo(foo)
          const bar = this.$scopedSlots.bar
          bar(foo)
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
          unknown.$scopedSlots.default(foo, bar)
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
          // for Vue3
          var children = this.$slots.default()
          var children = this.$slots.foo(foo)
          const bar = this.$slots.bar
          bar(foo)
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
          this.$foo.default(foo, bar)
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
          this.$scopedSlots.default(foo, bar)
          this.$scopedSlots.foo(foo, bar)
        }
      }
      </script>
      `,
      errors: [
        {
          message: 'Unexpected multiple arguments.',
          line: 5,
          column: 42,
          endLine: 5,
          endColumn: 45
        },
        {
          message: 'Unexpected multiple arguments.',
          line: 6,
          column: 38,
          endLine: 6,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          this?.$scopedSlots?.default?.(foo, bar)
          this?.$scopedSlots?.foo?.(foo, bar)
          const vm = this
          vm?.$scopedSlots?.default?.(foo, bar)
          vm?.$scopedSlots?.foo?.(foo, bar)
        }
      }
      </script>
      `,
      errors: [
        'Unexpected multiple arguments.',
        'Unexpected multiple arguments.',
        'Unexpected multiple arguments.',
        'Unexpected multiple arguments.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          this.$scopedSlots.default?.(foo, bar)
          this.$scopedSlots.foo?.(foo, bar)
          const vm = this
          vm.$scopedSlots.default?.(foo, bar)
          vm.$scopedSlots.foo?.(foo, bar)
        }
      }
      </script>
      `,
      errors: [
        'Unexpected multiple arguments.',
        'Unexpected multiple arguments.',
        'Unexpected multiple arguments.',
        'Unexpected multiple arguments.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          ;(this?.$scopedSlots)?.default?.(foo, bar)
          ;(this?.$scopedSlots?.foo)?.(foo, bar)
          const vm = this
          ;(vm?.$scopedSlots)?.default?.(foo, bar)
          ;(vm?.$scopedSlots?.foo)?.(foo, bar)
        }
      }
      </script>
      `,
      errors: [
        'Unexpected multiple arguments.',
        'Unexpected multiple arguments.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          ;(this?.$scopedSlots).default(foo, bar)
          ;(this?.$scopedSlots?.foo)(foo, bar)
          const vm = this
          ;(vm?.$scopedSlots).default(foo, bar)
          ;(vm?.$scopedSlots?.foo)(foo, bar)
        }
      }
      </script>
      `,
      errors: [
        'Unexpected multiple arguments.',
        'Unexpected multiple arguments.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          let children

          this.$scopedSlots.default(foo, { bar })

          children = this.$scopedSlots.foo
          if (children) children(...foo)
        }
      }
      </script>
      `,
      errors: [
        {
          message: 'Unexpected multiple arguments.',
          line: 7,
          column: 42,
          endLine: 7,
          endColumn: 49
        },
        {
          message: 'Unexpected spread argument.',
          line: 10,
          column: 34,
          endLine: 10,
          endColumn: 40
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        render (h) {
          // for Vue3
          this.$slots.default(foo, bar)
          this.$slots.foo(foo, bar)
        }
      }
      </script>
      `,
      errors: [
        'Unexpected multiple arguments.',
        'Unexpected multiple arguments.'
      ]
    }
  ]
})
