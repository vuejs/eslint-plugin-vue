/**
 * @fileoverview Enforces render function to always return value.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/require-render-return')
const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: { jsx: true }
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

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
      parserOptions
    },
    {
      code: `Vue.component('test', {
        foo() {
          return {}
        }
      })`,
      parserOptions
    },
    {
      code: `Vue.component('test', {
        foo: {}
      })`,
      parserOptions
    },
    {
      code: `Vue.component('test', {
        render: foo
      })`,
      parserOptions
    },
    {
      code: `Vue.component('test', {
        render() {
          return <div></div>
        }
      })`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        render() {
          return {}
        }
      }`,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        render() {
          const foo = function () {}
          return foo
        }
      }`,
      parserOptions
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
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `export default {
        render: () => null
      }`,
      parserOptions
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
      parserOptions
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
      parserOptions
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `export default {
        render() {
        }
      }`,
      parserOptions,
      errors: [{
        message: 'Expected to return a value in render function.',
        type: 'Identifier',
        line: 2
      }]
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
      parserOptions,
      errors: [{
        message: 'Expected to return a value in render function.',
        type: 'Identifier',
        line: 2
      }]
    },
    {
      code: `Vue.component('test', {
        render: function () {
          if (a) {
            return
          }
        }
      })`,
      parserOptions,
      errors: [{
        message: 'Expected to return a value in render function.',
        type: 'Identifier',
        line: 2
      }]
    },
    {
      code: `Vue.component('test2', {
        render: function () {
          if (a) {
            return h('div', 'hello')
          }
        }
      })`,
      parserOptions,
      errors: [{
        message: 'Expected to return a value in render function.',
        type: 'Identifier',
        line: 2
      }]
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
      parserOptions,
      errors: [{
        message: 'Expected to return a value in render function.',
        type: 'Identifier',
        line: 2
      }]
    }
  ]
})
