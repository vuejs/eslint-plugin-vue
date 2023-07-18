/**
 * @fileoverview Don&#39;t introduce side effects in computed properties
 * @author Michał Sajnóg
 */
'use strict'

const rule = require('../../../lib/rules/no-side-effects-in-computed-properties')
const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2020,
  sourceType: 'module'
}

const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions
})

ruleTester.run('no-side-effects-in-computed-properties', rule, {
  valid: [
    `
      Vue.component('test', {
        ...foo,
        computed: {
          ...test0({}),
          test1() {
            return this.firstName + ' ' + this.lastName
          },
          test2() {
            return this.something.slice(0).reverse()
          },
          test3() {
            const example = this.something * 2
            return example + 'test'
          },
          test4() {
            return {
              ...this.something,
              test: 'example'
            }
          },
          test5: {
            get() {
              return this.firstName + ' ' + this.lastName
            },
            set(newValue) {
              const names = newValue.split(' ')
              this.firstName = names[0]
              this.lastName = names[names.length - 1]
            }
          },
          test6: {
            get() {
              return this.something.slice(0).reverse()
            }
          },
          test7: {
            get() {
              const example = this.something * 2
              return example + 'test'
            }
          },
          test8: {
            get() {
              return {
                ...this.something,
                test: 'example'
              }
            }
          },
          test9() {
            return Object.keys(this.a).sort()
          },
          test10: {
            get() {
              return Object.keys(this.a).sort()
            }
          },
          test11() {
            const categories = {}

            this.types.forEach(c => {
              categories[c.category] = categories[c.category] || []
              categories[c.category].push(c)
            })

            return categories
          },
          test12() {
            return this.types.map(t => {
              // [].push('xxx')
              return t
            })
          },
          test13 () {
            this.someArray.forEach(arr => console.log(arr))
          }
        }
      })
    `,
    `
      Vue.component('test', {
        computed: {
          ...mapGetters(['example']),
          test1() {
            const num = 0
            const something = {
              a: 'val',
              b: ['1', '2']
            }
            num++
            something.a = 'something'
            something.b.reverse()
            return something.b
          }
        }
      })
    `,
    `
      Vue.component('test', {
        name: 'something',
        data() {
          return {}
        }
      })
    `,
    `
      Vue.component('test', {
        computed: {
          test () {
            let a;
            a = this.something
            return a
          },
        }
      })
    `,
    `
      Vue.component('test', {
        computed: {
          test () {
            return {
              action1() {
                this.something++
              },
              action2() {
                this.something = 1
              },
              action3() {
                this.something.reverse()
              }
            }
          },
        }
      })
    `,
    `
      Vue.component('test', {
        computed: {
          test () {
            return this.something['a']().reverse()
          },
        }
      })
    `,
    `
      const test = { el: '#app' }
        Vue.component('test', {
        el: test.el
      })
    `,
    `
      Vue.component('test', {
        computed: {
          test () {
            return [...this.items].reverse()
          },
        }
      })
    `,
    {
      filename: 'test.vue',
      code: `
      <script>
      import { computed } from 'vue'
      const utils = {}
      export default {
        setup() {
          const foo = useFoo()
          function bar () {}
          class Baz {}

          const test0 = computed(test0f)
          const test1 = computed(() => foo.firstName + ' ' + foo.lastName)
          const test2 = computed(() => foo.something.slice(0).reverse())
          const test3 = computed(() => {
            return {
              ...foo.something,
              test: 'example'
            }
          })
          const test5 = computed({
            get: () => foo.firstName + ' ' + foo.lastName,
            set: newValue => {
              const names = newValue.split(' ')
              foo.firstName = names[0]
              foo.lastName = names[names.length - 1]
            }
          })
          const test6 = computed({
            get: () => foo.something.slice(0).reverse()
          })
          const test7 = computed({
            get: () => {
              const example = foo.something * 2
              return example + 'test'
            }
          })
          const test8 = computed({
            get: () => {
              return {
                ...foo.something,
                test: 'example'
              }
            }
          })
          const test9 = computed(() => Object.keys(foo.a).sort())
          const test10 = computed({
            get: () => Object.keys(foo.a).sort()
          })
          const test11 = computed(() => {
            const categories = {}

            foo.types.forEach(c => {
              categories[c.category] = categories[c.category] || []
              categories[c.category].push(c)
            })

            return categories
          })
          const test12 = computed(() => {
            return foo.types.map(t => {
              // [].push('xxx')
              return t
            })
          })
          const test13 = computed(() => {
            foo.someArray.forEach(arr => console.log(arr))
          })
          const test14 = computed(() => bar.name)
          const test15 = computed(() => Baz.name)
          const test16 = computed(() => {
            function b () {}
            b.name = 'c'
          })
          const test17 = computed(() => {
            class C {}
            C.name = 'D'
          })
          const test18 = computed(() => (console.log('a'), true))
          const test19 = computed(() => utils.reverse(foo.array))
        }
      }
      </script>`
    }
  ],
  invalid: [
    {
      code: `Vue.component('test', {
        computed: {
          test1() {
            this.firstName = 'lorem'
            asd.qwe.zxc = 'lorem'
            return this.firstName + ' ' + this.lastName
          },
          test2() {
            this.count += 2;
            this.count++;
            return this.count;
          },
          test3() {
            return this.something.reverse()
          },
          test4() {
            const test = this.another.something.push('example')
            return 'something'
          },
          test5() {
            this.something[index] = thing[index]
            return this.something
          },
          test6() {
            return this.something.keys.sort()
          }
        }
      })`,
      errors: [
        {
          line: 4,
          message: 'Unexpected side effect in "test1" computed property.'
        },
        {
          line: 9,
          message: 'Unexpected side effect in "test2" computed property.'
        },
        {
          line: 10,
          message: 'Unexpected side effect in "test2" computed property.'
        },
        {
          line: 14,
          message: 'Unexpected side effect in "test3" computed property.'
        },
        {
          line: 17,
          message: 'Unexpected side effect in "test4" computed property.'
        },
        {
          line: 21,
          message: 'Unexpected side effect in "test5" computed property.'
        },
        {
          line: 25,
          message: 'Unexpected side effect in "test6" computed property.'
        }
      ]
    },
    {
      code: `Vue.component('test', {
        computed: {
          test1: {
            get() {
              this.firstName = 'lorem'
              return this.firstName + ' ' + this.lastName
            }
          },
          test2: {
            get() {
              this.count += 2;
              this.count++;
              return this.count;
            }
          },
          test3: {
            get() {
              return this.something.reverse()
            }
          },
          test4: {
            get() {
              const test = this.another.something.push('example')
              return 'something'
            },
            set(newValue) {
              this.something = newValue
            }
          },
        }
      })`,
      errors: [
        {
          line: 5,
          message: 'Unexpected side effect in "test1" computed property.'
        },
        {
          line: 11,
          message: 'Unexpected side effect in "test2" computed property.'
        },
        {
          line: 12,
          message: 'Unexpected side effect in "test2" computed property.'
        },
        {
          line: 18,
          message: 'Unexpected side effect in "test3" computed property.'
        },
        {
          line: 23,
          message: 'Unexpected side effect in "test4" computed property.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default Vue.extend({
          computed: {
            test1() : string {
              return this.something.reverse()
            }
          }
        });
      `,
      parser: require.resolve('@typescript-eslint/parser'),
      errors: [
        {
          line: 5,
          message: 'Unexpected side effect in "test1" computed property.'
        }
      ]
    },

    {
      code: `app.component('test', {
        computed: {
          test1() {
            this.firstName = 'lorem'
            asd.qwe.zxc = 'lorem'
            return this.firstName + ' ' + this.lastName
          },
        }
      })`,
      errors: [
        {
          line: 4,
          message: 'Unexpected side effect in "test1" computed property.'
        }
      ]
    },
    {
      code: `Vue.component('test', {
        computed: {
          test1() {
            return this?.something?.reverse?.()
          },
          test2() {
            return (this?.something)?.reverse?.()
          },
          test3() {
            return (this?.something?.reverse)?.()
          },
        }
      })`,
      errors: [
        'Unexpected side effect in "test1" computed property.',
        'Unexpected side effect in "test2" computed property.',
        'Unexpected side effect in "test3" computed property.'
      ]
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1744
      code: `app.component('test', {
        computed: {
          fooBar() {
            this.$set(this, 'foo', 'lorem');
            Vue.set(this, 'bar', 'ipsum');
            return this.foo + ' ' + this.bar
          },
        }
      })`,
      errors: [
        {
          line: 4,
          message: 'Unexpected side effect in "fooBar" computed property.'
        },
        {
          line: 5,
          message: 'Unexpected side effect in "fooBar" computed property.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import {ref, computed} from 'vue'
      export default {
        setup() {
          const foo = useFoo()
          const asd = { qwe: {} }
          function a () {}
          class A {}

          const test1 = computed(() => {
            foo.firstName = 'lorem'
            asd.qwe.zxc = 'lorem'
            return foo.firstName + ' ' + foo.lastName
          })
          const test2 = computed(() => {
            foo.count += 2;
            foo.count++;
            return foo.count;
          })
          const test3 = computed(() => foo.something.reverse())
          const test4 = computed(() => {
            const test = foo.another.something.push('example')
            return 'something'
          })
          const test5 = computed(() => {
            foo.something[index] = foo.thing[index]
            return foo.something
          })
          const test6 = computed(() => foo.something.keys.sort())
          const test7 = computed({
            get() {
              return foo.something.reverse()
            }
          })
          const test8 = computed(() => {
            a.name = ''
          })
          const test9 = computed(() => {
            A.name = ''
          })
          const test10 = computed(() => (foo.a = '', true))

          const test100 = computed(() => {
            const a = foo
            a.count++ // false negative
          })
        }
      }
      </script>
      `,
      errors: [
        {
          line: 12,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 13,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 17,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 18,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 21,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 23,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 27,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 30,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 33,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 37,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 40,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 42,
          message: 'Unexpected side effect in computed function.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import {reactive, computed} from 'vue'
      export default {
        setup() {
          const arr = reactive([])

          const test1 = computed(() => arr.reverse())
        }
      }
      </script>
      `,
      errors: [
        {
          line: 8,
          message: 'Unexpected side effect in computed function.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import {ref, computed} from 'vue'
      export default {
        setup() {
          const foo = useFoo()

          const test1 = computed(() => foo.something.reverse())
        }
      }
      </script>
      `,
      errors: [
        {
          line: 8,
          message: 'Unexpected side effect in computed function.'
        }
      ]
    },

    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {ref, computed} from 'vue'
      const foo = useFoo()
      const asd = { qwe: {} }
      function a () {}
      class A {}

      const test1 = computed(() => {
        foo.firstName = 'lorem'
        asd.qwe.zxc = 'lorem'
        return foo.firstName + ' ' + foo.lastName
      })
      const test2 = computed(() => {
        foo.count += 2;
        foo.count++;
        return foo.count;
      })
      const test3 = computed(() => foo.something.reverse())
      const test4 = computed(() => {
        const test = foo.another.something.push('example')
        return 'something'
      })
      const test5 = computed(() => {
        foo.something[index] = foo.thing[index]
        return foo.something
      })
      const test6 = computed(() => foo.something.keys.sort())
      const test7 = computed({
        get() {
          return foo.something.reverse()
        }
      })
      const test8 = computed(() => {
        a.name = ''
      })
      const test9 = computed(() => {
        A.name = ''
      })
      const test10 = computed(() => (foo.a = '', true))

      const test100 = computed(() => {
        const a = foo
        a.count++ // false negative
      })
      </script>
      `,
      errors: [
        {
          line: 10,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 11,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 15,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 16,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 19,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 21,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 25,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 28,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 31,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 35,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 38,
          message: 'Unexpected side effect in computed function.'
        },
        {
          line: 40,
          message: 'Unexpected side effect in computed function.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {reactive, computed} from 'vue'
      const arr = reactive([])

      const test1 = computed(() => arr.reverse())
      </script>
      `,
      errors: [
        {
          line: 6,
          message: 'Unexpected side effect in computed function.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts" setup>
      import {ref, computed} from 'vue'
      const foo = useFoo()

      const test1 = computed(() => foo.something.reverse())
      </script>
      `,
      errors: [
        {
          line: 6,
          message: 'Unexpected side effect in computed function.'
        }
      ]
    }
  ]
})
