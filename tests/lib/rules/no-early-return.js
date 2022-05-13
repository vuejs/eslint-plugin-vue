/**
 * @author *****your name*****
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-early-return')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-early-return', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const foo = ref()
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
      <script>
      export default {
        setup () {
          const foo = ref()
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
        setup () {
          const foo = ref()
          function bar () {
            return 1
          }
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
        data () {
          return { foo: true }
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
        asyncData () {
          return { foo: true }
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
        asyncData (payload) {
          return { foo: true }
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
        data: () => ({ foo: true })
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        asyncData: () => ({ foo: true })
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
        setup () {
          const foo = ref()

          function bar () {
            return 1
          }

          for (const f of [1]) {
            if (1) {
              return 2
            }
          }

          if (foo) {
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
          line: 13
        },
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'setup' },
          line: 18
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup () {
          const foo = ref()

          if (foo) {
            return { foo }
          }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'setup' },
          line: 8
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data () {
          if (this.bar) {
            return { foo: false }
          }
          return { foo: true }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'data' },
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        asyncData () {
          if (this.bar) {
            return { foo: false }
          }
          return { foo: true }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'data' },
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data: () => {
          if (maybe) {
            return { foo: false }
          }
          return { foo: true }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'data' },
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        asyncData: () => {
          if (maybe) {
            return { foo: false }
          }
          return { foo: true }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'extraReturnStatement',
          data: { functionType: 'data' },
          line: 3
        }
      ]
    }
  ]
})
