/**
 * @fileoverview Don&#39;t introduce side effects in computed properties
 * @author Michał Sajnóg
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-side-effects-in-computed-properties')
const { RuleTester } = require('eslint')

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: { experimentalObjectRestSpread: true }
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('no-side-effects-in-computed-properties', rule, {
  valid: [
    {
      code: `Vue.component('test', {
        computed: {
          test1() {
            return this.firstName + ' ' + this.lastName
          },
          test2() {
            return this.something.slice(0).reverse()
          },
          test3() {
            const example = this.something * 2
            return example + 'test'
          },
          test4() {
            return {
              ...this.something,
              test: 'example'
            }
          },
          test5: {
            get() {
              return this.firstName + ' ' + this.lastName
            },
            set(newValue) {
              const names = newValue.split(' ')
              this.firstName = names[0]
              this.lastName = names[names.length - 1]
            }
          },
          test6: {
            get() {
              return this.something.slice(0).reverse()
            }
          },
          test7: {
            get() {
              const example = this.something * 2
              return example + 'test'
            }
          },
          test8: {
            get() {
              return {
                ...this.something,
                test: 'example'
              }
            }
          }
        }
      })`,
      parserOptions
    }
  ],
  invalid: [
    {
      code: `Vue.component('test', {
        computed: {
          test1() {
            this.firstName = 'lorem'
            return this.firstName + ' ' + this.lastName
          },
          test2() {
            return this.something.reverse()
          },
          test3() {
            const test = this.another.something.push('example')
            return 'something'
          },
          test4: {
            get() {
              this.firstName = 'lorem'
              return this.firstName + ' ' + this.lastName
            }
          },
          test5: {
            get() {
              return this.something.reverse()
            }
          },
          test6: {
            get() {
              const test = this.another.something.push('example')
              return 'something'
            },
            set(newValue) {
              this.something = newValue
            }
          },
        }
      })`,
      parserOptions,
      errors: [{
        line: 4,
        message: 'Unexpected side effect in "test1" computed property'
      }, {
        line: 8,
        message: 'Unexpected side effect in "test2" computed property'
      }, {
        line: 11,
        message: 'Unexpected side effect in "test3" computed property'
      }, {
        line: 15,
        message: 'Unexpected side effect in "test4" computed property'
      }, {
        line: 21,
        message: 'Unexpected side effect in "test5" computed property'
      }, {
        line: 26,
        message: 'Unexpected side effect in "test6" computed property'
      }, {
        line: 31,
        message: 'Unexpected side effect in "test7" computed property'
      }]
    }
  ]
})
