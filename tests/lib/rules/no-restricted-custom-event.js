/**
 * @author Yosuke Ota
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-restricted-custom-event')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

tester.run('no-restricted-custom-event', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="$emit('click')"></button>
      </template>
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit('foo')
            this.$emit('bar')
          }
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="$emit('click')"></button>
      </template>
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit('good')
          }
        }
      }
      </script>
      `,
      options: ['bad']
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="$emit(0)"></button>
        <button @click="emit('ignore')"></button>
      </template>
      <script>
      export default {
        setup(props, {emit}) {
          emit(ignore)
        }
      }
      </script>
      `,
      options: ['ignore', '0']
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props, emit) {
          emit('ignore')
        }
      }
      </script>
      `,
      options: ['ignore', '0']
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props, ...emit) {
          emit('ignore')
        }
      }
      </script>
      `,
      options: ['ignore', '0']
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props) {
          emit('ignore')
        }
      }
      </script>
      `,
      options: ['ignore', '0']
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props, {a: emit}) {
          emit('ignore')
        }
      }
      </script>
      `,
      options: ['ignore', '0']
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            /* ✗ BAD */
            this.$emit('bad')

            /* ✓ GOOD */
            this.$emit('good')
          }
        }
      }
      </script>
      `,
      options: ['bad'],
      errors: [
        {
          message: 'Using `bad` event is not allowed.',
          line: 7,
          column: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit('foo')
            this.$emit('bar', 123)
          }
        }
      }
      </script>
      `,
      options: [
        { event: 'foo' },
        { event: 'bar', message: 'Use Bar instead', suggest: 'Bar' }
      ],
      errors: [
        {
          message: 'Using `foo` event is not allowed.',
          line: 6
        },
        {
          message: 'Use Bar instead',
          line: 7,
          suggestions: [
            {
              desc: 'Instead, change to `Bar`.',
              output: `
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit('foo')
            this.$emit('Bar', 123)
          }
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
      <script>
      export default {
        methods: {
          handleClick() {
            this.$emit('regexp1')
            this.$emit('regexp2')
            this.$emit('ignore-regexp')
          }
        }
      }
      </script>
      `,
      options: ['/^regexp/'],
      errors: [
        {
          message: 'Using `regexp1` event is not allowed.',
          line: 6
        },
        {
          message: 'Using `regexp2` event is not allowed.',
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="$emit('bad')"></button>
      </template>
      `,
      options: [{ event: 'bad', suggest: "foo'" }],
      errors: [
        {
          message: 'Using `bad` event is not allowed.',
          line: 3,
          suggestions: [
            {
              desc: "Instead, change to `foo'`.",
              output: `
      <template>
        <button @click="$emit('foo\\'')"></button>
      </template>
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
        setup(props, {emit}) {
          emit('foo')
          emit('bar')
        }
      }
      </script>
      `,
      options: ['foo'],
      errors: [
        {
          message: 'Using `foo` event is not allowed.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props, ctx) {
          ctx.emit('foo')
          ctx.emit('bar')
        }
      }
      </script>
      `,
      options: ['foo'],
      errors: [
        {
          message: 'Using `foo` event is not allowed.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props, ctx) {
          ctx.emit(\`foo\`)
        }
      }
      </script>
      `,
      options: ['foo'],
      errors: [
        {
          message: 'Using `foo` event is not allowed.',
          line: 5
        }
      ]
    }
  ]
})
