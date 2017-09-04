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

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module'
}

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
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              const options = []
              this.matches.forEach((match) => {
                options.push(match)
              })
              return options
            }
          }
        }
      `,
      parserOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              const options = []
              this.matches.forEach(function (match) {
                options.push(match)
              })
              return options
            }
          }
        }
      `,
      parserOptions
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
      parserOptions,
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
      parserOptions,
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
      parserOptions,
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
      parserOptions,
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
      parserOptions,
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
      parserOptions,
      options: [{ treatUndefinedAsUnspecified: true }],
      errors: [{
        message: 'Expected to return a value in "foo" computed property.',
        line: 4
      }]
    },
    {
      filename: 'test.js',
      code: `
        // @vue/component
        export default {
          computed: {
              my_FALSE_test() {
                  let aa = 2;
                  this.my_id = aa;
              }
          }
        }
      `,
      parserOptions,
      errors: [{
        message: 'Expected to return a value in "my_FALSE_test" computed property.',
        line: 5
      }]
    }
  ]
})
