/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/component-api-style')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' }
})

tester.run('component-api-style', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { ref } from 'vue'
      const msg = ref('Hello World!')
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { ref } from 'vue'
      export default {
        setup() {
          const msg = ref('Hello World!')
          // ...
          return {
            msg,
            // ...
          }
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      options: [['options']],
      code: `
      <script>
      export default {
        data () {
          return {
            msg: 'Hello World!',
            // ...
          }
        },
        // ...
      }
      </script>
      `
    },
    {
      filename: 'test.js',
      code: `
      import { ref, defineComponent } from 'vue'
      defineComponent({
        setup() {
          const msg = ref('Hello World!')
          // ...
          return {
            msg,
            // ...
          }
        }
      })
      `
    },
    {
      filename: 'test.js',
      options: [['options']],
      code: `
      import { defineComponent } from 'vue'
      defineComponent({
        data () {
          return {
            msg: 'Hello World!',
            // ...
          }
        },
        // ...
      })
      `
    },
    {
      filename: 'test.vue',
      options: [['script-setup']],
      code: `
      <script setup>
      import { ref } from 'vue'
      const msg = ref('Hello World!')
      </script>
      `
    },
    {
      filename: 'test.js',
      options: [['script-setup']],
      code: `
      import { ref, defineComponent } from 'vue'
      defineComponent({
        setup() {
          const msg = ref('Hello World!')
          // ...
          return {
            msg,
            // ...
          }
        }
      })
      `
    },
    {
      filename: 'test.js',
      options: [['script-setup']],
      code: `
      import { defineComponent } from 'vue'
      defineComponent({
        data () {
          return {
            msg: 'Hello World!',
            // ...
          }
        },
        // ...
      })
      `
    },
    {
      filename: 'test.vue',
      options: [['composition']],
      code: `
      <script>
      import { ref } from 'vue'
      export default {
        setup() {
          const msg = ref('Hello World!')
          // ...
          return {
            msg,
            // ...
          }
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
      export default {
        data () {
          return {
            msg: 'Hello World!',
            // ...
          }
        },
        // ...
      }
      </script>
      `,
      errors: [
        {
          message:
            'Options API is not allowed in your project. `data` option is the API of Options API. Use `<script setup>` or Composition API instead.',
          line: 4,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { ref } from 'vue'
      const msg = ref('Hello World!')
      </script>
      `,
      options: [['options']],
      errors: [
        {
          message:
            '`<script setup>` is not allowed in your project. Use Options API instead.',
          line: 2,
          column: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { ref } from 'vue'
      export default {
        setup() {
          const msg = ref('Hello World!')
          // ...
          return {
            msg,
            // ...
          }
        }
      }
      </script>
      `,
      options: [['options']],
      errors: [
        {
          message:
            'Composition API is not allowed in your project. `setup` function is the API of Composition API. Use Options API instead.',
          line: 5,
          column: 9
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
      import { defineComponent } from 'vue'
      defineComponent({
        data () {
          return {
            msg: 'Hello World!',
            // ...
          }
        },
        // ...
      })
      `,
      errors: [
        {
          message:
            'Options API is not allowed in your project. `data` option is the API of Options API. Use Composition API instead.',
          line: 4,
          column: 9
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
      import { ref, defineComponent } from 'vue'
      defineComponent({
        setup() {
          const msg = ref('Hello World!')
          // ...
          return {
            msg,
            // ...
          }
        }
      })
      `,
      options: [['options']],
      errors: [
        {
          message:
            'Composition API is not allowed in your project. `setup` function is the API of Composition API. Use Options API instead.',
          line: 4,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { ref } from 'vue'
      export default {
        setup() {
          const msg = ref('Hello World!')
          // ...
          return {
            msg,
            // ...
          }
        }
      }
      </script>
      `,
      options: [['script-setup']],
      errors: [
        {
          message:
            'Composition API is not allowed in your project. Use `<script setup>` instead.',
          line: 5,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      options: [['script-setup']],
      code: `
      <script>
      export default {
        data () {
          return {
            msg: 'Hello World!',
            // ...
          }
        },
        // ...
      }
      </script>
      `,
      errors: [
        {
          message:
            'Options API is not allowed in your project. Use `<script setup>` instead.',
          line: 4,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      </script>
      `,
      options: [['composition']],
      errors: [
        {
          message:
            '`<script setup>` is not allowed in your project. Use Composition API instead.',
          line: 2,
          column: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      options: [['composition']],
      code: `
      <script>
      export default {
        data () {
          return {
            msg: 'Hello World!',
            // ...
          }
        },
        // ...
      }
      </script>
      `,
      errors: [
        {
          message:
            'Options API is not allowed in your project. `data` option is the API of Options API. Use Composition API instead.',
          line: 4,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      options: [['composition']],
      code: `
      <script>
      export default {
        mixins: [],
        extends: {},
        // state
        data () { return {} },
        computed: {},
        methods: {},
        watch: {},
        provide: {},
        inject: {},
        // lifecycle
        beforeCreate() {},
        created() {},
        beforeMount() {},
        mounted() {},
        beforeUpdate() {},
        updated() {},
        activated() {},
        deactivated() {},
        beforeDestroy() {},
        beforeUnmount() {},
        destroyed() {},
        unmounted() {},
        render() {},
        renderTracked() {},
        renderTriggered() {},
        errorCaptured() {},
        // public API
        expose: [],
      }
      </script>
      `,
      errors: [
        {
          message:
            'Options API is not allowed in your project. `mixins` option is the API of Options API. Use Composition API instead.',
          line: 4,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `extends` option is the API of Options API. Use Composition API instead.',
          line: 5,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `data` option is the API of Options API. Use Composition API instead.',
          line: 7,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `computed` option is the API of Options API. Use Composition API instead.',
          line: 8,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `methods` option is the API of Options API. Use Composition API instead.',
          line: 9,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `watch` option is the API of Options API. Use Composition API instead.',
          line: 10,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `provide` option is the API of Options API. Use Composition API instead.',
          line: 11,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `inject` option is the API of Options API. Use Composition API instead.',
          line: 12,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeCreate` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 14,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `created` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 15,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeMount` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 16,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `mounted` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 17,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeUpdate` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 18,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `updated` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 19,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `activated` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 20,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `deactivated` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 21,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeDestroy` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 22,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeUnmount` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 23,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `destroyed` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 24,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `unmounted` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 25,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `render` function is the API of Options API. Use Composition API instead.',
          line: 26,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `renderTracked` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 27,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `renderTriggered` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 28,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `errorCaptured` lifecycle hook is the API of Options API. Use Composition API instead.',
          line: 29,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `expose` option is the API of Options API. Use Composition API instead.',
          line: 31,
          column: 9
        }
      ]
    }
  ]
})
