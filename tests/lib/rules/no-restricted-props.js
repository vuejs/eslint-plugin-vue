/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-restricted-props')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

tester.run('no-restricted-props', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          /* ✗ BAD */
          bad: {},
          /* ✓ GOOD */
          good: {}
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
        props: [
          /* ✗ BAD */
          'bad',
          /* ✓ GOOD */
          'good'
        ]
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: {
          foo: null,
          bar: null,
          baz: null
        }
      }
      </script>
      `,
      options: ['foo', 'bar', 'baz']
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: [foo, ...bar, baz],
        emits: ['foo', 'bar', 'baz']
      }
      </script>
      `,
      options: ['foo', 'bar', 'baz']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          /* ✗ BAD */
          bad: {},
          /* ✓ GOOD */
          good: {}
        }
      }
      </script>
      `,
      options: ['bad'],
      errors: [
        {
          message: 'Using `bad` props is not allowed.',
          line: 6,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: [
          /* ✗ BAD */
          'bad',
          /* ✓ GOOD */
          'good'
        ]
      }
      </script>
      `,
      options: ['bad'],
      errors: [
        {
          message: 'Using `bad` props is not allowed.',
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: {
          bad: String,
          good: bb
        }
      }
      </script>
      `,
      options: ['/a/'],
      errors: ['Using `bad` props is not allowed.']
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: [
          'foo',
          'bar',
          'baz'
        ]
      }
      </script>
      `,
      options: [{ name: 'bar' }, { name: 'baz', message: 'Using Baz' }],
      errors: [
        {
          message: 'Using `bar` props is not allowed.',
          line: 6
        },
        {
          message: 'Using Baz',
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        props: [
          'foo',
          \`bar\`,
          0
        ]
      }
      </script>
      `,
      options: [
        { name: 'foo', suggest: 'Foo' },
        { name: 'bar', suggest: 'Bar' },
        { name: '0', suggest: 'Zero' }
      ],
      errors: [
        {
          message: 'Using `foo` props is not allowed.',
          line: 5,
          suggestions: [
            {
              desc: 'Instead, change to `Foo`.',
              output: `
      <script>
      export default {
        props: [
          "Foo",
          \`bar\`,
          0
        ]
      }
      </script>
      `
            }
          ]
        },
        {
          message: 'Using `bar` props is not allowed.',
          line: 6,
          suggestions: [
            {
              desc: 'Instead, change to `Bar`.',
              output: `
      <script>
      export default {
        props: [
          'foo',
          "Bar",
          0
        ]
      }
      </script>
      `
            }
          ]
        },
        {
          message: 'Using `0` props is not allowed.',
          line: 7,
          suggestions: [
            {
              desc: 'Instead, change to `Zero`.',
              output: `
      <script>
      export default {
        props: [
          'foo',
          \`bar\`,
          "Zero"
        ]
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
          foo: {},
          bar: {},
          [\`baz\`]: {},
        }
      }
      </script>
      `,
      options: [
        { name: 'foo', suggest: 'Foo' },
        { name: 'bar', suggest: 'b-a-r' },
        { name: 'baz', suggest: 'Baz' }
      ],
      errors: [
        {
          message: 'Using `foo` props is not allowed.',
          line: 5,
          suggestions: [
            {
              desc: 'Instead, change to `Foo`.',
              output: `
      <script>
      export default {
        props: {
          Foo: {},
          bar: {},
          [\`baz\`]: {},
        }
      }
      </script>
      `
            }
          ]
        },
        {
          message: 'Using `bar` props is not allowed.',
          line: 6,
          suggestions: [
            {
              desc: 'Instead, change to `b-a-r`.',
              output: `
      <script>
      export default {
        props: {
          foo: {},
          "b-a-r": {},
          [\`baz\`]: {},
        }
      }
      </script>
      `
            }
          ]
        },
        {
          message: 'Using `baz` props is not allowed.',
          line: 7,
          suggestions: [
            {
              desc: 'Instead, change to `Baz`.',
              output: `
      <script>
      export default {
        props: {
          foo: {},
          bar: {},
          ["Baz"]: {},
        }
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
