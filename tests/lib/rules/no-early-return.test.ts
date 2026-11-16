/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-early-return'
import tsParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-early-return', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup() {
          const foo = ref(0)
          if (foo.value > 0) {
            foo.value--
          }
          return { foo }
        },
        data() {
          return { bar: 1 }
        },
        async asyncData({ $http }) {
          const baz = await $http.$get('/baz')
          return { baz }
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { ref } from 'vue'
      const foo = ref(0)
      function check() {
        if (foo.value > 0) {
          return true
        }
        return false
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup() {
          const items = computed(() => {
            if (!list.value) {
              return []
            }
            return list.value.filter(Boolean)
          })
          watch(items, (value) => {
            if (!value.length) return
            console.log(value)
          })
          function onClick() {
            if (disabled) return
            emit('click')
          }
          return { items, onClick }
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
        setup() {
          return { onClick }

          function onClick() {
            if (disabled) {
              return
            }
            emit('click')
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
        setup: () => ({ foo: 1 }),
        data: () => ({ bar: 1 })
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup() {
          onMounted(() => {
            if (!el.value) return
            el.value.focus()
          })
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
        data() {
          return { foo: 1 }
        },
        computed: {
          bar() {
            if (this.foo) {
              return 1
            }
            return 2
          }
        },
        methods: {
          fn() {
            if (a) {
              return {}
            }
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
        methods: {
          fn () {
            if (a) {
              return {};
            }
          }
        },
        setup () {
          const foo = ref()
          return { foo }
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
        setup() {
          const Child = defineComponent({
            setup() {
              return () => h('div')
            }
          })
          return { Child }
        }
      }
      </script>
      `
    },
    {
      filename: 'test.js',
      code: `
      const foo = {
        setup() {
          if (a) {
            return
          }
          return {}
        },
        data() {
          if (a) {
            return {}
          }
          return {}
        }
      }
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default defineComponent({
        setup(props: { foo: string }) {
          const bar = computed((): string => {
            if (!props.foo) {
              return ''
            }
            return props.foo
          })
          return { bar }
        }
      })
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } }
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup() {
          if (something) {
            return
          }
          return { foo }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'setup' },
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 19
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default defineComponent({
        setup() {
          if (something) {
            return { other: 1 }
          }
          return { foo }
        }
      })
      </script>
      `,
      errors: [
        {
          message:
            'Only one (unconditional) return statement is allowed in setup function.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup: () => {
          if (maybe) {
            return { foo: false }
          }
          return { foo: true }
        },
        data() {
          return {
            foo: true
          }
        },
        computed: {
          foo() {
            return true
          }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'setup' },
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {
          if (something) {
            return { foo: 1 }
          }
          return { foo: 2 }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'data' },
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data: function () {
          if (something) return {}
          return { foo: 2 }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'data' },
          line: 5,
          column: 26,
          endLine: 5,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        async asyncData({ params, redirect }) {
          if (!params.id) {
            return redirect('/')
          }
          const item = await fetchItem(params.id)
          return { item }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'asyncData' },
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup() {
          try {
            return { foo: load() }
          } catch {
            return { foo: null }
          }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'setup' },
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 35
        },
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'setup' },
          line: 8,
          column: 13,
          endLine: 8,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup() {
          for (const item of items) {
            if (item.active) {
              return { item }
            }
          }
          return { item: null }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'setup' },
          line: 7,
          column: 15,
          endLine: 7,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup() {
          if (a) return
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'setup' },
          line: 5,
          column: 18,
          endLine: 5,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup() {
          const Child = defineComponent({
            setup() {
              if (a) {
                return () => null
              }
              return () => h('div')
            }
          })
          return { Child }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'setup' },
          line: 8,
          column: 17,
          endLine: 8,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
      Vue.component('foo', {
        data() {
          if (a) {
            return { foo: 1 }
          }
          return { foo: 2 }
        }
      })
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'data' },
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default defineComponent({
        setup(props: { foo: string }) {
          if (!props.foo) {
            return { bar: '' as string }
          }
          return { bar: props.foo }
        }
      })
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'setup' },
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 41
        }
      ]
    }
  ]
})
