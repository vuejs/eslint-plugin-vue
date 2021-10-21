/**
 * @author Marton Csordas
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/order-in-computed')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('order-in-computed', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          computed: {}
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
            foo () { return 42 }
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
          computed: {
            foo () { return 42 },
            bar () { return 1 }
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
        computed: {
          ...mapGetters({ test: 'getTest' }),
          ...mapState({ status: state => state.status }),
          baz: {
            get() { return 'bar' },
            set(newValue) { this.something = newValue }
          },
          foo () { return 0 },
          bar () { return 1 }
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
        computed: {
          ...mapGetters({ test: 'getTest' }),
          ...mapState({ status: state => state.status }),
          baz: {
            get() { return 'bar' },
            set(newValue) { this.something = newValue }
          },
          foo () { return 0 },
          bar () { return 1 }
        }
      }
      </script>
      `,
      options: [
        { order: ['MAP_GETTERS', 'MAP_STATE', 'GETTERS_SETTERS', 'NORMAL'] }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          foo () { return 0 },
          bar () { return 1 },
          baz: {
            get() { return 'bar' },
            set(newValue) { this.something = newValue }
          },
          ...mapState({ status: state => state.status }),
          ...mapGetters({ test: 'getTest' })
        }
      }
      </script>
      `,
      options: [
        { order: ['NORMAL', 'GETTERS_SETTERS', 'MAP_STATE', 'MAP_GETTERS'] }
      ]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          foo () { return 0 },
          ...mapGetters({ test: 'getTest' })
        }
      }
      </script>
      `,
      options: [{ order: ['MAP_GETTERS', 'NORMAL'] }],
      errors: [
        {
          message:
            'The "mapGetters" property in line 6 should be above the "foo" property.',
          line: 6,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          foo () { return 0 },
          ...mapGetters({ test: 'getTest' }),
          bar () { return 1 },
          baz: {
            get() { return 'bar' },
            set(newValue) { this.something = newValue }
          },
          ...mapState({ status: state => state.status })
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'The "mapGetters" property in line 6 should be above the "foo" property.',
          line: 6,
          column: 11
        },
        {
          message:
            'The "baz" property in line 8 should be above the "foo" property.',
          line: 8,
          column: 11
        },
        {
          message:
            'The "mapState" property in line 12 should be above the "baz" property.',
          line: 12,
          column: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          baz: {
            get() { return 'bar' },
            set(newValue) { this.something = newValue }
          },
          foo () { return 0 },
          ...mapGetters({ test: 'getTest' }),
          ...mapState({ status: state => state.status }),
          bar () { return 1 }
        }
      }
      </script>
      `,
      options: [
        { order: ['MAP_GETTERS', 'MAP_STATE', 'GETTERS_SETTERS', 'NORMAL'] }
      ],
      errors: [
        {
          message:
            'The "mapGetters" property in line 10 should be above the "baz" property.',
          line: 10,
          column: 11
        },
        {
          message:
            'The "mapState" property in line 11 should be above the "baz" property.',
          line: 11,
          column: 11
        }
      ]
    }
  ]
})
