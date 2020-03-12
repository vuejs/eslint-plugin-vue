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
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        data() {
          return {
            a: this.test
          }
        },
        computed: {
          test() {},
          'foo': {

          }
        }
      }
      </script>
      `,
      errors: [
        `The "this.test" is an computed data can't use in data property.`
      ]
    },
    // same computed data reference by multi data property
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
          'foo': {

          }
        }
      }
      </script>
      `,
      errors: [
        {
          message: `The "this.test" is an computed data can't use in data property.`,
          line: 6,
          column: 16
        },
        {
          message: `The "this.test" is an computed data can't use in data property.`,
          line: 7,
          column: 16
        }
      ]
    }
  ]
})
