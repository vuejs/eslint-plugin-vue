/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const rule = require('../../../lib/rules/no-deprecated-props-default-this')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: { ecmaVersion: 2020, sourceType: 'module' }
})

ruleTester.run('no-deprecated-props-default-this', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <template><div /></template>
        <script>
        export default {
          props: {
            a: String,
            b: {
              default (props) {
                return props.a
              }
            }
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template><div /></template>
        <script>
        export default {
          props: {
            a: String,
            b: {
              default: () => {
                return this.a
              }
            }
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template><div /></template>
        <script>
        export default {
          props: {
            a: String,
            b: {
              default () {
                return function () {
                  return this.a
                }
              }
            }
          }
        }
        </script>
      `,
      errors: [{}, {}]
    },
    {
      filename: 'test.vue',
      code: `
        <template><div /></template>
        <script>
        const Foo = {
          props: {
            a: String,
            b: {
              default () {
                return this.a
              }
            }
          }
        }
        </script>
      `
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1464
      filename: 'test.vue',
      code: `
      <template>
        <button @click="printMessage">Print message</button>
      </template>

      <script>

      export default {
        name: 'App',
        props: {
          message: String,
          printMessage: {
            type: Function,
            default() {
              console.log(this.message);
            }
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
        <template><div /></template>
        <script>
        export default {
          props: {
            a: String,
            b: {
              default () {
                return this.a
              }
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Props default value factory functions no longer have access to `this`.',
          line: 9,
          column: 24,
          endLine: 9,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template><div /></template>
        <script>
        export default {
          props: {
            a: String,
            b: {
              default () {
                return () => this.a
              }
            }
          }
        }
        </script>
      `,
      errors: [
        {
          message:
            'Props default value factory functions no longer have access to `this`.',
          line: 9,
          column: 30,
          endLine: 9,
          endColumn: 34
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template><div /></template>
        <script>
        export default {
          props: {
            a: String,
            b: {
              default () {
                return this.a
              }
            },
            c: {
              default () {
                return this.a
              }
            }
          }
        }
        </script>
      `,
      errors: [
        'Props default value factory functions no longer have access to `this`.',
        'Props default value factory functions no longer have access to `this`.'
      ]
    }
  ]
})
