/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/component-api-style')

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
      options: [['options']]
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
      options: [['options']]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { ref } from 'vue'
      const msg = ref('Hello World!')
      </script>
      `,
      options: [['script-setup']]
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
      options: [['script-setup']]
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
      options: [['script-setup']]
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
      options: [['composition']]
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
        },
        render(h) {
          return h('foo', this.msg)
        }
      }
      </script>
      `,
      options: [['composition-vue2']]
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1720
      filename: 'test.vue',
      code: `
      <template>
        <div id="app">
          <header>
            <Navigation />
          </header>
          <main class="container-fluid mb-4" role="main">
            <RouterView />
          </main>
        </div>
      </template>

      <script lang="ts">
      import { defineComponent } from '@vue/composition-api'

      import Navigation from '@/components/app/nav/Navigation.vue'

      export default defineComponent({
        name: 'App',
        components: {
          Navigation,
        },
      })
      </script>`,
      options: [['composition']]
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
            'Options API is not allowed in your project. `data` option is part of the Options API. Use `<script setup>` or Composition API instead.',
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
            'Composition API is not allowed in your project. `setup` function is part of the Composition API. Use Options API instead.',
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
            'Options API is not allowed in your project. `data` option is part of the Options API. Use Composition API instead.',
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
            'Composition API is not allowed in your project. `setup` function is part of the Composition API. Use Options API instead.',
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
      options: [['script-setup']],
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
      options: [['composition']],
      errors: [
        {
          message:
            'Options API is not allowed in your project. `data` option is part of the Options API. Use Composition API instead.',
          line: 4,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
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
      options: [['composition']],
      errors: [
        {
          message:
            'Options API is not allowed in your project. `mixins` option is part of the Options API. Use Composition API instead.',
          line: 4,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `extends` option is part of the Options API. Use Composition API instead.',
          line: 5,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `data` option is part of the Options API. Use Composition API instead.',
          line: 7,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `computed` option is part of the Options API. Use Composition API instead.',
          line: 8,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `methods` option is part of the Options API. Use Composition API instead.',
          line: 9,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `watch` option is part of the Options API. Use Composition API instead.',
          line: 10,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `provide` option is part of the Options API. Use Composition API instead.',
          line: 11,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `inject` option is part of the Options API. Use Composition API instead.',
          line: 12,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeCreate` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 14,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `created` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 15,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeMount` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 16,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `mounted` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 17,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeUpdate` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 18,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `updated` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 19,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `activated` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 20,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `deactivated` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 21,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeDestroy` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 22,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeUnmount` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 23,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `destroyed` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 24,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `unmounted` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 25,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `render` function is part of the Options API. Use Composition API instead.',
          line: 26,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `renderTracked` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 27,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `renderTriggered` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 28,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `errorCaptured` lifecycle hook is part of the Options API. Use Composition API instead.',
          line: 29,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `expose` option is part of the Options API. Use Composition API instead.',
          line: 31,
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
      options: [['composition-vue2']],
      errors: [
        {
          message:
            '`<script setup>` is not allowed in your project. Use Composition API (Vue 2) instead.',
          line: 2,
          column: 7
        }
      ]
    },
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
      options: [['composition-vue2']],
      errors: [
        {
          message:
            'Options API is not allowed in your project. `data` option is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 4,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
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
        render() {}, // allowed
        renderTracked() {}, // allowed
        renderTriggered() {}, // allowed
        errorCaptured() {},
        // public API
        expose: [],
      }
      </script>
      `,
      options: [['composition-vue2']],
      errors: [
        {
          message:
            'Options API is not allowed in your project. `mixins` option is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 4,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `extends` option is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 5,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `data` option is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 7,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `computed` option is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 8,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `methods` option is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 9,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `watch` option is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 10,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `provide` option is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 11,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `inject` option is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 12,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeCreate` lifecycle hook is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 14,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `created` lifecycle hook is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 15,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeMount` lifecycle hook is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 16,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `mounted` lifecycle hook is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 17,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeUpdate` lifecycle hook is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 18,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `updated` lifecycle hook is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 19,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `activated` lifecycle hook is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 20,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `deactivated` lifecycle hook is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 21,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeDestroy` lifecycle hook is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 22,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `beforeUnmount` lifecycle hook is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 23,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `destroyed` lifecycle hook is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 24,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `unmounted` lifecycle hook is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 25,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `errorCaptured` lifecycle hook is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 29,
          column: 9
        },
        {
          message:
            'Options API is not allowed in your project. `expose` option is part of the Options API. Use Composition API (Vue 2) instead.',
          line: 31,
          column: 9
        }
      ]
    },
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
      options: [['script-setup', 'composition', 'composition-vue2']],
      errors: [
        {
          message:
            'Options API is not allowed in your project. `data` option is part of the Options API. Use `<script setup>`, Composition API or Composition API (Vue 2) instead.',
          line: 4,
          column: 9
        }
      ]
    }
  ]
})
