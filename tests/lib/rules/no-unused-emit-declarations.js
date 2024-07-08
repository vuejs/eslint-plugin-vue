/**
 * @author ItMaga
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-unused-emit-declarations')
const {
  getTypeScriptFixtureTestOptions
} = require('../../test-utils/typescript')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-unused-emit-declarations', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          emits: ['count', 'foo'],
          methods: {
              setCount () {
                  this.$emit('count', newCount)
              },
              setFoo () {
                  this.$emit('foo', newFoo)
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
        emits: ['foo'],
        methods: {
          click () {
            const vm = this
            vm?.$emit?.('foo')
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
        <button @click="$emit('bar')">Bar</button>
      </template>
      <script>
        export default {
          emits: ['foo', 'bar'],
          methods: {
              setFoo () {
                  this.$emit('foo', newFoo)
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
        <button @click="this.$emit('bar')">Bar</button>
      </template>
      <script>
        export default {
          emits: ['bar'],
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="$emit('bar')">Bar</button>
      </template>
      <script setup>
        const emit = defineEmits(['foo', 'bar'])
        const setFoo = () => {
          emit('foo', newFoo)
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="emits('bar')">Bar</button>
      </template>
      <script setup>
        const emits = defineEmits(['bar'])
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          emits: ['foo'],
          setup(_, { emit }) {
            const setFoo = () => {
              emit('foo', newFoo)
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
          emits: ['foo'],
          setup(_, { emit: customName }) {
            const setFoo = () => customName('foo')
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
          emits: { foo: null },
          setup(_, { emit }) {
            const setFoo = () => {
              emit('foo', newFoo)
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
          setup(_, { emit }) {
            const setFoo = () => {
              emit('foo', newFoo)
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
        <button @click="$emit('bar')">Bar</button>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          emits: ['foo'],
          setup(_, context) {
            const setFoo = () => {
              context.emit('foo', newFoo)
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
          emits: ['foo'],
          setup(_, { emit }) {
            useCustomComposable(emit)
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
          emits: ['foo'],
          setup(_, context) {
            useCustomComposable(context.emit)
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
          emits: ['foo'],
          setup(_, { emit }) {
            useCustomComposable([emit])
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
          emits: ['foo'],
          setup(_, context) {
            useCustomComposable([context.emit])
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
          emits: ['foo'],
          setup(_, context) {
            useCustomComposable({ emit: context.emit })
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
          emits: [...foo],
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        const emits = ['foo'];
        export default {
          emits: [...emits],
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        const emits = ['foo'];
        export default {
          emits: emits,
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          emits: ['foo'],
          setup(_, { emit }) {
            useCustomComposable({ emit: emit })
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
          emits: ['foo', 'bar'],
          setup(_, { emit }) {
            const emitBar = () => {
              emit('bar', newBar)
            }
          },
          methods: {
            setFoo() {
              this.$emit('foo', newFoo)
            }
          }
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineEmits(...foo)
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const emits = ['foo'];
        defineEmits([...emits])
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{
        (e: 'foo'): void
      }>()
      const change = () => emit('foo');
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{
        foo: [string, number]
      }>()
      const change = () => emit('foo');
      `,
      ...getTypeScriptFixtureTestOptions()
    },
    {
      // defineModel
      filename: 'test.vue',
      code: `
      <script setup>
      defineEmits({'update:foo'() {}})
      const m = defineModel('foo')
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          emits: ['foo'],
          setup(_, ctx) {
            return () => h('button', { onClick: () => ctx.emit('foo') })
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
          emits: ['foo', 'count'],
          methods: {
            setFoo () {
              this.$emit('foo', newFoo)
            }
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 4,
          column: 26,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: ['foo', 'bar'],
        methods: {
          click () {
            const vm = this
            vm?.$emit?.('foo')
          }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 4,
          column: 24,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="$emit('bar')">Foo</button>
      </template>
      <script>
        export default {
          emits: ['foo', 'bar'],
        }
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 7,
          column: 19,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          emits: { foo: null },
        }
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 4,
          column: 20,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="$emit('bar')">Bar</button>
      </template>
      <script setup>
        const emit = defineEmits(['foo', 'bar'])
      `,
      errors: [
        {
          messageId: 'unused',
          line: 6,
          column: 35,
          endColumn: 40
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="emit('bar')">Bar</button>
      </template>
      <script setup>
        const emit = defineEmits(['foo', 'bar'])
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 6,
          column: 35,
          endColumn: 40
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          emits: ['foo'],
          methods: {
              setFoo () {
                  custom.$emit('foo', newFoo)
              }
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 4,
          column: 19,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          emits: ['foo', 'bar'],
          setup(_, { emit }) {
            const setFoo = () => {
              emit('foo', newFoo)
            }
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 4,
          column: 26,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="$emit('bar')">Bar</button>
      </template>
      <script>
        // @vue/component
        const Foo = {
          emits: ['foo', 'bar'],
        }
        export default Foo
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 8,
          column: 19,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          emits: ['foo', 'bar'],
          setup(_, { emit: customName }) {
            const setFoo = () => customName('foo')
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 4,
          column: 26,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          emits: ['foo'],
          setup() {
            const setFoo = () => foo.$emit('foo')
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 4,
          column: 19,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          emits: ['foo', 'bar'],
          setup(_, context) {
            const setFoo = () => {
              context.emit('foo', newFoo)
            }
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 4,
          column: 26,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          emits: ['foo', 'bar', 'baz'],
          setup(_, { emit }) {
            const emitBar = () => {
              emit('bar', newBar)
            }
          },
          methods: {
            setFoo() {
              this.$emit('foo', newFoo)
            }
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 4,
          endLine: 4,
          column: 33,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
        const emit = defineEmits<{
          (e: 'foo' | 'bar'): void;
        }>()
        const change = () => emit('foo');
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'unused',
          line: 4,
          column: 11,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        const emits = ['foo'];
        defineEmits(emits)
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 3,
          column: 24,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
        defineEmits<{(e: 'foo'): void}>()
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'unused',
          line: 3,
          column: 22,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{
        foo: [string, number],
        bar: []
      }>()
      const change = () => emit('foo');
      `,
      errors: [
        {
          messageId: 'unused',
          line: 5,
          column: 9,
          endColumn: 16
        }
      ],
      ...getTypeScriptFixtureTestOptions()
    },
    {
      // defineModel
      filename: 'test.vue',
      code: `
      <script setup>
      defineEmits({'update:foo'() {}})
      defineModel('foo')
      </script>
      `,
      errors: [
        {
          message: '`update:foo` is defined as emit but never used.',
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          emits: ['foo'],
          setup(_, ctx) {
            return () => h('button')
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'unused',
          line: 4,
          column: 19,
          endColumn: 24
        }
      ]
    }
  ]
})
