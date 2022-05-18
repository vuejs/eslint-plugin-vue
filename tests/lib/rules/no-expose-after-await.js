/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-expose-after-await')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-expose-after-await', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        async setup(_, {expose}) {
          expose({ /* ... */ }) // ok
          await doSomething()
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
        async setup(_, ctx) {
          ctx.expose({ /* ... */ }) // ok
          await doSomething()
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
        async setup(_, {expose}) {
          expose({ /* ... */ })
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
        async setup(_, ctx) {
          ctx.expose({ /* ... */ })
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
        async _setup(_, {expose}) {
          expose({ /* ... */ })
          await doSomething()
          expose({ /* ... */ })
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
        async _setup(_, ctx) {
          ctx.expose({ /* ... */ })
          await doSomething()
          ctx.expose({ /* ... */ })
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineExpose({ /* ... */ })
      await doSomething()
      </script>
      `,
      parserOptions: { ecmaVersion: 2022 }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      await doSomething()
      {
        defineExpose({ /* ... */ })
      }
      function defineExpose() {}
      </script>
      `,
      parserOptions: { ecmaVersion: 2022 }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { onMounted } from 'vue';
      await doSomething()
      onMounted(() => {})
      </script>
      `,
      parserOptions: { ecmaVersion: 2022 }
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        async setup(_, {expose}) {
          await doSomething()
          expose({ /* ... */ })
        }
      }
      </script>
      `,
      errors: [
        {
          message: '`expose` is forbidden after an `await` expression.',
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
        async setup(_, ctx) {
          await doSomething()
          ctx.expose({ /* ... */ })
        }
      }
      </script>
      `,
      errors: [
        {
          message: '`expose` is forbidden after an `await` expression.',
          line: 6,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      await doSomething()
      defineExpose({ /* ... */ })
      </script>
      `,
      parserOptions: { ecmaVersion: 2022 },
      errors: [
        {
          message: '`defineExpose` is forbidden after an `await` expression.',
          line: 4,
          column: 7
        }
      ]
    }
  ]
})
