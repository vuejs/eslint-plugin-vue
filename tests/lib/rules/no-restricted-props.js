/**
 * @author Yosuke Ota
 */
'use strict'

const semver = require('semver')
const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-restricted-props')
const {
  getTypeScriptFixtureTestOptions
} = require('../../test-utils/typescript')

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
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps({
        foo: {},
      })
      </script>
      `,
      options: [{ name: 'foo', suggest: 'Foo' }],
      errors: [
        {
          message: 'Using `foo` props is not allowed.',
          line: 4,
          suggestions: [
            {
              desc: 'Instead, change to `Foo`.',
              output: `
      <script setup>
      defineProps({
        Foo: {},
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
      defineProps(['foo'])
      </script>
      `,
      options: [{ name: 'foo', suggest: 'Foo' }],
      errors: [
        {
          message: 'Using `foo` props is not allowed.',
          line: 3,
          suggestions: [
            {
              desc: 'Instead, change to `Foo`.',
              output: `
      <script setup>
      defineProps(["Foo"])
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
      <script setup lang="ts">
      defineProps<{
        foo:boolean
      }>()
      </script>
      `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      options: [{ name: 'foo', suggest: 'Foo' }],
      errors: [
        {
          message: 'Using `foo` props is not allowed.',
          line: 4,
          suggestions: [
            {
              desc: 'Instead, change to `Foo`.',
              output: `
      <script setup lang="ts">
      defineProps<{
        Foo:boolean
      }>()
      </script>
      `
            }
          ]
        }
      ]
    },
    ...(semver.lt(
      require('@typescript-eslint/parser/package.json').version,
      '4.0.0'
    )
      ? []
      : [
          {
            filename: 'test.vue',
            code: `
      <script setup lang="ts">
      interface Props {
        foo:boolean
      }
      defineProps<Props>()
      </script>
      `,
            parserOptions: {
              parser: require.resolve('@typescript-eslint/parser')
            },
            options: [{ name: 'foo', suggest: 'Foo' }],
            errors: [
              {
                message: 'Using `foo` props is not allowed.',
                line: 4,
                suggestions: [
                  {
                    desc: 'Instead, change to `Foo`.',
                    output: `
      <script setup lang="ts">
      interface Props {
        Foo:boolean
      }
      defineProps<Props>()
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
      <script setup lang="ts">
      interface Props {
        foo:boolean
      }
      withDefaults(defineProps<Props>(),
        {
          foo: false
        }
      )
      </script>
      `,
            parserOptions: {
              parser: require.resolve('@typescript-eslint/parser')
            },
            options: [{ name: 'foo', suggest: 'Foo' }],
            errors: [
              {
                message: 'Using `foo` props is not allowed.',
                line: 4,
                suggestions: [
                  {
                    desc: 'Instead, change to `Foo`.',
                    output: `
      <script setup lang="ts">
      interface Props {
        Foo:boolean
      }
      withDefaults(defineProps<Props>(),
        {
          Foo: false
        }
      )
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
      const foo = false
      </script>
      <script setup lang="ts">
      interface Props {
        foo:boolean
      }
      withDefaults(defineProps<Props>(),
        {
          foo
        }
      )
      </script>
      `,
            parserOptions: {
              parser: require.resolve('@typescript-eslint/parser')
            },
            options: [{ name: 'foo', suggest: 'Foo' }],
            errors: [
              {
                message: 'Using `foo` props is not allowed.',
                line: 7,
                suggestions: [
                  {
                    desc: 'Instead, change to `Foo`.',
                    output: `
      <script>
      const foo = false
      </script>
      <script setup lang="ts">
      interface Props {
        Foo:boolean
      }
      withDefaults(defineProps<Props>(),
        {
          Foo:foo
        }
      )
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
      <script setup lang="ts">
      withDefaults(defineProps<Props>(),
        {
          foo: false
        }
      )
      interface Props {
        foo:boolean
      }
      </script>
      `,
            parserOptions: {
              parser: require.resolve('@typescript-eslint/parser')
            },
            options: [{ name: 'foo', suggest: 'Foo' }],
            errors: [
              {
                message: 'Using `foo` props is not allowed.',
                line: 9,
                suggestions: [
                  {
                    desc: 'Instead, change to `Foo`.',
                    output: `
      <script setup lang="ts">
      withDefaults(defineProps<Props>(),
        {
          Foo: false
        }
      )
      interface Props {
        Foo:boolean
      }
      </script>
      `
                  }
                ]
              }
            ]
          },
          {
            code: `
            <script setup lang="ts">
            import {Props1 as Props} from './test01'
            defineProps<Props>()
            </script>
            `,
            ...getTypeScriptFixtureTestOptions(),
            options: [{ name: 'foo', suggest: 'Foo' }],
            errors: [
              {
                message: 'Using `foo` props is not allowed.',
                line: 4,
                suggestions: null
              }
            ]
          }
        ])
  ]
})
