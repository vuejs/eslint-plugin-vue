/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-watch-after-await')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2019, sourceType: 'module' }
})

tester.run('no-watch-after-await', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      import {watch} from 'vue'
      export default {
        async setup() {
          watch(() => { /* ... */ }) // ok

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
      import {watch} from 'vue'
      export default {
        async setup() {
          watch(() => { /* ... */ })
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import {watch, watchEffect} from 'vue'
      export default {
        async setup() {
          watchEffect(() => { /* ... */ })
          watch(() => { /* ... */ })
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
      import {onMounted} from 'vue'
      export default {
        async _setup() {
          await doSomething()

          onMounted(() => { /* ... */ }) // error
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
      import {watch} from 'vue'
      export default {
        async setup() {
          await doSomething()

          watch(() => { /* ... */ }) // error
        }
      }
      </script>
      `,
      errors: [
        {
          message: 'The `watch` after `await` expression are forbidden.',
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import {watch, watchEffect} from 'vue'
      export default {
        async setup() {
          await doSomething()

          watchEffect(() => { /* ... */ })
          watch(() => { /* ... */ })
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'forbidden',
          line: 8
        },
        {
          messageId: 'forbidden',
          line: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import {watch} from 'vue'
      export default {
        async setup() {
          await doSomething()

          watch(() => { /* ... */ })

          await doSomething()

          watch(() => { /* ... */ })
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'forbidden',
          line: 8
        },
        {
          messageId: 'forbidden',
          line: 12
        }
      ]
    }
  ]
})
