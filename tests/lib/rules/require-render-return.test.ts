/**
 * @fileoverview Enforces render function to always return value.
 * @author Armano
 */
import type { Linter } from 'eslint'
import rule from '../../../lib/rules/require-render-return'
import { RuleTester } from '../../eslint-compat'

const languageOptions: Linter.LanguageOptions = {
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
    },
    // Switch with all cases returning AND a default
    {
      filename: 'test.vue',
      code: `export default {
        render() {
          switch (this.type) {
            case 'a': return h('div')
            case 'b': return h('span')
            default: return h('p')
          }
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
          line: 2,
          column: 9,
          endLine: 2,
          endColumn: 15
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
          line: 2,
          column: 9,
          endLine: 2,
          endColumn: 15
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
          line: 2,
          column: 9,
          endLine: 2,
          endColumn: 15
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
          line: 2,
          column: 9,
          endLine: 2,
          endColumn: 15
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
          line: 2,
          column: 9,
          endLine: 2,
          endColumn: 15
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
          line: 2,
          column: 9,
          endLine: 2,
          endColumn: 15
        }
      ]
    },
    // JS: Switch with all cases returning but no default — no type info, must error
    {
      filename: 'test.vue',
      code: `export default {
        render() {
          switch (this.type) {
            case 'a': return h('div')
            case 'b': return h('span')
          }
        }
      }`,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in render function.',
          line: 2
        }
      ]
    },
    // JS: Vue.component switch without default — must error
    {
      code: `Vue.component('test', {
        render() {
          switch (this.type) {
            case 'a': return h('div')
            case 'b': return h('span')
          }
        }
      })`,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in render function.',
          line: 2
        }
      ]
    },
    // Switch where one case uses break
    {
      filename: 'test.vue',
      code: `export default {
        render() {
          switch (this.type) {
            case 'a': return h('div')
            case 'b': break
          }
        }
      }`,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in render function.',
          line: 2
        }
      ]
    },
    // Empty switch
    {
      filename: 'test.vue',
      code: `export default {
        render() {
          switch (this.type) {
          }
        }
      }`,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in render function.',
          line: 2
        }
      ]
    },
    // Switch with only fallthrough cases
    {
      filename: 'test.vue',
      code: `export default {
        render() {
          switch (this.type) {
            case 'a':
            case 'b':
          }
        }
      }`,
      languageOptions,
      errors: [
        {
          message: 'Expected to return a value in render function.',
          line: 2
        }
      ]
    }
  ]
})
