/**
 * @author Sosuke Suzuki
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-arrow-functions-in-watch')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})
ruleTester.run('no-arrow-functions-in-watch', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {}
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          watch: {}
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          watch: {
            foo() {}
          },
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          watch: {
            foo: function() {}
          },
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          watch: {
            foo() {},
            bar() {}
          },
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          watch: {
            foo: function() {},
            bar: function() {}
          },
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          watch: {
            ...obj,
            foo: function() {},
            bar: function() {}
          },
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        data: {
          a: 1,
          b: 2,
          c: 3,
          d: 4,
          e: {
            f: {
              g: 5
            }
          }
        },
        watch: {
          a: function (val, oldVal) {
            console.log('new: %s, old: %s', val, oldVal)
          },
          b: 'someMethod',
          c: {
            handler: function (val, oldVal) {},
            deep: true
          },
          d: {
            handler: 'someMethod',
            immediate: true
          },
          e: [
            'handle1',
            function handle2 (val, oldVal) {},
            {
              handler: function handle3 (val, oldVal) {},
              /* ... */
            }
          ],
          'e.f': function (val, oldVal) { /* ... */ }
        }
      }`
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      export default {
        watch: {
          foo: () => {}
        },
      }`,
      errors: ['You should not use an arrow function to define a watcher.']
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        watch: {
          foo() {},
          bar: () => {}
        }
      }`,
      errors: [
        {
          message: 'You should not use an arrow function to define a watcher.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        watch: {
          foo: function() {},
          bar: () => {}
        }
      }`,
      errors: [
        {
          message: 'You should not use an arrow function to define a watcher.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        data: {
          a: 1,
          b: 2,
          c: 3,
          d: 4,
          e: {
            f: {
              g: 5
            }
          }
        },
        watch: {
          a: (val, oldVal) => {
            console.log('new: %s, old: %s', val, oldVal)
          },
          b: 'someMethod',
          c: {
            handler: function (val, oldVal) {},
            deep: true
          },
          d: {
            handler: 'someMethod',
            immediate: true
          },
          e: [
            'handle1',
            function handle2 (val, oldVal) {},
            {
              handler: function handle3 (val, oldVal) {},
              /* ... */
            }
          ],
          'e.f': function (val, oldVal) { /* ... */ }
        }
      }`,
      errors: [
        {
          message: 'You should not use an arrow function to define a watcher.',
          line: 15
        }
      ]
    }
  ]
})
