/**
 * @fileoverview Emit definitions should be detailed
 * @author Pig Fang
 */
'use strict'

const rule = require('../../../lib/rules/require-emit-validator')

const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester()
ruleTester.run('require-emit-validator', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          ...foo,
          emits: {
            ...test(),
            foo: (payload) => typeof payload === 'object'
          }
        }
      `,
      parserOptions: { ecmaVersion: 2018, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: {
            foo: (payload) => typeof payload === 'object'
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: {
            foo(payload) {
              return typeof payload === 'object'
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: {
            foo: () => {}
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: {
            foo() {}
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: externalEmits
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: []
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: {}
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default defineComponent({
          emits: {
            foo: (payload: string | number) => true,
          }
        })
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'test.vue',
      code: `
        export default defineComponent({
          emits: {
            foo(payload: string | number) {
              return true
            },
          },
        })
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: require.resolve('@typescript-eslint/parser')
    },
    {
      filename: 'test.vue',
      code: `
        function foo () {}
        export default {
          emits: {
            foo
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        import { isNumber } from './mod'
        export default {
          emits: {
            foo: isNumber
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<(e: 'foo')=>void>()
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module',
        parser: require.resolve('@typescript-eslint/parser')
      }
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: ['foo', bar, \`baz\`, foo()]
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          messageId: 'missing',
          data: { name: 'foo' },
          line: 3
        },
        {
          messageId: 'missing',
          data: { name: 'bar' },
          line: 3
        },
        {
          messageId: 'missing',
          data: { name: 'baz' },
          line: 3
        },
        {
          messageId: 'missing',
          data: { name: 'Unknown emit' },
          line: 3
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          emits: ['foo', bar, \`baz\`, foo()]
        })
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          messageId: 'missing',
          data: { name: 'foo' },
          line: 3
        },
        {
          messageId: 'missing',
          data: { name: 'bar' },
          line: 3
        },
        {
          messageId: 'missing',
          data: { name: 'baz' },
          line: 3
        },
        {
          messageId: 'missing',
          data: { name: 'Unknown emit' },
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: {
            foo: null
          }
        }`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          messageId: 'skipped',
          data: { name: 'foo' },
          line: 4,
          suggestions: [
            {
              messageId: 'emptyValidation',
              output: `
        export default {
          emits: {
            foo: () => true
          }
        }`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: {
            foo: null,
            bar: (payload) => {}
          }
        }`,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          messageId: 'skipped',
          data: { name: 'foo' },
          line: 4,
          suggestions: [
            {
              messageId: 'emptyValidation',
              output: `
        export default {
          emits: {
            foo: () => true,
            bar: (payload) => {}
          }
        }`
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: {
            foo: {
              type: String
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [
        {
          messageId: 'missing',
          data: { name: 'foo' },
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default defineComponent({
          emits: {
            foo: {} as ((payload: string) => boolean)
          }
        });
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      parser: require.resolve('@typescript-eslint/parser'),
      errors: [
        {
          messageId: 'missing',
          data: { name: 'foo' },
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits(['foo'])
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        {
          messageId: 'missing',
          data: { name: 'foo' },
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits({foo:null})
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
      },
      errors: [
        {
          messageId: 'skipped',
          data: { name: 'foo' },
          line: 3
        }
      ]
    }
  ]
})
