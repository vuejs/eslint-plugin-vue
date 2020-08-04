/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/custom-event-name-casing')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('custom-event-name-casing', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <input
          @click="$emit('foo-bar')">
      </template>
      <script>
      export default {
        setup(props, context) {
          return {
            onInput(value) {
              context.emit('update:fooBar', value)
              context.emit('foo-bar')
            }
          }
        },
        methods: {
          onClick() {
            this.$emit('foo-bar')
          }
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input
          @click="$emit('update:fooBar', value)">
      </template>
      <script>
      export default {
        setup(props, {emit}) {
          return {
            onInput(value) {
              emit('update:fooBar', value)
              emit('foo-bar')
            }
          }
        },
        methods: {
          onClick() {
            this.$emit('update:fooBar', value)
          }
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input
          @click="emit('fooBar')">
      </template>
      <script>
      export default {
        setup(context) {
          return {
            onInput(value) {
              context.emit('barBaz')
            }
          }
        },
        methods: {
          onClick() {
            $emit('bazQux')
          }
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input
          @click="$emit(fooBar)">
      </template>
      <script>
      export default {
        setup(props, context) {
          return {
            onInput(value) {
              context.emit(barBaz)
            }
          }
        },
        methods: {
          onClick() {
            this.$emit(bazQux)
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
        setup(prop, ...context) {
          return {
            onInput(value) {
              context.emit('barBaz')
            }
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
        setup(prop, [context]) {
          return {
            onInput(value) {
              context.emit('barBaz')
            }
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
        setup(prop, {e}) {
          return {
            onInput(value) {
              e('barBaz')
            }
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
      <template>
        <input
          @click="$emit('fooBar')">
      </template>
      <script>
      export default {
        setup(props, context) {
          return {
            onInput(value) {
              context.emit('barBaz')
            }
          }
        },
        methods: {
          onClick() {
            this.$emit('bazQux')
          }
        }
      }
      </script>
      `,
      errors: [
        {
          message: "Custom event name 'fooBar' must be kebab-case.",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 33
        },
        {
          message: "Custom event name 'barBaz' must be kebab-case.",
          line: 11,
          column: 28,
          endLine: 11,
          endColumn: 36
        },
        {
          message: "Custom event name 'bazQux' must be kebab-case.",
          line: 17,
          column: 24,
          endLine: 17,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input
          @click="$emit?.('fooBar')">
      </template>
      <script>
      export default {
        setup(props, context) {
          return {
            onInput(value) {
              context?.emit?.('barBaz')
            }
          }
        },
        methods: {
          onClick() {
            this?.$emit?.('bazQux')
          }
        }
      }
      </script>
      `,
      errors: [
        "Custom event name 'fooBar' must be kebab-case.",
        "Custom event name 'barBaz' must be kebab-case.",
        "Custom event name 'bazQux' must be kebab-case."
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input
          @click="$emit?.('fooBar')">
      </template>
      <script>
      export default {
        setup(props, context) {
          return {
            onInput(value) {
              (context?.emit)?.('barBaz')
            }
          }
        },
        methods: {
          onClick() {
            (this?.$emit)?.('bazQux')
          }
        }
      }
      </script>
      `,
      errors: [
        "Custom event name 'fooBar' must be kebab-case.",
        "Custom event name 'barBaz' must be kebab-case.",
        "Custom event name 'bazQux' must be kebab-case."
      ]
    }
  ]
})
