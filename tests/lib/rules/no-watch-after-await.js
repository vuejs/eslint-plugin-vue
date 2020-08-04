/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-watch-after-await')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
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
          watch(foo, () => { /* ... */ }) // ok

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
          watch(foo, () => { /* ... */ })
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
          watch(foo, () => { /* ... */ })
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
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import {watch, watchEffect} from 'vue'
      export default {
        async setup() {
          await doSomething()
          const a = watchEffect(() => { /* ... */ })
          const b = watch(foo, () => { /* ... */ })
          c = watch()
          d(watch())
          e = {
            foo: watch()
          }
          f = [watch()]
        }
      }
      </script>
      `
    },
    {
      code: `
      Vue.component('test', {
        el: foo()
      })`
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import {watch, watchEffect} from 'vue'
      export default {
        async setup() {
          await doSomething()
          const a = watchEffect?.(() => { /* ... */ })
          const b = watch?.(foo, () => { /* ... */ })
          c = watch?.()
          d(watch?.())
          e = {
            foo: watch?.()
          }
          f = [watch?.()]
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

          watch(foo, () => { /* ... */ }) // error
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
          endColumn: 42
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
          watch(foo, () => { /* ... */ })
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

          watch(foo, () => { /* ... */ })

          await doSomething()

          watch(foo, () => { /* ... */ })
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
