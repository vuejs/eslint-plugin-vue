/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-lifecycle-after-await')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
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
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {onMounted} from 'vue'
      onMounted(() => { /* ... */ })
      await doSomething()
      </script>
      `,
      languageOptions: { ecmaVersion: 2022 }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      await doSomething()
      </script>
      <script>
      import {onMounted} from 'vue'
      onMounted(() => { /* ... */ }) // not error
      </script>
      `,
      languageOptions: { ecmaVersion: 2022 }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      </script>
      <script>
      import {onMounted} from 'vue'
      await doSomething()
      onMounted(() => { /* ... */ }) // not error
      </script>
      `,
      languageOptions: { ecmaVersion: 2022 }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {onMounted} from 'vue'
      await doSomething()

      onMounted(() => { /* ... */ }) // not error
      </script>
      `,
      languageOptions: { ecmaVersion: 2022 }
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
          message: 'Lifecycle hooks are forbidden after an `await` expression.',
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
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 45
        },
        {
          messageId: 'forbidden',
          line: 9,
          column: 11,
          endLine: 9,
          endColumn: 47
        },
        {
          messageId: 'forbidden',
          line: 10,
          column: 11,
          endLine: 10,
          endColumn: 46
        },
        {
          messageId: 'forbidden',
          line: 11,
          column: 11,
          endLine: 11,
          endColumn: 47
        },
        {
          messageId: 'forbidden',
          line: 12,
          column: 11,
          endLine: 12,
          endColumn: 41
        },
        {
          messageId: 'forbidden',
          line: 13,
          column: 11,
          endLine: 13,
          endColumn: 47
        },
        {
          messageId: 'forbidden',
          line: 14,
          column: 11,
          endLine: 14,
          endColumn: 49
        },
        {
          messageId: 'forbidden',
          line: 15,
          column: 11,
          endLine: 15,
          endColumn: 43
        },
        {
          messageId: 'forbidden',
          line: 16,
          column: 11,
          endLine: 16,
          endColumn: 41
        },
        {
          messageId: 'forbidden',
          line: 17,
          column: 11,
          endLine: 17,
          endColumn: 43
        },
        {
          messageId: 'forbidden',
          line: 18,
          column: 11,
          endLine: 18,
          endColumn: 45
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
          messageId: 'forbidden',
          line: 8,
          column: 11,
          endLine: 8,
          endColumn: 43
        }
      ]
    }
  ]
})
