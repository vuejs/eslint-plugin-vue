/**
 * @fileoverview Enforces render function to always return value.
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/require-render-return')
const RuleTester = require('../../eslint-compat').RuleTester

const languageOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  parserOptions: {
    ecmaFeatures: { jsx: true }
  }
}

const ruleTester = new RuleTester()
ruleTester.run('require-render-return', rule, {
  valid: [
    {
      code: `Vue.component('test', {
        ...foo,
        render() {
          return {}
        }
      })`,
      languageOptions
    },
    {
      code: `Vue.component('test', {
        foo() {
          return {}
        }
      })`,
      languageOptions
    },
    {
      code: `Vue.component('test', {
        foo: {}
      })`,
      languageOptions
    },
    {
      code: `Vue.component('test', {
        render: foo
      })`,
      languageOptions
    },
    {
      code: `Vue.component('test', {
        render() {
          return <div></div>
        }
      })`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        render() {
          return {}
        }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        render() {
          const foo = function () {}
          return foo
        }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        render() {
          if (a) {
            if (b) {

            }
            if (c) {
              return true
            } else {
              return foo
            }
          } else {
            return foo
          }
        }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        render: () => null
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        render() {
          if (a) {
            return \`<div>a</div>\`
          } else {
            return \`<span>a</span>\`
          }
        }
      }`,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        render(h) {
          const options = []
          this.matches.forEach(function (match) {
            options.push(match)
          })
          return h('div', options)
        }
      }`,
      languageOptions
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `export default {
        render() {
        }
      }`,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in render function.',
          type: 'Identifier',
          line: 2
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `export default {
        render: function () {
          if (foo) {
            return h('div', 'hello')
          }
        }
      }`,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in render function.',
          type: 'Identifier',
          line: 2
        }
      ]
    },
    {
      code: `Vue.component('test', {
        render: function () {
          if (a) {
            return
          }
        }
      })`,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in render function.',
          type: 'Identifier',
          line: 2
        }
      ]
    },
    {
      code: `app.component('test', {
        render: function () {
          if (a) {
            return
          }
        }
      })`,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in render function.',
          type: 'Identifier',
          line: 2
        }
      ]
    },
    {
      code: `Vue.component('test2', {
        render: function () {
          if (a) {
            return h('div', 'hello')
          }
        }
      })`,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in render function.',
          type: 'Identifier',
          line: 2
        }
      ]
    },
    {
      code: `Vue.component('test2', {
        render: function () {
          if (a) {

          } else {
            return h('div', 'hello')
          }
        }
      })`,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in render function.',
          type: 'Identifier',
          line: 2
        }
      ]
    }
  ]
})
