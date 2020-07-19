/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-lifecycle-after-await')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

tester.run('no-lifecycle-after-await', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      import {onMounted} from 'vue'
      export default {
        async setup() {
          onMounted(() => { /* ... */ }) // ok

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
        async setup() {
          onMounted(() => { /* ... */ })
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import {onBeforeMount, onBeforeUnmount, onBeforeUpdate, onErrorCaptured, onMounted, onRenderTracked, onRenderTriggered, onUnmounted, onUpdated, onActivated, onDeactivated} from 'vue'
      export default {
        async setup() {
          onBeforeMount(() => { /* ... */ })
          onBeforeUnmount(() => { /* ... */ })
          onBeforeUpdate(() => { /* ... */ })
          onErrorCaptured(() => { /* ... */ })
          onMounted(() => { /* ... */ })
          onRenderTracked(() => { /* ... */ })
          onRenderTriggered(() => { /* ... */ })
          onUnmounted(() => { /* ... */ })
          onUpdated(() => { /* ... */ })
          onActivated(() => { /* ... */ })
          onDeactivated(() => { /* ... */ })

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
    // has target
    {
      filename: 'test.vue',
      code: `
      <script>
      import {onBeforeMount, onBeforeUnmount, onBeforeUpdate, onErrorCaptured, onMounted, onRenderTracked, onRenderTriggered, onUnmounted, onUpdated, onActivated, onDeactivated} from 'vue'
      export default {
        async setup() {
          await doSomething()

          onBeforeMount(() => { /* ... */ }, instance)
          onBeforeUnmount(() => { /* ... */ }, instance)
          onBeforeUpdate(() => { /* ... */ }, instance)
          onErrorCaptured(() => { /* ... */ }, instance)
          onMounted(() => { /* ... */ }, instance)
          onRenderTracked(() => { /* ... */ }, instance)
          onRenderTriggered(() => { /* ... */ }, instance)
          onUnmounted(() => { /* ... */ }, instance)
          onUpdated(() => { /* ... */ }, instance)
          onActivated(() => { /* ... */ }, instance)
          onDeactivated(() => { /* ... */ }, instance)
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
      import {onMounted} from 'vue'
      export default {
        async setup() {
          await doSomething()

          onMounted(() => { /* ... */ }) // error
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'The lifecycle hooks after `await` expression are forbidden.',
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import {onBeforeMount, onBeforeUnmount, onBeforeUpdate, onErrorCaptured, onMounted, onRenderTracked, onRenderTriggered, onUnmounted, onUpdated, onActivated, onDeactivated} from 'vue'
      export default {
        async setup() {
          await doSomething()

          onBeforeMount(() => { /* ... */ })
          onBeforeUnmount(() => { /* ... */ })
          onBeforeUpdate(() => { /* ... */ })
          onErrorCaptured(() => { /* ... */ })
          onMounted(() => { /* ... */ })
          onRenderTracked(() => { /* ... */ })
          onRenderTriggered(() => { /* ... */ })
          onUnmounted(() => { /* ... */ })
          onUpdated(() => { /* ... */ })
          onActivated(() => { /* ... */ })
          onDeactivated(() => { /* ... */ })
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
        },
        {
          messageId: 'forbidden',
          line: 10
        },
        {
          messageId: 'forbidden',
          line: 11
        },
        {
          messageId: 'forbidden',
          line: 12
        },
        {
          messageId: 'forbidden',
          line: 13
        },
        {
          messageId: 'forbidden',
          line: 14
        },
        {
          messageId: 'forbidden',
          line: 15
        },
        {
          messageId: 'forbidden',
          line: 16
        },
        {
          messageId: 'forbidden',
          line: 17
        },
        {
          messageId: 'forbidden',
          line: 18
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import {onMounted} from 'vue'
      export default {
        async setup() {
          await doSomething()

          onMounted?.(() => { /* ... */ }) // error
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'forbidden'
        }
      ]
    }
  ]
})
