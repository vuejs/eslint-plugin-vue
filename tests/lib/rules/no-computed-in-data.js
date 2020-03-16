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
    }
  ]
})
