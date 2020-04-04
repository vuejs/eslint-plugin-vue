/**
 * @fileoverview Ensure computed properties are not used in the data()
 * @author IWANABETHATGUY
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

var rule = require('../../../lib/rules/no-computed-in-data')

var RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

var ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  }
})
ruleTester.run('no-computed-in-data', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {
          return {
            a: this.b
          }
        },
        computed: {
          test() {},
          'foo': {

          }
        }
      }
      </script>
      `
    },
    // should not warn when use computed in methods
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {
          return {
            a: this.b
          }
        },
        computed: {
          test() {},
        },
        methods: {
          foo() {
            this.test
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
        data() {
          return {
            data() {
              return {
                test: this.foo
              }
            },
            computed: {
              foo() {}
            }
          }
        },
        computed: {
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
          return {
            fn() { return this.foo }
          }
        },
        computed: {
          foo() {}
        }
      }
      </script>
      `
    },
    // should not warn when objectExpression is not a vue component
    {
      filename: 'test.vue',
      code: `
      <script>
      const a = {
        data: {
          a: this.test
        },
        computed: {
          test() {},
        }
      }
      </script>
      `
    }
  ],
  invalid: [
    // should warn when prop key is an String literal
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {
          return {
            a: this.test + this.foo
          }
        },
        computed: {
          test() {},
          'foo'() {

          }
        }
      }
      </script>
      `,
      errors: [
        `Computed property 'this.test' can't use in data property.`,
        `Computed property 'this.foo' can't use in data property.`
      ]
    },
    // should report when data is objectExpression, when this is a root component
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data: {
          a: this.test
        },
        computed: {
          test() {},
        }
      }
      </script>
      `,
      errors: [
        `Computed property 'this.test' can't use in data property.`
      ]
    },
    // same computed data referenced by multi data property
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {
          return {
            a: this.test,
            b: this.test
          }
        },
        computed: {
          test() {},
        }
      }
      </script>
      `,
      errors: [
        {
          message: `Computed property 'this.test' can't use in data property.`,
          line: 6,
          column: 16
        },
        {
          message: `Computed property 'this.test' can't use in data property.`,
          line: 7,
          column: 16
        }
      ]
    },
    // should also report when computed data return an object
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {
          return {
            a: this.test.foo,
            b: this.test.bar
          }
        },
        computed: {
          test() {
            return {foo: 0, bar: 1}
          },
        }
      }
      </script>
      `,
      errors: [
        {
          message: `Computed property 'this.test' can't use in data property.`,
          line: 6,
          column: 16,
          endColumn: 29,
          endLine: 6
        },
        {
          message: `Computed property 'this.test' can't use in data property.`,
          line: 7,
          column: 16,
          endLine: 7,
          endColumn: 29
        }
      ]
    },
    // should only report the data function scope computed property
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {
          return {
            bar: this.foo,
            fn() { return this.foo }
          }
        },
        computed: {
          foo() {}
        }
      }
      </script>
      `,
      errors: [
        {
          message: `Computed property 'this.foo' can't use in data property.`,
          line: 6,
          column: 18,
          endColumn: 26,
          endLine: 6
        }
      ]
    }
  ]
})
