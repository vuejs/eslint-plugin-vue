/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-deprecated-delete-set')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module',
    globals: {
      require: 'readonly'
    }
  }
})

tester.run('no-deprecated-delete-set', rule, {
  valid: [
    {
      filename: 'test.js',
      code: `
        const another = function () {
          this.$set(obj, key, value)
          this.$delete(obj, key)
        }

        createApp({
          mounted () {
            this.$emit('start')
          },
          methods: {
            click () {
              this.$emit('click')
            }
          }
        })
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            mounted () {
              this.$nextTick()
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
            mounted () {
              a(this.$set)
              a(this.$delete)
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        function set(obj, key, value) {}
        function del(obj, key) {}
        export default {
          mounted () {
            set(obj, key, value)
            del(obj, key)
          }
        }
        </script>
      `
    },
    // from vue
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            Vue.nextTick()
          }
        })
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          import { nextTick as nt, provide } from 'vue'
          export default {
            mounted () {
              nt()
              provide(key, value)
            }
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          const { nextTick: set, provide: del } = require('vue')
          export default {
            mounted () {
              set()
              del(key, value)
            }
          }
        </script>
      `
    }
  ],

  invalid: [
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            this.$set(obj, key, value)
            this.$delete(obj, key)
          }
        })
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 22
        },
        {
          messageId: 'deprecated',
          line: 5,
          column: 18,
          endLine: 5,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            const vm = this
            vm.$set(obj, key, value)
            vm.$delete(obj, key)
          }
        })
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 5,
          column: 16,
          endLine: 5,
          endColumn: 20
        },
        {
          messageId: 'deprecated',
          line: 6,
          column: 16,
          endLine: 6,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            this?.$set(obj, key, value)
            this?.$delete(obj, key)
          }
        })
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 4,
          column: 19,
          endLine: 4,
          endColumn: 23
        },
        {
          messageId: 'deprecated',
          line: 5,
          column: 19,
          endLine: 5,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            mounted () {
              this.$set(obj, key, value)
              this.$delete(obj, key)
            }
          }
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 5,
          column: 20,
          endLine: 5,
          endColumn: 24
        },
        {
          messageId: 'deprecated',
          line: 6,
          column: 20,
          endLine: 6,
          endColumn: 27
        }
      ]
    },
    // from vue
    {
      filename: 'test.js',
      code: `
        app.component('some-comp', {
          mounted () {
            Vue.set(obj, key, value)
            Vue.delete(obj, key)
          }
        })
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 4,
          column: 17,
          endLine: 4,
          endColumn: 20
        },
        {
          messageId: 'deprecated',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          import { set, del } from 'vue'
          export default {
            mounted () {
              set(obj, key, value)
              del(obj, key)
            }
          }
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 6,
          column: 15,
          endLine: 6,
          endColumn: 18
        },
        {
          messageId: 'deprecated',
          line: 7,
          column: 15,
          endLine: 7,
          endColumn: 18
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          import { set, del } from 'vue'

          set(obj, key, value)
          del(obj, key)
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 14
        },
        {
          messageId: 'deprecated',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          import { set as s, del as d } from 'vue'

          s(obj, key, value)
          d(obj, key)
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 12
        },
        {
          messageId: 'deprecated',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          const { set, del } = require('vue')
          export default {
            mounted () {
              set(obj, key, value)
              del(obj, key)
            }
          }
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 6,
          column: 15,
          endLine: 6,
          endColumn: 18
        },
        {
          messageId: 'deprecated',
          line: 7,
          column: 15,
          endLine: 7,
          endColumn: 18
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          const { set: s, del: d } = require('vue')
          export default {
            mounted () {
              s(obj, key, value)
              d(obj, key)
            }
          }
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 6,
          column: 15,
          endLine: 6,
          endColumn: 16
        },
        {
          messageId: 'deprecated',
          line: 7,
          column: 15,
          endLine: 7,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          const { set, del } = require('vue')

          set(obj, key, value)
          del(obj, key)
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 14
        },
        {
          messageId: 'deprecated',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          const v = require('vue')

          v.set(obj, key, value)
          v.del(obj, key)
        </script>
      `,
      errors: [
        {
          messageId: 'deprecated',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 16
        },
        {
          messageId: 'deprecated',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 16
        }
      ]
    }
  ]
})
