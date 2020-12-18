/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/return-in-emits-validator')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})
ruleTester.run('return-in-emits-validator', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo () {
              return true
            },
            bar: function (e) {
              return true
            },
            baz: (e) => {
              return e
            },
            baz2: (e) => e,
            qux () {
              if (foo) {
                return true
              } else {
                return false
              }
            },
            quux: null,
            corge (evt) {
              return evt
            }
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo () {
              const options = []
              this.matches.forEach((match) => {
                options.push(match)
              })
              return options
            }
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: ['foo']
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo () {
              const options = []
              this.matches.forEach(function (match) {
                options.push(match)
              })
              return options
            }
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            a () {
              return 1n
            },
            b: function (e) {
              return 1
            },
            c: (e) => {
              return 'a'
            },
          }
        }
        </script>
      `
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo () {
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Expected to return a boolean value in "foo" emits validator.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo: function () {
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Expected to return a boolean value in "foo" emits validator.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo: () => {
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Expected to return a boolean value in "foo" emits validator.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo: () => false
          }
        }
        </script>
      `,
      errors: [
        {
          message: 'Expected to return a true value in "foo" emits validator.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo: function () {
              function bar () {
                return this.baz * 2
              }
              bar()
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Expected to return a boolean value in "foo" emits validator.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo () {
            },
            bar () {
              return
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Expected to return a boolean value in "foo" emits validator.',
          line: 5
        },
        {
          message:
            'Expected to return a boolean value in "bar" emits validator.',
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo () {
              return
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Expected to return a boolean value in "foo" emits validator.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          emits: {
            foo: function () {
              if (a) {
                return false
              } else if (b) {
                return 0
              } else if (c) {
                return null
              } else if (d) {
                return ''
              } else if (e) {
                return undefined
              } else if (f) {
                return NaN
              } else if (g) {
                return 0n
              }
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message: 'Expected to return a true value in "foo" emits validator.',
          line: 5
        }
      ]
    }
  ]
})
