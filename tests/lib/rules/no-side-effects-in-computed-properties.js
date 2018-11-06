/**
 * @fileoverview Don&#39;t introduce side effects in computed properties
 * @author Michał Sajnóg
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-side-effects-in-computed-properties')
const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module'
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('no-side-effects-in-computed-properties', rule, {
  valid: [
    {
      code: `Vue.component('test', {
        ...foo,
        computed: {
          ...test0({}),
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
          },
          test9() {
            return Object.keys(this.a).sort()
          },
          test10: {
            get() {
              return Object.keys(this.a).sort()
            }
          },
          test11() {
            const categories = {}

            this.types.forEach(c => {
              categories[c.category] = categories[c.category] || []
              categories[c.category].push(c)
            })

            return categories
          },
          test12() {
            return this.types.map(t => {
              // [].push('xxx')
              return t
            })
          },
          test13 () {
            this.someArray.forEach(arr => console.log(arr))
          }
        }
      })`,
      parserOptions
    },
    {
      code: `Vue.component('test', {
        computed: {
          ...mapGetters(['example']),
          test1() {
            const num = 0
            const something = {
              a: 'val',
              b: ['1', '2']
            }
            num++
            something.a = 'something'
            something.b.reverse()
            return something.b
          }
        }
      })`,
      parserOptions
    },
    {
      code: `Vue.component('test', {
        name: 'something',
        data() {
          return {}
        }
      })`,
      parserOptions
    },
    {
      code: `Vue.component('test', {
        computed: {
          test () {
            let a;
            a = this.something
            return a
          },
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
            asd.qwe.zxc = 'lorem'
            return this.firstName + ' ' + this.lastName
          },
          test2() {
            this.count += 2;
            this.count++;
            return this.count;
          },
          test3() {
            return this.something.reverse()
          },
          test4() {
            const test = this.another.something.push('example')
            return 'something'
          },
          test5() {
            this.something[index] = thing[index]
            return this.something
          },
          test6() {
            return this.something.keys.sort()
          }
        }
      })`,
      parserOptions,
      errors: [{
        line: 4,
        message: 'Unexpected side effect in "test1" computed property.'
      }, {
        line: 9,
        message: 'Unexpected side effect in "test2" computed property.'
      }, {
        line: 10,
        message: 'Unexpected side effect in "test2" computed property.'
      }, {
        line: 14,
        message: 'Unexpected side effect in "test3" computed property.'
      }, {
        line: 17,
        message: 'Unexpected side effect in "test4" computed property.'
      }, {
        line: 21,
        message: 'Unexpected side effect in "test5" computed property.'
      }, {
        line: 25,
        message: 'Unexpected side effect in "test6" computed property.'
      }]
    },
    {
      code: `Vue.component('test', {
        computed: {
          test1: {
            get() {
              this.firstName = 'lorem'
              return this.firstName + ' ' + this.lastName
            }
          },
          test2: {
            get() {
              this.count += 2;
              this.count++;
              return this.count;
            }
          },
          test3: {
            get() {
              return this.something.reverse()
            }
          },
          test4: {
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
        line: 5,
        message: 'Unexpected side effect in "test1" computed property.'
      }, {
        line: 11,
        message: 'Unexpected side effect in "test2" computed property.'
      }, {
        line: 12,
        message: 'Unexpected side effect in "test2" computed property.'
      }, {
        line: 18,
        message: 'Unexpected side effect in "test3" computed property.'
      }, {
        line: 23,
        message: 'Unexpected side effect in "test4" computed property.'
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default Vue.extend({
          computed: {
            test1() : string {
              return this.something.reverse()
            }
          }
        });
      `,
      parserOptions,
      errors: [{
        line: 5,
        message: 'Unexpected side effect in "test1" computed property.'
      }],
      parser: 'typescript-eslint-parser'
    }
  ]
})
