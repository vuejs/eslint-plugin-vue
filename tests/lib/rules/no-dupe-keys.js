/**
 * @fileoverview Prevents duplication of field names.
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/no-dupe-keys')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  }
})
ruleTester.run('no-dupe-keys', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['foo'],
          computed: {
            bar () {
            }
          },
          data () {
            return {
              dat: null
            }
          },
          data () {
            return
          },
          methods: {
            _foo () {},
            test () {
            }
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['foo'],
          data () {
            return {
              dat: null
            }
          },
          data () {
            return
          },
          methods: {
            _foo () {},
            test () {
            }
          },
          setup () {
            const _foo = () => {}
            const dat = ref(null)
            const bar = computed(() => 'bar')

            return {
              bar
            }
          }
        }
      `
    },

    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['foo'],
          computed: {
            bar () {
            }
          },
          data: () => {
            return {
              dat: null
            }
          },
          data: () => {
            return
          },
          methods: {
            _foo () {},
            test () {
            }
          }
        }
      `
    },

    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['foo'],
          computed: {
            bar () {
            }
          },
          data: () => ({
            dat: null
          }),
          data: () => {
            return
          },
          methods: {
            _foo () {},
            test () {
            }
          }
        }
      `
    },

    {
      filename: 'test.vue',
      code: `
        export default {
          ...foo(),
          props: {
            ...foo(),
            foo: String
          },
          computed: {
            ...mapGetters({
              test: 'getTest'
            }),
            bar: {
              get () {
              }
            }
          },
          data: {
            ...foo(),
            dat: null
          },
          methods: {
            ...foo(),
            test () {
            }
          },
          data () {
            return {
              ...dat
            }
          },
        }
      `
    },

    {
      filename: 'test.vue',
      code: `
        export default {
          ...foo(),
          props: {
            ...foo(),
            foo: String
          },
          computed: {
            ...mapGetters({
              test: 'getTest'
            }),
            bar: {
              get () {
              }
            }
          },
          data: {
            ...foo(),
            dat: null
          },
          methods: {
            ...foo(),
            test () {
            }
          },
          data () {
            return {
              ...dat
            }
          },
          setup () {
            const com = computed(() => 1)

            return {
              ...foo(),
              com
            }
          }
        }
      `
    },

    {
      filename: 'test.vue',
      code: `
        export default {
          ...foo(),
          props: {
            ...foo(),
            foo: String
          },
          computed: {
            ...mapGetters({
              test: 'getTest'
            }),
            bar: {
              get () {
              }
            }
          },
          data: {
            ...foo(),
            dat: null
          },
          methods: {
            ...foo(),
            test () {
            }
          },
          data: () => {
            return {
              ...dat
            }
          },
        }
      `
    },

    {
      filename: 'test.vue',
      code: `
        export default {
          ...foo(),
          props: {
            ...foo(),
            foo: String
          },
          computed: {
            ...mapGetters({
              test: 'getTest'
            }),
            bar: {
              get () {
              }
            }
          },
          data: {
            ...foo(),
            dat: null
          },
          methods: {
            ...foo(),
            test () {
            }
          },
          data: () => ({
            ...dat
          }),
        }
      `
    },

    {
      filename: 'test.js',
      code: `
        // @vue/component
        export const compA = {
          props: {
            propA: String
          }
        }

        // @vue/component
        export const compB = {
          props: {
            propA: String
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
        // @vue/component
        export const compA = {
          props: {
            propA: String
          },
          setup (props) {
            const com = computed(() => props.propA)

            return {
              com
            }
          }
        }

        // @vue/component
        export const compB = {
          props: {
            propA: String
          },
          setup (props) {
            const com = computed(() => props.propA)

            return {
              com
            }
          }
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        data () {
          return {
            get foo() {
              return foo
            },
            set foo(v) {
              foo = v
            }
          }
        }
      }
      `
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        data () {
          return {
            set foo(v) {
              foo = v
            },
            get foo() {
              return foo
            }
          }
        }
      }
      `
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        data () {
          return {
            get foo() {
              return foo
            },
            bar,
            set foo(v) {
              foo = v
            }
          }
        }
      }
      `
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1687
      filename: 'test.vue',
      code: `
        export default {
          asyncData() {
            return {
              foo: 1
            }
          },
          data() {
            return {
              foo: 2
            }
          },
        }
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineProps({
          foo: String,
        })
        const bar = 0
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
        defineProps<{
          foo: string;
        }>();

        const bar = 0
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps(['foo', 'bar'])
      const { foo, bar } = props
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps(['foo', 'bar'])
      const foo = props.foo
      const bar = props.bar
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {toRefs} from 'vue'
      const props = defineProps(['foo', 'bar'])
      const { foo, bar } = toRefs(props)
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {toRef} from 'vue'
      const props = defineProps(['foo', 'bar'])
      const foo = toRef(props, 'foo')
      const bar = toRef(props, 'bar')
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    {
      filename: 'test.vue',
      code: `
      <script setup></script>
      const {foo,bar} = defineProps(['foo', 'bar'])
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    {
      filename: 'test.vue',
      code: `
      <script setup></script>
      const {foo=42,bar='abc'} = defineProps(['foo', 'bar'])
      </script>
      `,
      parser: require.resolve('vue-eslint-parser')
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = withDefaults(
        defineProps<{
          foo?: string | number
        }>(),
        {
          foo: "Foo",
        }
      );
      const foo = props.foo
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['foo'],
          computed: {
            foo () {
            }
          },
          data () {
            return {
              foo: null
            }
          },
          methods: {
            foo () {
            }
          },
          setup () {
            const foo = ref(1)

            return {
              foo
            }
          }
        }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 5
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 10
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 14
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['foo'],
          computed: {
            foo () {
            }
          },
          data: () => {
            return {
              foo: null
            }
          },
          methods: {
            foo () {
            }
          },
          setup: () => {
            const foo = computed(() => 0)

            return {
              foo
            }
          }
        }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 5
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 10
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 14
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: ['foo'],
          computed: {
            foo () {
            }
          },
          data: () => ({
            foo: null
          }),
          methods: {
            foo () {
            }
          }
        }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 5
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 9
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          props: {
            foo: String
          },
          computed: {
            foo: {
              get () {
              }
            }
          },
          data: {
            foo: null
          },
          methods: {
            foo () {
            }
          },
          setup (props) {
            const foo = computed(() => props.foo)

            return {
              foo
            }
          }
        }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 7
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 13
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 16
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 23
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        new Vue({
          foo: {
            bar: String
          },
          data: {
            bar: null
          },
        })
      `,
      options: [{ groups: ['foo'] }],
      errors: [
        {
          message:
            "Duplicate key 'bar'. May cause name collision in script or template tag.",
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          methods: {
            foo () {
              return 0
            }
          },
          setup () {
            const foo = () => 0

            return {
              foo
            }
          }
        }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          methods: {
            foo () {
              return 0
            }
          },
          setup () {
            return {
              foo: () => 0
            }
          }
        }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 10
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          methods: {
            foo () {
              return 0
            }
          },
          setup: () => ({
            foo: () => 0
          })
        }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo () {
              return 0
            }
          },
          setup: () => ({
            foo: computed(() => 0)
          })
        }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data() {
            return {
              foo: 0
            }
          },
          setup: () => ({
            foo: ref(0)
          })
        }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          data() {
            return {
              foo: 0
            }
          },
          setup: () => ({
            foo: 0
          })
        }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 9
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        defineComponent({
          foo: {
            bar: String
          },
          data: {
            bar: null
          },
        })
      `,
      options: [{ groups: ['foo'] }],
      errors: [
        {
          message:
            "Duplicate key 'bar'. May cause name collision in script or template tag.",
          line: 7
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        export default defineComponent({
          foo: {
            bar: String
          },
          data: {
            bar: null
          },
        })
      `,
      options: [{ groups: ['foo'] }],
      errors: [
        {
          message:
            "Duplicate key 'bar'. May cause name collision in script or template tag.",
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        props: ['foo'],
        data () {
          return {
            get foo() {
              return foo
            },
            set foo(v) {
              foo = v
            }
          }
        }
      }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        props: ['foo'],
        data () {
          return {
            set foo(v) {},
            get foo() {}
          }
        }
      }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        props: ['foo'],
        data () {
          return {
            set foo(v) {}
          }
        }
      }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        data () {
          return {
            get foo() {},
            set foo(v) {},
            get foo() {},
          }
        }
      }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        data () {
          return {
            get foo() {},
            set foo(v) {},
            set foo(v) {},
          }
        }
      }
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        defineProps({
          foo: String,
        })
        const foo = 0
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
        import { Foo } from './Foo.vue';
        import baz from './baz';

        defineProps({
          foo: String,
          bar: String,
          baz: String,
        });

        function foo() {
          const baz = 'baz';
        }
        const bar = () => 'bar';
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      errors: [
        {
          message:
            "Duplicate key 'baz'. May cause name collision in script or template tag.",
          line: 4
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 12
        },
        {
          message:
            "Duplicate key 'bar'. May cause name collision in script or template tag.",
          line: 15
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      defineProps<{
        foo: string;
        bar: string;
      }>();

      const foo = 'foo';
      const bar = 'bar';
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      parserOptions: { parser: require.resolve('@typescript-eslint/parser') },
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 8
        },
        {
          message:
            "Duplicate key 'bar'. May cause name collision in script or template tag.",
          line: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps(['foo', 'bar'])
      const { foo } = props
      const bar = 42
      </script>
      `,
      parser: require.resolve('vue-eslint-parser'),
      errors: [
        {
          message:
            "Duplicate key 'bar'. May cause name collision in script or template tag.",
          line: 5
        }
      ]
    }
  ]
})
