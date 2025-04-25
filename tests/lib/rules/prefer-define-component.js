/**
 * @author Kamogelo Moalusi <github.com/thesheppard>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/prefer-define-component')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('prefer-define-component', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default defineComponent({
        name: 'Test',
      })
      </script> 
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { defineComponent } from 'vue'
      export default defineComponent({
        name: 'Test',
        inheritAttrs: false
      })
      </script>
      <script setup>
      import { ref } from 'vue'
      const count = ref(0)
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import { defineComponent } from 'vue'
      export default defineComponent({
        name: 'Test',
        inheritAttrs: false,
        props: {
          message: {
            type: String,
            required: true
          }
        }
      })
      </script>
      <script setup lang="ts">
      import { ref, computed } from 'vue'
      const count = ref<number>(0)
      const doubled = computed<number>(() => count.value * 2)
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { defineComponent as createComponent } from 'vue'
      export default createComponent({
        name: 'Test',
      })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default defineComponent({
        name: 'GloballyAvailable',
        setup(props) {
          return {
            message: 'Hello World'
          }
        }
      })
      </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default {
        name: 'Test',
      }
      </script>
      `,
      errors: [
        {
          message: 'Use `defineComponent` to define a component.',
          line: 3,
          column: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        name: 'Test',
      }
      </script>
      `,
      errors: [
        {
          message: 'Use `defineComponent` to define a component.',
          line: 3,
          column: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default Vue.extend({
        name: 'Test',
      })
      </script>
      `,
      errors: [
        {
          message: 'Use `defineComponent` to define a component.',
          line: 3,
          column: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        name: 'Test',
        inheritAttrs: false
      }
      </script>
      <script setup>
      import { ref } from 'vue'
      const count = ref(0)
      </script>
      `,
      errors: [
        {
          message: 'Use `defineComponent` to define a component.',
          line: 3,
          column: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      const obj = { foo: 'bar' }
      export const helpers = { 
        method() { return 'helper' } 
      }
      export default {
        name: 'Test',
      }
      </script>
      `,
      errors: [
        {
          message: 'Use `defineComponent` to define a component.',
          line: 7,
          column: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default Vue.extend({
        name: 'Test',
        data() {
          return { count: 0 }
        }
      })
      </script>
      <script setup>
      import { computed } from 'vue'
      </script>
      `,
      errors: [
        {
          message: 'Use `defineComponent` to define a component.',
          line: 3,
          column: 7
        }
      ]
    }
  ]
})
