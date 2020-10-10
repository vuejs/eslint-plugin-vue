/**
 * @author tyankatsu <https://github.com/tyankatsu0105>
 * See LICENSE file in root directory for full license.
 */

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-use-computed-property-like-method')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2015, sourceType: 'module' }
})

tester.run('no-use-computed-property-like-method', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            name() {
              return 'name';
            }
          },
          methods: {
            getName() {
              return this.name
            }
          },
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: {
            name: {
              type: String
            },
          },
          computed: {
            isExpectedName() {
              return this.name === 'name';
            }
          },
          methods: {
            getName() {
              return this.isExpectedName
            }
          },
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            name() {
              return 'name';
            },
            isExpectedName() {
              return this.name === 'name';
            }
          },
          methods: {
            getName() {
              return this.isExpectedName
            }
          },
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
          computed: {
            name() {
              return 'name';
            }
          },
          methods: {
            getName() {
              return this.name()
            }
          }
        }
      </script>
      `,
      errors: ['Does not allow to use computed with this expression.']
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: {
            name: {
              type: String
            },
          },
          computed: {
            isExpectedName() {
              return this.name === 'name';
            }
          },
          methods: {
            getName() {
              return this.isExpectedName()
            }
          }
        }
      </script>
      `,
      errors: ['Does not allow to use computed with this expression.']
    }
  ]
})
