/**
 * @fileoverview Prevents duplication of field names.
 * @author Armano
 */
'use strict'

const rule = require('../../../lib/rules/no-dupe-keys')
const RuleTester = require('../../eslint-compat').RuleTester
const {
  getTypeScriptFixtureTestOptions
} = require('../../test-utils/typescript')

const ruleTester = new RuleTester({
  languageOptions: {
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
      languageOptions: { parser: require('vue-eslint-parser') }
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps(['foo', 'bar'])
      const { foo, bar } = props
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') }
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
      languageOptions: { parser: require('vue-eslint-parser') }
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
      languageOptions: { parser: require('vue-eslint-parser') }
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
      languageOptions: { parser: require('vue-eslint-parser') }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const {foo,bar} = defineProps(['foo', 'bar'])
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const {foo=42,bar='abc'} = defineProps(['foo', 'bar'])
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') }
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const { foo: renamedFoo, bar: renamedBar } = defineProps(['foo', 'bar'])
      const foo = 42
      const bar = 'hello'
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') }
    },
    {
      code: `
      <script setup lang="ts">
      import {Props2 as Props} from './test01'

      defineProps<Props>()

      const bar = computed(() => {
        return "hello";
      });
      </script>
      `,
      ...getTypeScriptFixtureTestOptions()
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
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 16
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 10,
          column: 15,
          endLine: 10,
          endColumn: 18
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 14,
          column: 13,
          endLine: 14,
          endColumn: 16
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 21,
          column: 15,
          endLine: 21,
          endColumn: 18
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
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 16
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 10,
          column: 15,
          endLine: 10,
          endColumn: 18
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 14,
          column: 13,
          endLine: 14,
          endColumn: 16
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 21,
          column: 15,
          endLine: 21,
          endColumn: 18
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
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 16
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 16
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 12,
          column: 13,
          endLine: 12,
          endColumn: 16
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
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 16
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 13,
          column: 13,
          endLine: 13,
          endColumn: 16
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 16,
          column: 13,
          endLine: 16,
          endColumn: 16
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 23,
          column: 15,
          endLine: 23,
          endColumn: 18
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
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 16
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
          line: 12,
          column: 15,
          endLine: 12,
          endColumn: 18
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
          line: 10,
          column: 15,
          endLine: 10,
          endColumn: 18
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
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 16
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
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 16
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
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 16
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
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 16
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
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 16
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
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 16
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
          line: 6,
          column: 17,
          endLine: 6,
          endColumn: 20
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
          line: 7,
          column: 17,
          endLine: 7,
          endColumn: 20
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
          line: 6,
          column: 17,
          endLine: 6,
          endColumn: 20
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
          line: 7,
          column: 17,
          endLine: 7,
          endColumn: 20
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
          line: 7,
          column: 17,
          endLine: 7,
          endColumn: 20
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
      languageOptions: { parser: require('vue-eslint-parser') },
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 6,
          column: 15,
          endLine: 6,
          endColumn: 22
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
      languageOptions: { parser: require('vue-eslint-parser') },
      errors: [
        {
          message:
            "Duplicate key 'baz'. May cause name collision in script or template tag.",
          line: 4,
          column: 16,
          endLine: 4,
          endColumn: 19
        },
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 12,
          column: 9,
          endLine: 14,
          endColumn: 10
        },
        {
          message:
            "Duplicate key 'bar'. May cause name collision in script or template tag.",
          line: 15,
          column: 15,
          endLine: 15,
          endColumn: 32
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
      languageOptions: {
        parser: require('vue-eslint-parser'),
        parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
      },
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 8,
          column: 13,
          endLine: 8,
          endColumn: 24
        },
        {
          message:
            "Duplicate key 'bar'. May cause name collision in script or template tag.",
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 24
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
      languageOptions: { parser: require('vue-eslint-parser') },
      errors: [
        {
          message:
            "Duplicate key 'bar'. May cause name collision in script or template tag.",
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const { foo: renamedFoo } = defineProps(['foo', 'bar'])
      const foo = 'foo'
      const bar = 'bar'
      </script>
      `,
      languageOptions: { parser: require('vue-eslint-parser') },
      errors: [
        {
          message:
            "Duplicate key 'bar'. May cause name collision in script or template tag.",
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 24
        }
      ]
    },
    {
      code: `
      <script setup lang="ts">
      import {Props1 as Props} from './test01'

      defineProps<Props>()

      const foo = computed(() => {
        return "hello";
      });
      </script>
      `,
      errors: [
        {
          message:
            "Duplicate key 'foo'. May cause name collision in script or template tag.",
          line: 7,
          column: 13,
          endLine: 9,
          endColumn: 9
        }
      ],
      ...getTypeScriptFixtureTestOptions()
    }
  ]
})
