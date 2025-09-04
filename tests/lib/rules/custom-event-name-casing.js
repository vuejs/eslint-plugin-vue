/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/custom-event-name-casing')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
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
      `,
      options: ['kebab-case']
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
      `,
      options: ['kebab-case']
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
      `,
      options: ['kebab-case']
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
      `,
      options: ['kebab-case']
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
      `,
      options: ['kebab-case']
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
      `,
      options: ['kebab-case']
    },
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
      options: ['kebab-case', { ignores: ['fooBar', 'barBaz', 'bazQux'] }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input
          @click="$emit('input:update')">
        <input
          @click="$emit('search:update')">
        <input
          @click="$emit('click:row')">
      </template>
      <script>
      export default {
        setup(props, context) {
          return {
            onInput(value) {
              context.emit('input:update')
              context.emit('search:update')
              context.emit('click:row')
            }
          }
        },
        methods: {
          onClick() {
            this.$emit('input:update')
            this.$emit('search:update')
            this.$emit('click:row')
          }
        }
      }
      </script>
      `,
      options: [
        'kebab-case',
        { ignores: ['/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'] }
      ]
    },

    // camelCase
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
      options: ['camelCase']
    },
    // Default
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
      `
    },

    // kebab-case
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
              context.emit('bar-baz')
            }
          }
        },
        methods: {
          onClick() {
            this.$emit('baz-qux')
          }
        }
      }
      </script>
      `,
      options: ['kebab-case']
    },
    // setup defineEmits
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits({})
      emit('foo-bar')
      </script>

      <template>
      <button @click="emit('foo-bar')">Foo</button>
      <button @click="$emit('foo-bar')">Foo</button>
      </template>
      `,
      options: ['kebab-case']
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
      options: ['kebab-case'],
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
      options: ['kebab-case'],
      errors: [
        {
          message: "Custom event name 'fooBar' must be kebab-case.",
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 35
        },
        {
          message: "Custom event name 'barBaz' must be kebab-case.",
          line: 11,
          column: 31,
          endLine: 11,
          endColumn: 39
        },
        {
          message: "Custom event name 'bazQux' must be kebab-case.",
          line: 17,
          column: 27,
          endLine: 17,
          endColumn: 35
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
      options: ['kebab-case'],
      errors: [
        {
          message: "Custom event name 'fooBar' must be kebab-case.",
          line: 4,
          column: 27,
          endLine: 4,
          endColumn: 35
        },
        {
          message: "Custom event name 'barBaz' must be kebab-case.",
          line: 11,
          column: 33,
          endLine: 11,
          endColumn: 41
        },
        {
          message: "Custom event name 'bazQux' must be kebab-case.",
          line: 17,
          column: 29,
          endLine: 17,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input
          @click="$emit('input/update')">
      </template>
      <script>
      export default {
        setup(props, context) {
          return {
            onInput(value) {
              context.emit('search/update')
            }
          }
        },
        methods: {
          onClick() {
            this.$emit('click/row')
          }
        }
      }
      </script>
      `,
      options: [
        'kebab-case',
        { ignores: ['/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'] }
      ],
      errors: [
        {
          message: "Custom event name 'input/update' must be kebab-case.",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 39
        },
        {
          message: "Custom event name 'search/update' must be kebab-case.",
          line: 11,
          column: 28,
          endLine: 11,
          endColumn: 43
        },
        {
          message: "Custom event name 'click/row' must be kebab-case.",
          line: 17,
          column: 24,
          endLine: 17,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input
          @click="$emit('input/update')">
      </template>
      <script>
      export default {
        setup(props, context) {
          return {
            onInput(value) {
              context.emit('search/update')
            }
          }
        },
        methods: {
          onClick() {
            this.$emit('click/row')
          }
        }
      }
      </script>
      `,
      options: [
        'kebab-case',
        { ignores: ['input:update', 'search:update', 'click:row'] }
      ],
      errors: [
        {
          message: "Custom event name 'input/update' must be kebab-case.",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 39
        },
        {
          message: "Custom event name 'search/update' must be kebab-case.",
          line: 11,
          column: 28,
          endLine: 11,
          endColumn: 43
        },
        {
          message: "Custom event name 'click/row' must be kebab-case.",
          line: 17,
          column: 24,
          endLine: 17,
          endColumn: 35
        }
      ]
    },
    // camelCase
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
              context.emit('bar-baz')
            }
          }
        },
        methods: {
          onClick() {
            this.$emit('baz-qux')
          }
        }
      }
      </script>
      `,
      options: ['camelCase'],
      errors: [
        {
          message: "Custom event name 'foo-bar' must be camelCase.",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 34
        },
        {
          message: "Custom event name 'bar-baz' must be camelCase.",
          line: 11,
          column: 28,
          endLine: 11,
          endColumn: 37
        },
        {
          message: "Custom event name 'baz-qux' must be camelCase.",
          line: 17,
          column: 24,
          endLine: 17,
          endColumn: 33
        }
      ]
    },
    // Default
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
              context.emit('bar-baz')
            }
          }
        },
        methods: {
          onClick() {
            this.$emit('baz-qux')
          }
        }
      }
      </script>
      `,
      errors: [
        {
          message: "Custom event name 'foo-bar' must be camelCase.",
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 34
        },
        {
          message: "Custom event name 'bar-baz' must be camelCase.",
          line: 11,
          column: 28,
          endLine: 11,
          endColumn: 37
        },
        {
          message: "Custom event name 'baz-qux' must be camelCase.",
          line: 17,
          column: 24,
          endLine: 17,
          endColumn: 33
        }
      ]
    },
    // kebab-case
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits({})
      emit('fooBar')
      emit('foo-bar')
      </script>
      `,
      errors: [
        {
          message: "Custom event name 'foo-bar' must be camelCase.",
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits({})
      emit(\`foo-bar\`) // template literal
      </script>
      `,
      errors: [
        {
          message: "Custom event name 'foo-bar' must be camelCase.",
          line: 4,
          column: 12,
          endLine: 4,
          endColumn: 21
        }
      ]
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/2577
      filename: 'test.vue',
      code: `
      <script setup>
      const emit = defineEmits({})
      emit('foo-bar')
      </script>

      <template>
      <button @click="emit('foo-bar')">Foo</button>
      <button @click="$emit('foo-bar')">Foo</button>
      </template>
      `,
      errors: [
        {
          message: "Custom event name 'foo-bar' must be camelCase.",
          line: 4,
          column: 12,
          endLine: 4,
          endColumn: 21
        },
        {
          message: "Custom event name 'foo-bar' must be camelCase.",
          line: 8,
          column: 28,
          endLine: 8,
          endColumn: 37
        },
        {
          message: "Custom event name 'foo-bar' must be camelCase.",
          line: 9,
          column: 29,
          endLine: 9,
          endColumn: 38
        }
      ]
    }
  ]
})
