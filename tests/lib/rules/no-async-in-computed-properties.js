/**
 * @fileoverview Check if there are no side effects inside computed properties
 * @author 2017 Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-async-in-computed-properties')
const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
  ecmaFeatures: { experimentalObjectRestSpread: true }
}

const parserOptions8 = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: { experimentalObjectRestSpread: true }
}

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()

ruleTester.run('no-async-in-computed-properties', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            ...mapGetters({
              test: 'getTest'
            }),
            foo: function () {
              var bar = 0
              try {
                bar = bar / 0
              } catch (e) {
                return e
              } finally {
                return bar
              }
            },
            foo2: {
              set () {
                new Promise((resolve, reject) => {})
              }
            }
          }
        }
      `,
      parserOptions
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: async function () {
              return await someFunc()
            }
          }
        }
      `,
      parserOptions: parserOptions8,
      errors: [{
        message: 'Unexpected async function declaration in "foo" computed property.',
        line: 4
      }, {
        message: 'Unexpected await operator in "foo" computed property.',
        line: 5
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: async function () {
              return new Promise((resolve, reject) => {})
            }
          }
        }
      `,
      parserOptions: parserOptions8,
      errors: [{
        message: 'Unexpected async function declaration in "foo" computed property.',
        line: 4
      }, {
        message: 'Unexpected Promise object in "foo" computed property.',
        line: 5
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              return bar.then(response => {})
            }
          }
        }
      `,
      parserOptions,
      errors: [{
        message: 'Unexpected asynchronous action in "foo" computed property.',
        line: 5
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              return bar.catch(e => {})
            }
          }
        }
      `,
      parserOptions,
      errors: [{
        message: 'Unexpected asynchronous action in "foo" computed property.',
        line: 5
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              return Promise.all([])
            }
          }
        }
      `,
      parserOptions,
      errors: [{
        message: 'Unexpected asynchronous action in "foo" computed property.',
        line: 5
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              return bar.finally(res => {})
            }
          }
        }
      `,
      parserOptions,
      errors: [{
        message: 'Unexpected asynchronous action in "foo" computed property.',
        line: 5
      }]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo: function () {
            return Promise.race([])
          }
        }
      }
      `,
      parserOptions,
      errors: [{
        message: 'Unexpected asynchronous action in "foo" computed property.',
        line: 5
      }]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo: function () {
            return Promise.reject([])
          }
        }
      }
      `,
      parserOptions,
      errors: [{
        message: 'Unexpected asynchronous action in "foo" computed property.',
        line: 5
      }]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo: function () {
            return Promise.resolve([])
          }
        }
      }
      `,
      parserOptions,
      errors: [{
        message: 'Unexpected asynchronous action in "foo" computed property.',
        line: 5
      }]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo () {
            return Promise.resolve([])
          }
        }
      }
      `,
      parserOptions,
      errors: [{
        message: 'Unexpected asynchronous action in "foo" computed property.',
        line: 5
      }]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo: {
            get () {
              return Promise.resolve([])
            }
          }
        }
      }
      `,
      parserOptions,
      errors: [{
        message: 'Unexpected asynchronous action in "foo" computed property.',
        line: 6
      }]
    },
    {
      filename: 'test.vue',
      code: `
      new Vue({
        computed: {
          foo: {
            get () {
              return Promise.resolve([])
            }
          }
        }
      })
      `,
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: 'Unexpected asynchronous action in "foo" computed property.',
        line: 6
      }]
    },
    {
      filename: 'test.vue',
      code: `
      new Vue({
        computed: {
          foo: {
            get () {
              return test.blabla.then([])
            }
          }
        }
      })
      `,
      parserOptions: { ecmaVersion: 6 },
      errors: [{
        message: 'Unexpected asynchronous action in "foo" computed property.',
        line: 6
      }]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo: function () {
            setTimeout(() => { }, 0)
            window.setTimeout(() => { }, 0)
            setInterval(() => { }, 0)
            window.setInterval(() => { }, 0)
            setImmediate(() => { })
            window.setImmediate(() => { })
            requestAnimationFrame(() => {})
            window.requestAnimationFrame(() => {})
          }
        }
      }
      `,
      parserOptions,
      errors: [{
        message: 'Unexpected timed function in "foo" computed property.',
        line: 5
      }, {
        message: 'Unexpected timed function in "foo" computed property.',
        line: 6
      }, {
        message: 'Unexpected timed function in "foo" computed property.',
        line: 7
      }, {
        message: 'Unexpected timed function in "foo" computed property.',
        line: 8
      }, {
        message: 'Unexpected timed function in "foo" computed property.',
        line: 9
      }, {
        message: 'Unexpected timed function in "foo" computed property.',
        line: 10
      }, {
        message: 'Unexpected timed function in "foo" computed property.',
        line: 11
      }, {
        message: 'Unexpected timed function in "foo" computed property.',
        line: 12
      }]
    }
  ]
})
