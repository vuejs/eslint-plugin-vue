/**
 * @fileoverview Prevents duplication of field names.
 * @author Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-dupe-keys')
const RuleTester = require('eslint').RuleTester

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

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
          message: "Duplicated key 'foo'.",
          line: 5
        },
        {
          message: "Duplicated key 'foo'.",
          line: 10
        },
        {
          message: "Duplicated key 'foo'.",
          line: 14
        },
        {
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'foo'.",
          line: 5
        },
        {
          message: "Duplicated key 'foo'.",
          line: 10
        },
        {
          message: "Duplicated key 'foo'.",
          line: 14
        },
        {
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'foo'.",
          line: 5
        },
        {
          message: "Duplicated key 'foo'.",
          line: 9
        },
        {
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'foo'.",
          line: 7
        },
        {
          message: "Duplicated key 'foo'.",
          line: 13
        },
        {
          message: "Duplicated key 'foo'.",
          line: 16
        },
        {
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'bar'.",
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
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'bar'.",
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
          message: "Duplicated key 'bar'.",
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
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'foo'.",
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
          message: "Duplicated key 'foo'.",
          line: 7
        }
      ]
    }
  ]
})
