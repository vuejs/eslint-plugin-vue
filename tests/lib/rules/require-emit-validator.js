/**
 * @fileoverview Emit definitions should be detailed
 * @author Pig Fang
 */
'use strict'

const rule = require('../../../lib/rules/require-emit-validator')
const {
  getTypeScriptFixtureTestOptions
} = require('../../test-utils/typescript')

const RuleTester = require('../../eslint-compat').RuleTester

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
      languageOptions: { ecmaVersion: 2018, sourceType: 'module' }
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
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
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
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
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
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
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
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: externalEmits
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: []
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: {}
        }
      `,
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
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
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
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
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
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
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
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
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<(e: 'foo')=>void>()
      </script>
      `,
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module',
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      code: `
      <script setup lang="ts">
      import {Emits1 as Emits} from './test01'
      const emit = defineEmits<Emits>()
      </script>`,
      ...getTypeScriptFixtureTestOptions()
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
      ],
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          emits: ['foo', bar, \`baz\`, foo()]
        })
      `,
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
      ],
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          emits: {
            foo: null
          }
        }`,
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
      ],
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
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
      ],
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
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
      errors: [
        {
          messageId: 'missing',
          data: { name: 'foo' },
          line: 4
        }
      ],
      languageOptions: { ecmaVersion: 6, sourceType: 'module' }
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
      errors: [
        {
          messageId: 'missing',
          data: { name: 'foo' },
          line: 4
        }
      ],
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits(['foo'])
      </script>
      `,
      errors: [
        {
          messageId: 'missing',
          data: { name: 'foo' },
          line: 3
        }
      ],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits({foo:null})
      </script>
      `,
      errors: [
        {
          messageId: 'skipped',
          data: { name: 'foo' },
          line: 3
        }
      ],
      languageOptions: {
        parser: require('vue-eslint-parser'),
        ecmaVersion: 6,
        sourceType: 'module'
      }
    }
  ]
})
