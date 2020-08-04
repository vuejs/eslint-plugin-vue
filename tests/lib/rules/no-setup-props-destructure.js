/**
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-setup-props-destructure')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

tester.run('no-setup-props-destructure', rule, {
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
          const {x} = noProps
          ({y} = noProps)
          const z = noProps.z
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
    {
      code: `
      Vue.component('test', {
        el: a = b
      })`
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
          line: 5
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
          line: 5
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
          line: 5
        },
        {
          messageId: 'getProperty',
          line: 11
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
          line: 5
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
          line: 5
        },
        {
          messageId: 'getProperty',
          line: 6
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
          line: 5
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
          line: 5
        },
        {
          messageId: 'getProperty',
          line: 6
        },
        {
          messageId: 'getProperty',
          line: 7
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
          line: 6
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
          line: 5
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
          line: 5
        }
      ]
    }
  ]
})
