/**
 * @author Marton Csordas
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/multi-word-component-names')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('multi-word-component-names', rule, {
  valid: [
    {
      filename: 'App.vue',
      code: ''
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        export default { name: 'App' }
        </script>`
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        Vue.component('App', {})
        </script>`
    },
    {
      filename: 'app.vue',
      code: ''
    },
    {
      filename: 'path/to/app.vue',
      code: '<script></script>'
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        export default { name: 'app' }
        </script>`
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        Vue.component('app', {})
        </script>`
    },
    {
      filename: 'transition.vue',
      code: ''
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        export default { name: 'transition' }
        </script>`
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        Vue.component('transition', {})
        </script>`
    },
    {
      filename: 'component.vue',
      code: ''
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        export default { name: 'component' }
        </script>`
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        Vue.component('component', {})
        </script>`
    },
    {
      filename: 'multi-word.vue',
      code: ''
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        export default { name: 'multi-word' }
        </script>`
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        Vue.component('multi-word', {})
        </script>`
    },
    {
      filename: 'multiWord.vue',
      code: ''
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        export default { name: 'multiWord' }
        </script>`
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        Vue.component('multiWord', {})
        </script>`
    },
    {
      filename: 'MultiWord.vue',
      code: ''
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        export default { name: 'MultiWord' }
        </script>`
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        Vue.component('MultiWord', {})
        </script>`
    },
    {
      filename: 'TheTest.vue',
      code: `
      <script>
      export default { name: 'TheTest' }
      </script>
      `
    },
    {
      filename: 'TheTest.vue',
      code: `
      <script>
      Vue.component('TheTest', {})
      </script>
      `
    },
    {
      filename: 'test.vue',
      options: [{ ignores: ['Todo'] }],
      code: `
      <script>
      export default {
        name: 'Todo'
      }
      </script>
      `
    },
    {
      filename: 'test.js',
      code: `
      new Vue({})
      `
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1670
      filename: 'main.ts',
      code: `
      import Vue from 'vue'
      import VueCompositionAPI, { h } from '@vue/composition-api'
      import i18n from '@/i18n'
      import router from '@/router'
      import store from '@/store'
      // ...

      Vue.use(VueCompositionAPI)

      new Vue({
          i18n,
          router,
          store,
          setup() {
              return () => h(App)
          },
      }).$mount('#app')
      `
    },
    {
      filename: 'MultiWord.vue',
      code: `
      <template>
        <AppButton />
      </template>

      <script setup lang="ts">
      import AppButton from "@/components/AppButton.vue";
      </script>`
    },
    {
      filename: 'Single.vue',
      code: `
      <script setup>
      defineOptions({name: 'MultiWord'})
      </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: '',
      errors: [
        {
          message: 'Component name "test" should always be multi-word.',
          line: 1
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default { name: 'test' }
        </script>`,
      errors: [
        {
          message: 'Component name "test" should always be multi-word.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        Vue.component('test', {})
        </script>`,
      errors: [
        {
          message: 'Component name "test" should always be multi-word.',
          line: 3
        }
      ]
    },
    {
      filename: 'valid-name.vue',
      code: `
        <script>
        export default { name: 'invalid' }
        </script>`,
      errors: [
        {
          message: 'Component name "invalid" should always be multi-word.',
          line: 3
        }
      ]
    },
    {
      filename: 'valid-name.vue',
      code: `
        <script>
        Vue.component('invalid', {})
        </script>`,
      errors: [
        {
          message: 'Component name "invalid" should always be multi-word.',
          line: 3
        }
      ]
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        export default {}
        </script>`,
      errors: [
        {
          message: 'Component name "invalid" should always be multi-word.',
          line: 1
        }
      ]
    },
    {
      filename: 'invalid.vue',
      code: `
        <script>
        Vue.component('', {})
        </script>`,
      errors: [
        {
          message: 'Component name "" should always be multi-word.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      options: [{ ignores: ['Todo'] }],
      code: `
      <script>
      export default {
        name: 'Item'
      }
      </script>
      `,
      errors: [
        {
          message: 'Component name "Item" should always be multi-word.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      import Item from "@/components/Item.vue";
      </script>`,
      errors: [
        {
          message: 'Component name "test" should always be multi-word.',
          line: 1
        }
      ]
    },
    {
      filename: 'MultiWord.vue',
      code: `
      <script setup>
      defineOptions({name: 'Single'})
      </script>
      `,
      errors: [
        {
          message: 'Component name "Single" should always be multi-word.',
          line: 3
        }
      ]
    }
  ]
})
