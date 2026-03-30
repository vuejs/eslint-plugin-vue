/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-restricted-custom-event'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-restricted-custom-event', rule as RuleModule, {
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
          column: 24,
          endLine: 7,
          endColumn: 29
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
          line: 6,
          column: 24,
          endLine: 6,
          endColumn: 29
        },
        {
          message: 'Use Bar instead',
          line: 7,
          column: 24,
          endLine: 7,
          endColumn: 29,
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
          line: 6,
          column: 24,
          endLine: 6,
          endColumn: 33
        },
        {
          message: 'Using `regexp2` event is not allowed.',
          line: 7,
          column: 24,
          endLine: 7,
          endColumn: 33
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
          column: 31,
          endLine: 3,
          endColumn: 36,
          suggestions: [
            {
              desc: "Instead, change to `foo'`.",
              output: String.raw`
      <template>
        <button @click="$emit('foo\'')"></button>
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
          line: 5,
          column: 16,
          endLine: 5,
          endColumn: 21
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
          line: 5,
          column: 20,
          endLine: 5,
          endColumn: 25
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
          line: 5,
          column: 20,
          endLine: 5,
          endColumn: 25
        }
      ]
    }
  ]
})
