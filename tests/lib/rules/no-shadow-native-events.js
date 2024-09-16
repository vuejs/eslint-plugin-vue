/**
 * @author Jonathan Carle
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-shadow-native-events')
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

tester.run('no-shadow-native-events', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('buttonClick')"/>
      </template>
      <script>
      export default {
        emits: ['inputClick']
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('welcome')"/>
      </template>
      <script>
      export default {
        emits: {welcome:null}
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('welcome')"/>
      </template>
      <script>
      export default {
        emits: {welcome(){}}
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: ['welcome'],
        methods: {
          onClick() {
            this.$emit('welcome')
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
        emits: ['welcome'],
        methods: {
          onClick() {
            const vm = this
            vm.$emit('welcome')
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
        emits: ['welcome'],
        setup(p, context) {
          context.emit('welcome')
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
        emits: ['welcome'],
        setup(p, {emit}) {
          emit('welcome')
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
        emits: ['welcome'],
        setup(props, context) {
          context.emit = 'foo'
          context='foo'
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
        emits: ['welcome'],
        setup(props, {emit}) {
          emit='foo'
        }
      }
      </script>
      `
    },
    // quoted
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('welcome')"/>
      </template>
      <script>
      export default {
        'emits': ['welcome']
      }
      </script>
      `
    },
    // unknown
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="emit('foo')"/>
      </template>
      <script>
      export default {
        emits: ['welcome']
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: ['welcome'],
        methods: {
          onClick() {
            $emit('foo')
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
        emits: ['welcome'],
        methods: {
          onClick() {
            this.bar.$emit('foo')
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
        emits: ['welcome'],
        setup(p, ...context) {
          context.emit('foo')
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
        emits: ['welcome'],
        setup(p, [emit]) {
          emit('foo')
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
        emits: ['welcome'],
        setup(p, {$emit}) {
          $emit('foo')
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
        emits: ['welcome'],
        setup(context) {
          context.emit('foo')
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit(foo)"/>
        <div @click="$emit()"/>
        <div @click="$emit(1)"/>
        <div @click="$emit(true)"/>
        <div @click="$emit(null)"/>
        <div @click="$emit(/regex/)"/>
      </template>
      <script>
      export default {
        emits: ['welcome']
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: ['welcome'],
        setup(p, context) {
          context.emit(foo)
          context.emit()
          context.emit(1)
          context.emit(true)
          context.emit(null)
          context.emit(/regex/)
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
        emits: ['welcome'],
        methods: {
          onClick() {
            this.$emit(foo)
            this.$emit()
            this.$emit(1)
            this.$emit(true)
            this.$emit(null)
            this.$emit(/regex/)
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
        emits: ['welcome'],
        setup(p, context) {
          context.fire('foo')
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
        emits: ['welcome'],
        methods: {
          onClick() {
            this.$fire('foo')
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
      function fn() {
        this.$emit('foo')
      }
      export default {
        emits: ['welcome'],
        methods: {
          onClick() {
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
        emits: ['welcome'],
        setup: ((p, context) => {
          context.emit('foo')
        })()
      }
      </script>
      `
    },
    // allowProps
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        props: ['onFoo'],
        methods: {
          fn() { this.$emit('foo') }
        },
        setup(p, ctx) {
          ctx.emit('foo')
        }
      }
      </script>
      `,
      options: [{ allowProps: true }]
    },

    // <script setup>
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script setup>
      defineEmits(['foo'])
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script setup>
      defineEmits({foo:null})
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script setup lang="ts">
      defineEmits<{
        (e: 'foo'): void
      }>()
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script setup lang="ts">
      defineEmits<(e: 'foo') => void>()
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
        <div @click="$emit('bar')"/>
      </template>
      <script setup lang="ts">
      defineEmits<(e: 'foo' | 'bar') => void>()
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="emit('foo')"/>
        <div @click="emit('bar')"/>
      </template>
      <script setup lang="ts">
      const emit = defineEmits<(e: 'foo' | 'bar') => void>()
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },

    // unknown emits definition
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: unknown,
        setup(_, {emit}) {
          emit('bar')
        },
        methods: {
          click() {
            this.$emit('baz')
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
        <div @click="$emit('foo')"/>
      </template>
      <script setup>
      const emit = defineEmits(unknown)
      emit('bar')
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: {...foo}
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: [foo]
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: [...foo]
      }
      </script>
      `
    },

    // unknown props definition
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        props: unknown,
        methods: {
          fn() { this.$emit('bar') }
        },
        setup(p, ctx) {
          ctx.emit('baz')
        }
      }
      </script>
      `,
      options: [{ allowProps: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script setup>
      defineProps(unknown)
      </script>
      `,
      options: [{ allowProps: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        props: [foo],
      }
      </script>
      `,
      options: [{ allowProps: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        props: [...foo],
      }
      </script>
      `,
      options: [{ allowProps: true }]
    },
    {
      // new syntax in Vue 3.3
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{foo: [], bar:[number]}>()
      emit('foo')
      emit('bar', 42)
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      // new syntax in Vue 3.3
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      type Emits = {foo: [], bar:[number]}
      const emit = defineEmits<Emits>()
      emit('foo')
      emit('bar', 42)
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      code: `
      <script setup lang="ts">
      import {Emits1 as Emits} from './test01'
      const emit = defineEmits<Emits>()
      emit('foo')
      emit('bar')
      emit('baz')
      </script>`,
      ...getTypeScriptFixtureTestOptions()
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('click')"/>
      </template>
      <script>
      export default {
      }
      </script>
      `,
      errors: [
        {
          line: 3,
          column: 28,
          messageId: 'violation',
          endLine: 3,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: ['click'],
      }
      </script>
      `,
      errors: [
        {
          line: 7,
          column: 17,
          messageId: 'violation',
          endLine: 7,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: {click(){}}
      }
      </script>
      `,
      errors: [
        {
          line: 7,
          column: 17,
          messageId: 'violation',
          endLine: 7,
          endColumn: 26
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          onClick() {
            this.$emit('click')
          }
        }
      }
      </script>
      `,
      errors: [
        {
          line: 6,
          column: 24,
          messageId: 'violation',
          endLine: 6,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: ['welcome'],
        methods: {
          onClick() {
            const vm = this
            vm.$emit('click')
          }
        }
      }
      </script>
      `,
      errors: [
        {
          line: 8,
          column: 22,
          messageId: 'violation',
          endLine: 8,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p, context) {
          context.emit('click')
        }
      }
      </script>
      `,
      errors: [
        {
          line: 5,
          column: 24,
          messageId: 'violation',
          endLine: 5,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p, {emit}) {
          emit('click')
        }
      }
      </script>
      `,
      errors: [
        {
          line: 5,
          column: 16,
          messageId: 'violation',
          endLine: 5,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p, {emit:fire}) {
          fire('click')
          fire('keydown')
        }
      }
      </script>
      `,
      errors: [
        {
          line: 5,
          column: 16,
          messageId: 'violation',
          endLine: 5,
          endColumn: 23
        },
        {
          line: 6,
          column: 16,
          messageId: 'violation',
          endLine: 6,
          endColumn: 25
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          click () {
            const vm = this
            vm?.$emit?.('click')
            ;(vm?.$emit)?.('keydown')
          }
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'violation',
          line: 7,
          column: 25,
          endLine: 7,
          endColumn: 32
        },
        {
          messageId: 'violation',
          line: 8,
          column: 28,
          endLine: 8,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p, c) {
          c?.emit?.('click')
          ;(c?.emit)?.('keydown')
        }
      }
      </script>
      `,
      errors: [
        {
          messageId: 'violation',
          line: 5,
          column: 21,
          endLine: 5,
          endColumn: 28
        },
        {
          messageId: 'violation',
          line: 6,
          column: 24,
          endLine: 6,
          endColumn: 33
        }
      ]
    },
    // <script setup>
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('click')"/>
      </template>
      <script setup>
      defineEmits(['click'])
      </script>
      `,
      errors: [
        {
          messageId: 'violation',
          line: 6,
          column: 20,
          endLine: 6,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('click')"/>
      </template>
      <script setup lang="ts">
      defineEmits<{
        (e: 'click'): void
      }>()
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'violation',
          line: 7,
          column: 9,
          endLine: 7,
          endColumn: 27
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('click')"/>
      </template>
      <script setup lang="ts">
      defineEmits<(e: 'click') => void>()
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'violation',
          line: 6,
          column: 19,
          endLine: 6,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('click')"/>
      </template>
      <script setup>
      </script>
      `,
      errors: [
        {
          messageId: 'violation',
          line: 3,
          column: 28,
          endLine: 3,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<(e: 'click') => void>()
      emit('click');
      emit('keydown')
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'violation',
          line: 3,
          column: 32,
          endLine: 3,
          endColumn: 52
        },
        {
          messageId: 'violation',
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
      const emit = defineEmits([\`click\`])
      emit(\`click\`);
      emit(\`keydown\`)
      </script>
      `,
      errors: [
        {
          messageId: 'violation',
          line: 3,
          column: 33,
          endLine: 3,
          endColumn: 40
        },
        {
          messageId: 'violation',
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 21
        }
      ]
    },
    {
      // new syntax in Vue 3.3
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const emit = defineEmits<{click: []}>()
      emit('foo')
      emit('keydown')
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'violation',
          line: 3,
          column: 33,
          endLine: 3,
          endColumn: 42
        },
        {
          messageId: 'violation',
          line: 5,
          column: 12,
          endLine: 5,
          endColumn: 21
        }
      ]
    },
    {
      // new syntax in Vue 3.3
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      type Emits = {click: []}
      const emit = defineEmits<Emits>()
      emit('click')
      emit('keydown')
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'violation',
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 30
        },
        {
          messageId: 'violation',
          line: 6,
          column: 12,
          endLine: 6,
          endColumn: 21
        }
      ]
    },
    {
      code: `
      <script setup lang="ts">
      import {Emits2 as Emits} from './test01'
      const emit = defineEmits<Emits>()
      </script>`,
      errors: [
        {
          messageId: 'violation',
          line: 4,
          column: 32,
          endLine: 4,
          endColumn: 37
        },
        {
          messageId: 'violation',
          line: 4,
          column: 32,
          endLine: 4,
          endColumn: 37
        }
      ],
      ...getTypeScriptFixtureTestOptions()
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="emit('keydown')"/>
      </template>
      <script setup lang="ts">
      const emit = defineEmits<(e: 'click') => void>()
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          messageId: 'violation',
          line: 3,
          column: 27,
          endLine: 3,
          endColumn: 36
        },
        {
          messageId: 'violation',
          line: 6,
          column: 32,
          endLine: 6,
          endColumn: 52
        }
      ]
    }
  ]
})
