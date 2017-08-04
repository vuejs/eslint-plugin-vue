/**
 * @fileoverview Enforces that a return statement is present in computed property (return-in-computed-property)
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/return-in-computed-property')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester()
ruleTester.run('return-in-computed-property', rule, {

  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              return true
            },
            bar: function () {
              return false
            },
            bar3: {
              set () {
                return true
              },
              get () {
                return true
              }
            },
            bar4 () {
              if (foo) {
                return true
              } else {
                return false
              }
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 8, sourceType: 'module' }
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: {
              get () {
                return
              }
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 8, sourceType: 'module' },
      options: [{ treatUndefinedAsUnspecified: false }]
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 8, sourceType: 'module' },
      errors: [{
        message: 'Expected to return a value in "foo" computed property.',
        line: 4
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Expected to return a value in "foo" computed property.',
        line: 4
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              if (a) {
                return
              }
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 6, sourceType: 'module' },
      errors: [{
        message: 'Expected to return a value in "foo" computed property.',
        line: 4
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: {
              set () {
              },
              get () {
              }
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 8, sourceType: 'module' },
      errors: [{
        message: 'Expected to return a value in "foo" computed property.',
        line: 7
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              function bar () {
                return this.baz * 2
              }
              bar()
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 8, sourceType: 'module' },
      errors: [{
        message: 'Expected to return a value in "foo" computed property.',
        line: 4
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
            },
            bar () {
              return
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 8, sourceType: 'module' },
      options: [{ treatUndefinedAsUnspecified: false }],
      errors: [{
        message: 'Expected to return a value in "foo" computed property.',
        line: 4
      }]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              return
            }
          }
        }
      `,
      parserOptions: { ecmaVersion: 8, sourceType: 'module' },
      options: [{ treatUndefinedAsUnspecified: true }],
      errors: [{
        message: 'Expected to return a value in "foo" computed property.',
        line: 4
      }]
    }
  ]
})
