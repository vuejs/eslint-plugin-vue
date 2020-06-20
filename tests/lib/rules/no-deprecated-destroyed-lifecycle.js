/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deprecated-destroyed-lifecycle')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})
ruleTester.run('no-deprecated-destroyed-lifecycle', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        unmounted () {},
        beforeUnmount () {},
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        unmounted,
        beforeUnmount,
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        beforeCreate,
        created,
        beforeMount,
        mounted,
        beforeUpdate,
        updated,
        activated,
        deactivated,
        beforeUnmount,
        unmounted,
        errorCaptured,
        renderTracked,
        renderTriggered,
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        beforeUnmount:beforeDestroy,
        unmounted:destroyed,
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        ...beforeDestroy,
        ...destroyed,
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        [beforeDestroy] () {},
        [destroyed] () {},
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
        beforeDestroy () {},
        destroyed () {},
      }
      </script>
      `,
      errors: [
        {
          message:
            'The `beforeDestroy` lifecycle hook is deprecated. Use `beforeUnmount` instead.',
          line: 4,
          suggestions: [
            {
              desc: 'Instead, change to `beforeUnmount`.',
              output: `
      <script>
      export default {
        beforeUnmount () {},
        destroyed () {},
      }
      </script>
      `
            }
          ]
        },
        {
          message:
            'The `destroyed` lifecycle hook is deprecated. Use `unmounted` instead.',
          line: 5,
          suggestions: [
            {
              desc: 'Instead, change to `unmounted`.',
              output: `
      <script>
      export default {
        beforeDestroy () {},
        unmounted () {},
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
        beforeDestroy,
        destroyed,
      }
      </script>
      `,
      errors: [
        {
          message:
            'The `beforeDestroy` lifecycle hook is deprecated. Use `beforeUnmount` instead.',
          line: 4,
          suggestions: [
            {
              desc: 'Instead, change to `beforeUnmount`.',
              output: `
      <script>
      export default {
        beforeUnmount:beforeDestroy,
        destroyed,
      }
      </script>
      `
            }
          ]
        },
        {
          message:
            'The `destroyed` lifecycle hook is deprecated. Use `unmounted` instead.',
          line: 5,
          suggestions: [
            {
              desc: 'Instead, change to `unmounted`.',
              output: `
      <script>
      export default {
        beforeDestroy,
        unmounted:destroyed,
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
        beforeCreate,
        created,
        beforeMount,
        mounted,
        beforeUpdate,
        updated,
        activated,
        deactivated,
        beforeDestroy,
        destroyed,
        errorCaptured,
      }
      </script>
      `,
      errors: [
        {
          message:
            'The `beforeDestroy` lifecycle hook is deprecated. Use `beforeUnmount` instead.',
          line: 12,
          suggestions: [
            {
              desc: 'Instead, change to `beforeUnmount`.',
              output: `
      <script>
      export default {
        beforeCreate,
        created,
        beforeMount,
        mounted,
        beforeUpdate,
        updated,
        activated,
        deactivated,
        beforeUnmount:beforeDestroy,
        destroyed,
        errorCaptured,
      }
      </script>
      `
            }
          ]
        },
        {
          message:
            'The `destroyed` lifecycle hook is deprecated. Use `unmounted` instead.',
          line: 13,
          suggestions: [
            {
              desc: 'Instead, change to `unmounted`.',
              output: `
      <script>
      export default {
        beforeCreate,
        created,
        beforeMount,
        mounted,
        beforeUpdate,
        updated,
        activated,
        deactivated,
        beforeDestroy,
        unmounted:destroyed,
        errorCaptured,
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
        ['beforeDestroy']() {},
        ['destroyed']() {},
      }
      </script>
      `,
      errors: [
        {
          message:
            'The `beforeDestroy` lifecycle hook is deprecated. Use `beforeUnmount` instead.',
          line: 4,
          suggestions: [
            {
              desc: 'Instead, change to `beforeUnmount`.',
              output: `
      <script>
      export default {
        ['beforeUnmount']() {},
        ['destroyed']() {},
      }
      </script>
      `
            }
          ]
        },
        {
          message:
            'The `destroyed` lifecycle hook is deprecated. Use `unmounted` instead.',
          line: 5,
          suggestions: [
            {
              desc: 'Instead, change to `unmounted`.',
              output: `
      <script>
      export default {
        ['beforeDestroy']() {},
        ['unmounted']() {},
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
        [\`beforeDestroy\`]() {},
        [\`destroyed\`]() {},
      }
      </script>
      `,
      errors: [
        {
          message:
            'The `beforeDestroy` lifecycle hook is deprecated. Use `beforeUnmount` instead.',
          line: 4,
          suggestions: [
            {
              desc: 'Instead, change to `beforeUnmount`.',
              output: `
      <script>
      export default {
        [\`beforeUnmount\`]() {},
        [\`destroyed\`]() {},
      }
      </script>
      `
            }
          ]
        },
        {
          message:
            'The `destroyed` lifecycle hook is deprecated. Use `unmounted` instead.',
          line: 5,
          suggestions: [
            {
              desc: 'Instead, change to `unmounted`.',
              output: `
      <script>
      export default {
        [\`beforeDestroy\`]() {},
        [\`unmounted\`]() {},
      }
      </script>
      `
            }
          ]
        }
      ]
    }
  ]
})
