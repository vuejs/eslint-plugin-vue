/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/require-explicit-emits')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('require-explicit-emits', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('welcome')"/>
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
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div @click="$emit('foo')"/>
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
          messageId: 'missing',
          endLine: 3,
          endColumn: 33,
          suggestions: [
            {
              desc:
                'Add the `emits` option with array syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
emits: ['foo']
      }
      </script>
      `
            },
            {
              desc:
                'Add the `emits` option with object syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
emits: {'foo': null}
      }
      </script>
      `
            }
          ]
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
        emits: ['welcome'],
      }
      </script>
      `,
      errors: [
        {
          line: 3,
          column: 28,
          messageId: 'missing',
          endLine: 3,
          endColumn: 33,
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: ['welcome', 'foo'],
      }
      </script>
      `
            }
          ]
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
        emits: {welcome:null}
      }
      </script>
      `,
      errors: [
        {
          line: 3,
          column: 28,
          messageId: 'missing',
          endLine: 3,
          endColumn: 33,
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: {welcome:null, 'foo': null}
      }
      </script>
      `
            }
          ]
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
        emits: {welcome(){}}
      }
      </script>
      `,
      errors: [
        {
          line: 3,
          column: 28,
          messageId: 'missing',
          endLine: 3,
          endColumn: 33,
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: {welcome(){}, 'foo': null}
      }
      </script>
      `
            }
          ]
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
            this.$emit('foo')
          }
        }
      }
      </script>
      `,
      errors: [
        {
          line: 7,
          column: 24,
          messageId: 'missing',
          endLine: 7,
          endColumn: 29,
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <script>
      export default {
        emits: ['welcome', 'foo'],
        methods: {
          onClick() {
            this.$emit('foo')
          }
        }
      }
      </script>
      `
            }
          ]
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
            vm.$emit('foo')
          }
        }
      }
      </script>
      `,
      errors: [
        {
          line: 8,
          column: 22,
          messageId: 'missing',
          endLine: 8,
          endColumn: 27,
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <script>
      export default {
        emits: ['welcome', 'foo'],
        methods: {
          onClick() {
            const vm = this
            vm.$emit('foo')
          }
        }
      }
      </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: ['welcome'],
        setup(p, context) {
          context.emit('foo')
        }
      }
      </script>
      `,
      errors: [
        {
          line: 6,
          column: 24,
          messageId: 'missing',
          endLine: 6,
          endColumn: 29,
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <script>
      export default {
        emits: ['welcome', 'foo'],
        setup(p, context) {
          context.emit('foo')
        }
      }
      </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: ['welcome'],
        setup(p, {emit}) {
          emit('foo')
        }
      }
      </script>
      `,
      errors: [
        {
          line: 6,
          column: 16,
          messageId: 'missing',
          endLine: 6,
          endColumn: 21,
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <script>
      export default {
        emits: ['welcome', 'foo'],
        setup(p, {emit}) {
          emit('foo')
        }
      }
      </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        emits: ['welcome'],
        setup(p, {emit:fire}) {
          fire('foo')
          fire('bar')
        }
      }
      </script>
      `,
      errors: [
        {
          line: 6,
          column: 16,
          messageId: 'missing',
          endLine: 6,
          endColumn: 21,
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <script>
      export default {
        emits: ['welcome', 'foo'],
        setup(p, {emit:fire}) {
          fire('foo')
          fire('bar')
        }
      }
      </script>
      `
            }
          ]
        },
        {
          line: 7,
          column: 16,
          messageId: 'missing',
          endLine: 7,
          endColumn: 21,
          suggestions: [
            {
              desc: 'Add the "bar" to `emits` option.',
              output: `
      <script>
      export default {
        emits: ['welcome', 'bar'],
        setup(p, {emit:fire}) {
          fire('foo')
          fire('bar')
        }
      }
      </script>
      `
            }
          ]
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
      // @vue/component
      const Foo = {}
      export default Foo
      </script>
      `,
      errors: [
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc:
                'Add the `emits` option with array syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      // @vue/component
      const Foo = {
emits: ['foo']
}
      export default Foo
      </script>
      `
            },
            {
              desc:
                'Add the `emits` option with object syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      // @vue/component
      const Foo = {
emits: {'foo': null}
}
      export default Foo
      </script>
      `
            }
          ]
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
      // @vue/component
      const Foo = {emits:{}}
      export default {
        emits: {}
      }
      </script>
      `,
      errors: [
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      // @vue/component
      const Foo = {emits:{}}
      export default {
        emits: {'foo': null}
      }
      </script>
      `
            }
          ]
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
      // @vue/component
      const Foo = {emits: {}}
      export default { emits: {} }
      // @vue/component
      const Bar = {emits: {}}
      </script>
      `,
      errors: [
        {
          line: 3,
          column: 28,
          messageId: 'missing',
          endLine: 3,
          endColumn: 33,
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      // @vue/component
      const Foo = {emits: {}}
      export default { emits: {'foo': null} }
      // @vue/component
      const Bar = {emits: {}}
      </script>
      `
            }
          ]
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
        components: {
          // @vue/component
          Foo: {
            emits: ['foo'],
            setup(p, {emit}) {
              emit('bar')
            }
          }
        },
        emits: ['bar'],
        setup(p, context) {
          context.emit('foo')
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        components: {
          // @vue/component
          Foo: {
            emits: ['foo'],
            setup(p, {emit}) {
              emit('bar')
            }
          }
        },
        emits: ['bar', 'foo'],
        setup(p, context) {
          context.emit('foo')
        }
      }
      </script>
      `
            }
          ]
        },
        {
          message:
            'The "bar" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc: 'Add the "bar" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        components: {
          // @vue/component
          Foo: {
            emits: ['foo', 'bar'],
            setup(p, {emit}) {
              emit('bar')
            }
          }
        },
        emits: ['bar'],
        setup(p, context) {
          context.emit('foo')
        }
      }
      </script>
      `
            }
          ]
        },
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        components: {
          // @vue/component
          Foo: {
            emits: ['foo'],
            setup(p, {emit}) {
              emit('bar')
            }
          }
        },
        emits: ['bar', 'foo'],
        setup(p, context) {
          context.emit('foo')
        }
      }
      </script>
      `
            }
          ]
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
        components: {
          // @vue/component
          Foo: {
            emits: ['foo'],
            methods: {
              onClick() {
                this.$emit('bar')
              }
            }
          }
        },
        emits: ['bar'],
        methods: {
          onClick() {
            this.$emit('foo')
          }
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        components: {
          // @vue/component
          Foo: {
            emits: ['foo'],
            methods: {
              onClick() {
                this.$emit('bar')
              }
            }
          }
        },
        emits: ['bar', 'foo'],
        methods: {
          onClick() {
            this.$emit('foo')
          }
        }
      }
      </script>
      `
            }
          ]
        },
        {
          message:
            'The "bar" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc: 'Add the "bar" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        components: {
          // @vue/component
          Foo: {
            emits: ['foo', 'bar'],
            methods: {
              onClick() {
                this.$emit('bar')
              }
            }
          }
        },
        emits: ['bar'],
        methods: {
          onClick() {
            this.$emit('foo')
          }
        }
      }
      </script>
      `
            }
          ]
        },
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        components: {
          // @vue/component
          Foo: {
            emits: ['foo'],
            methods: {
              onClick() {
                this.$emit('bar')
              }
            }
          }
        },
        emits: ['bar', 'foo'],
        methods: {
          onClick() {
            this.$emit('foo')
          }
        }
      }
      </script>
      `
            }
          ]
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
        emits: {...foo}
      }
      </script>
      `,
      errors: [
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: {'foo': null,...foo}
      }
      </script>
      `
            }
          ]
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
        emits: []
      }
      </script>
      `,
      errors: [
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: ['foo']
      }
      </script>
      `
            }
          ]
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
        emits: [...foo]
      }
      </script>
      `,
      errors: [
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc: 'Add the "foo" to `emits` option.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        emits: ['foo',...foo]
      }
      </script>
      `
            }
          ]
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
        emits: foo
      }
      </script>
      `,
      errors: [
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: []
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
        name: '',
        props: {}
      }
      </script>
      `,
      errors: [
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc:
                'Add the `emits` option with array syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        name: '',
        props: {},
emits: ['foo']
      }
      </script>
      `
            },
            {
              desc:
                'Add the `emits` option with object syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        name: '',
        props: {},
emits: {'foo': null}
      }
      </script>
      `
            }
          ]
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
        name: '',
        watch: {}
      }
      </script>
      `,
      errors: [
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc:
                'Add the `emits` option with array syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        name: '',
emits: ['foo'],
        watch: {}
      }
      </script>
      `
            },
            {
              desc:
                'Add the `emits` option with object syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        name: '',
emits: {'foo': null},
        watch: {}
      }
      </script>
      `
            }
          ]
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
        name: '',
      }
      </script>
      `,
      errors: [
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc:
                'Add the `emits` option with array syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        name: '',
emits: ['foo'],
      }
      </script>
      `
            },
            {
              desc:
                'Add the `emits` option with object syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        name: '',
emits: {'foo': null},
      }
      </script>
      `
            }
          ]
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
        name: ''
      }
      </script>
      `,
      errors: [
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc:
                'Add the `emits` option with array syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        name: '',
emits: ['foo']
      }
      </script>
      `
            },
            {
              desc:
                'Add the `emits` option with object syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        name: '',
emits: {'foo': null}
      }
      </script>
      `
            }
          ]
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
        ...foo
      }
      </script>
      `,
      errors: [
        {
          message:
            'The "foo" event has been triggered but not declared on `emits` option.',
          suggestions: [
            {
              desc:
                'Add the `emits` option with array syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        ...foo,
emits: ['foo']
      }
      </script>
      `
            },
            {
              desc:
                'Add the `emits` option with object syntax and define "foo" event.',
              output: `
      <template>
        <div @click="$emit('foo')"/>
      </template>
      <script>
      export default {
        ...foo,
emits: {'foo': null}
      }
      </script>
      `
            }
          ]
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
            vm?.$emit?.('foo')
            ;(vm?.$emit)?.('bar')
          }
        }
      }
      </script>
      `,
      errors: [
        'The "foo" event has been triggered but not declared on `emits` option.',
        'The "bar" event has been triggered but not declared on `emits` option.'
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        setup(p, c) {
          c?.emit?.('foo')
          ;(c?.emit)?.('bar')
        }
      }
      </script>
      `,
      errors: [
        'The "foo" event has been triggered but not declared on `emits` option.',
        'The "bar" event has been triggered but not declared on `emits` option.'
      ]
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
        props: ['foo'],
        methods: {
          fn() { this.$emit('foo') }
        },
        setup(p, ctx) {
          ctx.emit('foo')
        }
      }
      </script>
      `,
      options: [{ allowProps: true }],
      errors: [
        {
          line: 3,
          messageId: 'missing'
        },
        {
          line: 9,
          messageId: 'missing'
        },
        {
          line: 12,
          messageId: 'missing'
        }
      ]
    }
  ]
})
