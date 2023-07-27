/**
 * @fileoverview Require `expose` in Vue components
 * @author Yosuke Ota <https://github.com/ota-meshi>
 */
'use strict'

const rule = require('../../../lib/rules/require-expose')
const RuleTester = require('eslint').RuleTester

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('require-expose', rule, {
  valid: [
    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {
          expose: ['foo'],
          methods: {
            foo() {},
            bar() {},
          }
        }
      </script>
      `
    },
    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {
          expose: [],
          methods: {
            foo() {},
            bar() {},
          }
        }
      </script>
      `
    },
    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {
          setup(_, {expose}) {
            expose({
              foo() {}
            })
            return {
              bar() {}
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {
          setup(_, {expose}) {
            expose()
            return {
              foo() {},
              bar() {}
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {
          setup(_, ctx) {
            ctx.expose({
              foo() {}
            })
            return {
              bar() {}
            }
          }
        }
      </script>
      `
    },
    `
      Vue.mixin({
        methods: {
          foo () {}
        }
      })
    `,
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
      }
      </script>
      <script setup>
      </script>
      `
    },
    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {
          setup() {
            return () => h('div')
          }
        }
      </script>
      `
    },
    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {
          setup() {
            function foo () {}
            return foo
          }
        }
      </script>
      `
    },
    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {
          setup() {
            const foo = function () {}
            return foo
          }
        }
      </script>
      `
    },
    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {
          setup:() => function () {}
        }
      </script>
      `
    }
  ],

  invalid: [
    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {
          methods: {
            foo() {},
            bar() {},
          }
        }
      </script>
      `,
      errors: [
        {
          message:
            'The public properties of the component must be explicitly declared using `expose`. If the component does not have public properties, declare it empty.',
          suggestions: [
            {
              desc: 'Add the `expose` option to give an empty array.',
              output: `
      <script>
        export default {
expose: [],
          methods: {
            foo() {},
            bar() {},
          }
        }
      </script>
      `
            },
            {
              desc: 'Add the `expose` option to declare all properties.',
              output: `
      <script>
        export default {
expose: ["foo", "bar"],
          methods: {
            foo() {},
            bar() {},
          }
        }
      </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {
          setup(_, ctx) {
            return {
              foo() {},
              bar() {}
            }
          }
        }
      </script>
      `,
      errors: [
        {
          message:
            'The public properties of the component must be explicitly declared using `expose`. If the component does not have public properties, declare it empty.',
          suggestions: [
            {
              desc: 'Add the `expose` option to give an empty array.',
              output: `
      <script>
        export default {
expose: [],
          setup(_, ctx) {
            return {
              foo() {},
              bar() {}
            }
          }
        }
      </script>
      `
            },
            {
              desc: 'Add the `expose` option to declare all properties.',
              output: `
      <script>
        export default {
expose: ["foo", "bar"],
          setup(_, ctx) {
            return {
              foo() {},
              bar() {}
            }
          }
        }
      </script>
      `
            }
          ]
        }
      ]
    },

    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {
          props: ['x'],
          methods: {
            foo() {},
            bar() {},
          }
        }
      </script>
      `,
      errors: [
        {
          suggestions: [
            {
              desc: 'Add the `expose` option to give an empty array.',
              output: `
      <script>
        export default {
          props: ['x'],
expose: [],
          methods: {
            foo() {},
            bar() {},
          }
        }
      </script>
      `
            },
            {
              desc: 'Add the `expose` option to declare all properties.',
              output: `
      <script>
        export default {
          props: ['x'],
expose: ["x", "foo", "bar"],
          methods: {
            foo() {},
            bar() {},
          }
        }
      </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {
        }
      </script>
      `,
      errors: [
        {
          suggestions: [
            {
              desc: 'Add the `expose` option to give an empty array.',
              output: `
      <script>
        export default {
expose: []
        }
      </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'ValidComponent.vue',
      code: `
      <script>
        export default {}
      </script>
      `,
      errors: [
        {
          suggestions: [
            {
              desc: 'Add the `expose` option to give an empty array.',
              output: `
      <script>
        export default {
expose: []
}
      </script>
      `
            }
          ]
        }
      ]
    }
  ]
})
