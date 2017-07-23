/**
 * @fileoverview Enforces component's data property to be a function.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-shared-component-data')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('no-shared-component-data', rule, {

  valid: [
    {
      filename: 'test.js',
      code: `
        new Vue({
          data: function () {
            return {
              foo: 'bar'
            }
          }
        })
      `
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          data: {
            foo: 'bar'
          }
        })
      `
    },
    {
      filename: 'test.js',
      code: `
        Vue.component('some-comp', {
          data: function () {
            return {
              foo: 'bar'
            }
          }
        })
      `,
      parserOptions: { ecmaVersion: 6 }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data: function () {
            return {
              foo: 'bar'
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          ...foo
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module', ecmaFeatures: { experimentalObjectRestSpread: true }}
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' }
    }
  ],

  invalid: [
    {
      filename: 'test.js',
      code: `
        Vue.component('some-comp', {
          data: {
            foo: 'bar'
          }
        })
      `,
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: '`data` property in component must be a function',
        line: 3
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data: {
            foo: 'bar'
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: '`data` property in component must be a function',
        line: 3
      }]
    }
  ]
})
