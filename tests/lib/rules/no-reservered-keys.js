/**
 * @fileoverview Prevent overwrite reserved keys
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-reservered-keys')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('no-reservered-keys', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['foo'],
          computed: {
            bar () {
            }
          },
          data () {
            return {
              dat: null
            }
          },
          methods: {
            _foo () {},
            test () {
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    }
  ],

  invalid: [
    {
      filename: 'test.js',
      code: `
        new Vue({
          props: {
            $el: String
          }
        })
      `,
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: "Key '$el' is reserved.",
        line: 4
      }]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          data: {
            _foo: String
          }
        })
      `,
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: "Keys starting with with '_' are reserved in '_foo' group.",
        line: 4
      }]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          foo: {
            bar: String
          }
        })
      `,
      options: [{ reserved: ['bar'], groups: ['foo'] }],
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: "Key 'bar' is reserved.",
        line: 4
      }]
    }
  ]
})
