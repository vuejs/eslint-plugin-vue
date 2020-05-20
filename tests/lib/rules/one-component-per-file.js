/**
 * @fileoverview enforce that each component should be in its own file
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/one-component-per-file')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})

ruleTester.run('one-component-per-file', rule, {
  valid: [
    {
      filename: 'test.js',
      code: `Vue.component('name', {})`
    },
    {
      filename: 'test.js',
      code: `
        Vue.component('name', {})
        new Vue({})
      `
    },
    {
      filename: 'test.js',
      code: `
        const foo = {}
        new Vue({})
      `
    },
    {
      filename: 'test.vue',
      code: `export default {}`
    },
    {
      filename: 'test.vue',
      code: `export default {
        components: {
          test: {
            name: 'foo'
          }
        }
      }`
    }
  ],
  invalid: [
    {
      filename: 'test.js',
      code: `
        Vue.component('name', {})
        Vue.component('name', {})
      `,
      errors: [
        'There is more than one component in this file.',
        'There is more than one component in this file.'
      ]
    },
    {
      filename: 'test.js',
      code: `
        Vue.component('TodoList', {
          // ...
        })

        Vue.component('TodoItem', {
          // ...
        })
        export default {}
      `,
      errors: [
        'There is more than one component in this file.',
        'There is more than one component in this file.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
        Vue.component('name', {})
        export default {}
      `,
      errors: [
        'There is more than one component in this file.',
        'There is more than one component in this file.'
      ]
    }
  ]
})
