/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-restricted-component-options')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

tester.run('no-restricted-component-options', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        /* ✗ BAD */
        init: function () {},
        beforeCompile: function () {},
        compiled: function () {},
        activate: function () {},
        ready: function () {},
        attached: function () {},
        detached: function () {},

        /* ✓ GOOD */
        beforeCreate: function () {},
        activated: function () {},
        mounted: function () {},
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
          size: Number,
          name: {
            type: String,
            required: true,
            /* ✗ BAD */
            twoWay: true
          }
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
        /* ✓ GOOD */
        beforeCreate: function () {},
        activated: function () {},
        mounted: function () {},
      }
      </script>
      `,
      options: [
        'init',
        'beforeCompile',
        'compiled',
        'activate',
        'ready',
        '/^(?:at|de)tached$/'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        foo: {
          ...bar,
          baz
        }
      }
      </script>
      `,
      options: [['foo', '*', 'baz']]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        foo: {
          ...bar,
          baz
        }
      }
      </script>
      `,
      options: [['foo', 'bar']]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        /* ✗ BAD */
        init: function () {},
        beforeCompile: function () {},
        compiled: function () {},
        activate: function () {},
        ready: function () {},
        attached: function () {},
        detached: function () {},

        /* ✓ GOOD */
        beforeCreate: function () {},
        activated: function () {},
        mounted: function () {},
      }
      </script>
      `,
      options: [
        'init',
        'beforeCompile',
        'compiled',
        'activate',
        'ready',
        '/^(?:at|de)tached$/'
      ],
      errors: [
        {
          message: 'Using `init` is not allowed.',
          line: 5,
          column: 9
        },
        {
          message: 'Using `beforeCompile` is not allowed.',
          line: 6,
          column: 9
        },
        {
          message: 'Using `compiled` is not allowed.',
          line: 7,
          column: 9
        },
        {
          message: 'Using `activate` is not allowed.',
          line: 8,
          column: 9
        },
        {
          message: 'Using `ready` is not allowed.',
          line: 9,
          column: 9
        },
        {
          message: 'Using `attached` is not allowed.',
          line: 10,
          column: 9
        },
        {
          message: 'Using `detached` is not allowed.',
          line: 11,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          size: Number,
          name: {
            type: String,
            required: true,
            /* ✗ BAD */
            twoWay: true
          }
        }
      }
      </script>
      `,
      options: [['props', '/.*/', 'twoWay']],
      errors: [
        {
          message: 'Using `props.name.twoWay` is not allowed.',
          line: 10
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          size: Number,
          name: {
            type: String,
            required: true,
            /* ✗ BAD */
            twoWay: true
          }
        },
        init: function () {},
        beforeCompile: function () {},
        compiled: function () {},
        activate: function () {},
        ready: function () {},
        attached: function () {},
        detached: function () {},

        beforeCreate: function () {},
        activated: function () {},
        mounted: function () {},
      }
      </script>
      `,
      options: [
        {
          name: 'init',
          message: 'Use "beforeCreate" instead.'
        },
        {
          name: '/^(?:at|de)tached$/',
          message: '"attached" and "detached" is deprecated.'
        },
        {
          name: ['props', '/.*/', 'twoWay'],
          message: '"props.*.twoWay" cannot be used.'
        }
      ],
      errors: [
        {
          message: '"props.*.twoWay" cannot be used.',
          line: 10,
          column: 13
        },
        {
          message: 'Use "beforeCreate" instead.',
          line: 13,
          column: 9
        },
        {
          message: '"attached" and "detached" is deprecated.',
          line: 18,
          column: 9
        },
        {
          message: '"attached" and "detached" is deprecated.',
          line: 19,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          size: Number,
          [name]: {
            type: String,
            required: true,
            /* ✗ BAD */
            twoWay: true
          }
        }
      }
      </script>
      `,
      options: [['props', '*', 'twoWay']],
      errors: [
        {
          message: 'Using `props.*.twoWay` is not allowed.',
          line: 10
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        foo: {
          ...bar
        }
      }
      </script>
      `,
      options: [['foo', '*']],
      errors: [
        {
          message: 'Using `foo.*` is not allowed.',
          line: 5
        }
      ]
    }
  ]
})
