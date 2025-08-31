/**
 * @author Sosuke Suzuki
 */

const rule = require('../../../lib/rules/no-arrow-functions-in-watch')
const RuleTester = require('../../eslint-compat').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
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
      errors: [
        {
          message: 'You should not use an arrow function to define a watcher.',
          line: 4,
          column: 16,
          endLine: 4,
          endColumn: 24
        }
      ]
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
          line: 5,
          column: 16,
          endLine: 5,
          endColumn: 24
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
          line: 5,
          column: 16,
          endLine: 5,
          endColumn: 24
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
          line: 15,
          column: 14,
          endLine: 17,
          endColumn: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        watch: {
          foo:{
            handler: function() {},
          },
          bar:{
            handler: () => {}
          }
        }
      }`,
      errors: [
        {
          message: 'You should not use an arrow function to define a watcher.',
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        watch: {
          e: [
            'handle1',
            (val, oldVal) => { /* ... */ },
            {
              handler: (val, oldVal) => { /* ... */ },
            }
          ],
        }
      }`,
      errors: [
        {
          message: 'You should not use an arrow function to define a watcher.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 43
        },
        {
          message: 'You should not use an arrow function to define a watcher.',
          line: 8,
          column: 24,
          endLine: 8,
          endColumn: 54
        }
      ]
    }
  ]
})
