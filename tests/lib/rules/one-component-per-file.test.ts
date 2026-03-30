/**
 * @fileoverview enforce that each component should be in its own file
 * @author Armano
 */
import rule from '../../../lib/rules/one-component-per-file'
import { RuleTester } from '../../eslint-compat'

const ruleTester = new RuleTester({
  languageOptions: {
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
    },
    {
      filename: 'test.js',
      code: `
        Vue.mixin({})
        Vue.component('name', {})
      `
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
        {
          message: 'There is more than one component in this file.',
          line: 2,
          column: 31,
          endLine: 2,
          endColumn: 33
        },
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 31,
          endLine: 3,
          endColumn: 33
        }
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
        {
          message: 'There is more than one component in this file.',
          line: 2,
          column: 35,
          endLine: 4,
          endColumn: 10
        },
        {
          message: 'There is more than one component in this file.',
          line: 6,
          column: 35,
          endLine: 8,
          endColumn: 10
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        Vue.component('name', {})
        export default {}
      `,
      errors: [
        {
          message: 'There is more than one component in this file.',
          line: 2,
          column: 31,
          endLine: 2,
          endColumn: 33
        },
        {
          message: 'There is more than one component in this file.',
          line: 3,
          column: 24,
          endLine: 3,
          endColumn: 26
        }
      ]
    }
  ]
})
