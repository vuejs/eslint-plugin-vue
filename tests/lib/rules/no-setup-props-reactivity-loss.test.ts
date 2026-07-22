/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-setup-props-reactivity-loss'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-setup-props-reactivity-loss', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props) {
          watch(() => {
            console.log(props.count) // ok
          })

          return () => {
            return h('div', props.count) // ok
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
        setup(props) {
          watch(() => {
            const { count } = props // ok
            console.log(count)
          })

          return () => {
            const { count } = props // ok
            return h('div', count)
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
        _setup({count}) {
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
        setup(...args) {
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
        setup(props) {
          watch(() => {
            ({ count } = props)
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
      var noVue = {
        setup(props) {
          const { count } = props
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
        setup(props) {
          watch(
            () => props.count,
            () => {
              const test = props.count ? true : false
              console.log(test)
            }
          )

          return () => {
            return h('div', props.count ? true : false)
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
        setup(props) {
          const {x} = noProps
          ({y} = noProps)
          const z = noProps.z
          const foo = \`\${noProp.foo}\`
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
        setup(props) {
          ({props} = x)
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
        watch: {
          setup({val}) { }
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
        setup(props) {
          const props2 = props
        }
      }
      </script>
      `
    },
    `
      Vue.component('test', {
        el: a = b
      })
    `,
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps({count:Number})
      watch(() => {
        const {count} = props
      })
      watch(() => {
        const count = props.count
      })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps({count:Number})
      watch(() => {
        ({ count } = props)
      })
      watch(() => {
        count = props.count
      })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup: (props) => {
          const count = computed(() => props.count)
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps({ count: Number })
      const count = computed(() => props.count)
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const {count} = defineProps({count:Number})
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const { foo = 1, bar = 'ok' } = defineProps({ foo: Number, bar: String })
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
        setup({ count }) { // error
          watch(() => {
            console.log(count) // not going to detect changes
          })

          return () => {
            return h('div', count) // not going to update
          }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'destructuring',
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props) {
          const { count } = props // error
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup: (props) => {
          const { count } = props
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(props) {
          ({ count } = props)
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p) {
          const { count } = p
        }
      }

      Vue.component('component', {
        setup(p) {
          const { count } = p
        }
      })
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 26
        },
        {
          messageId: 'getProperty',
          line: 11,
          column: 17,
          endLine: 11,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p) {
          const { count } = p
        },
        _setup(p) {
          const { count } = p
        },
      }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p) {
          const { x } = p
          const { y } = p
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 22
        },
        {
          messageId: 'getProperty',
          line: 6,
          column: 17,
          endLine: 6,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p) {
          const foo = p.bar
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 5,
          column: 23,
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
        setup(p) {
          const x = p.foo
          const y = p?.bar
          const z = (p?.baz).qux

          const xc = p?.foo?.()
          const yc = (p?.bar)?.()
          const zc = (p?.baz.qux)?.()
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 5,
          column: 21,
          endLine: 5,
          endColumn: 22
        },
        {
          messageId: 'getProperty',
          line: 6,
          column: 21,
          endLine: 6,
          endColumn: 22
        },
        {
          messageId: 'getProperty',
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 23
        },
        {
          messageId: 'getProperty',
          line: 9,
          column: 22,
          endLine: 9,
          endColumn: 32
        },
        {
          messageId: 'getProperty',
          line: 10,
          column: 22,
          endLine: 10,
          endColumn: 34
        },
        {
          messageId: 'getProperty',
          line: 11,
          column: 22,
          endLine: 11,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p) {
          let foo
          foo = p.bar
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 6,
          column: 17,
          endLine: 6,
          endColumn: 18
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p) {
          const {foo} = p.bar
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p) {
          foo.bar = p.bar
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 5,
          column: 21,
          endLine: 5,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const {count} = defineProps({count:Number})
      const foo = count
      </script>
      `,
      errors: [
        {
          message:
            'Getting a value from the `props` in root scope of `<script setup>` will cause the value to lose reactivity.',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps({count:Number})
      const {count} = props
      ;({count} = props)
      </script>
      `,
      errors: [
        {
          message:
            'Getting a value from the `props` in root scope of `<script setup>` will cause the value to lose reactivity.',
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 20
        },
        {
          message:
            'Getting a value from the `props` in root scope of `<script setup>` will cause the value to lose reactivity.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps({count:Number})
      const count = props.count
      count = props.count
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 26
        },
        {
          messageId: 'getProperty',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup: (props) => {
          const count = ref(props.count)
          count = fn(props.count)
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 5,
          column: 25,
          endLine: 5,
          endColumn: 41
        },
        {
          messageId: 'getProperty',
          line: 6,
          column: 19,
          endLine: 6,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps({ count: Number })
      const count = ref(props.count)
      count = fn(props.count)
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 4,
          column: 21,
          endLine: 4,
          endColumn: 37
        },
        {
          messageId: 'getProperty',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps({ count: Number })
      const newProps = ref({ count: props.count })
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 4,
          column: 24,
          endLine: 4,
          endColumn: 51
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps({ count: Number })
      const counts = [props.count]
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 4,
          column: 22,
          endLine: 4,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps({ count: Number })
      const counter = { count: props.count }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 4,
          column: 23,
          endLine: 4,
          endColumn: 45
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps({ count: Number })
      const counters = [{ count: [props.count] }]
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 4,
          column: 24,
          endLine: 4,
          endColumn: 50
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps({ count: Number })
      const buildCounter = (count) => ({ count })

      buildCounter(props.count)
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 6,
          column: 7,
          endLine: 6,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps({ count: Number })
      const buildCounter = props.count ? 1 : undefined
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 4,
          column: 28,
          endLine: 4,
          endColumn: 39
        }
      ]
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/2470
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p) {
          const foo = \`\${p.x}\`
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 5,
          column: 26,
          endLine: 5,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p) {
          const foo = \`bar\${p.x}bar\${p.y}\`
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'getProperty',
          line: 5,
          column: 29,
          endLine: 5,
          endColumn: 32
        }
      ]
    }
  ]
})
