/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-deprecated-dollar-listeners-api')

const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})
ruleTester.run('no-deprecated-dollar-listeners-api', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-bind="$attrs"/>
        </template>
        <script>
        export default {
          mounted () {
            this.$emit('start')
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
          methods: {
            click () {
              this.$emit('click')
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
        }
        const another = function () {
          console.log(this.$listeners)
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div foo="$listeners"/>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-on="() => {
            function click ($listeners) {
              fn(foo.$listeners)
              fn($listeners)
            }
          }"/>
          <div v-for="$listeners in list">
            <div v-on="$listeners">
          </div>
          <VueComp>
            <template v-slot="{$listeners}">
              <div v-on="$listeners">
            </template>
          </VueComp>
        </template>
        <script>
        export default {
          methods: {
            click ($listeners) {
              foo.$listeners
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
          computed: {
            foo () {
              const {vm} = this
              return vm.$listeners
            }
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
        <template>
          <div v-on="$listeners"/>
        </template>
        <script>
        export default {
          computed: {
            foo () {
              return this.$listeners
            }
          }
        }
        </script>
      `,
      errors: [
        {
          line: 3,
          column: 22,
          messageId: 'deprecated',
          endLine: 3,
          endColumn: 32
        },
        {
          line: 9,
          column: 27,
          messageId: 'deprecated',
          endLine: 9,
          endColumn: 37
        }
      ]
    },

    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-for="listener in $listeners"/>
          <div :foo="$listeners"/>
        </template>
        <script>
        export default {
          computed: {
            foo () {
              fn(this.$listeners)
            }
          }
        }
        </script>
      `,
      errors: [
        {
          line: 3,
          column: 35,
          messageId: 'deprecated',
          endLine: 3,
          endColumn: 45
        },
        {
          line: 4,
          column: 22,
          messageId: 'deprecated',
          endLine: 4,
          endColumn: 32
        },
        {
          line: 10,
          column: 23,
          messageId: 'deprecated',
          endLine: 10,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          computed: {
            foo () {
              const vm = this
              return vm.$listeners
            }
          }
        }
        </script>
      `,
      errors: [
        {
          line: 7,
          column: 25,
          messageId: 'deprecated'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          computed: {
            foo () {
              const vm = this
              function fn() {
                return vm.$listeners
              }
              return fn()
            }
          }
        }
        </script>
      `,
      errors: [
        {
          line: 8,
          column: 27,
          messageId: 'deprecated'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          computed: {
            foo () {
              const vm = this
              const a = vm?.$listeners
              const b = this?.$listeners
            }
          }
        }
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated'
        },
        {
          messageId: 'deprecated'
        }
      ]
    }
  ]
})
