/**
 * @fileoverview Don&#39;t introduce side effects in computed properties
 * @author Michał Sajnóg
 */
import rule from '../../../lib/rules/no-side-effects-in-computed-properties'
import { RuleTester } from '../../eslint-compat'
import vueEslintParser from 'vue-eslint-parser'
import tsEslintParser from '@typescript-eslint/parser'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
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
          const test19 = computed(() => utils.reverse(foo.array))
          const test20 = computed(() => Object.assign({}, foo.data, { extra: 'value' }))
        }
      }
      </script>`
    },
    {
      // calls whose result is used are not side effects
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          test1() {
            return this.$store.getters.foo(this.id)
          },
          test2() {
            const value = this.compute()
            return format(this.fetch(), value)
          },
          test3() {
            return this.items.map((item) => item.id).filter(Boolean)
          },
          test4() {
            return this.a ? this.b() : this.c()
          },
          test5() {
            return this.a && this.b()
          },
          test6() {
            return (() => this.a)()
          },
          test7: {
            get() {
              return this.load()
            },
            set(value) {
              this.save(value)
            }
          }
        },
        methods: {
          test8() {
            this.$router.push('/')
          }
        }
      }
      </script>`
    },
    {
      // calls on variables declared in the getter only change local state
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          test1() {
            const list = []
            list.push(this.a)
            const map = new Map()
            map.set('a', this.b)
            list.filter(Boolean).forEach((x) => map.set(x, x))
            return [list, map]
          },
          test3() {
            const style = {}
            Object.assign(style, this.style, { width: this.width })
            return style
          },
          test2() {
            const add = (x) => x + this.a
            add(1)
            return add
          }
        }
      }
      </script>`
    },
    {
      // nested functions are not checked, and iteration calls only run their callback
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          test1() {
            return this.items.map((item) => {
              log(item)
              return item.id
            })
          },
          test2() {
            const go = () => {
              this.$router.push('/')
            }
            return go
          },
          test3() {
            const result = {}
            this.items.forEach((item) => {
              result[item.id] = item
            })
            return result
          },
          test4() {
            const ids = []
            this.items.map((item) => {
              ids.push(item.id)
            })
            forEach(this.groups, (group) => {
              ids.push(group.id)
            })
            return ids
          }
        }
      }
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { computed } from 'vue'
      const props = defineProps(['a', 'items'])
      const emit = defineEmits(['update'])
      const test1 = computed(() => fetchSomething(props.a))
      const test2 = computed(() => {
        const result = []
        result.push(props.a)
        return result
      })
      const test3 = computed({
        get: () => props.a,
        set: (value) => {
          emit('update', value)
        }
      })
      function onClick() {
        doSomething()
      }
      </script>`
    },
    {
      // `await` is reported by `vue/no-async-in-computed-properties`
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          async test1() {
            await this.load()
            return 1
          }
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
          message: 'Unexpected side effect in "test1" computed property.',
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 37
        },
        {
          message: 'Unexpected side effect in "test2" computed property.',
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 28
        },
        {
          message: 'Unexpected side effect in "test2" computed property.',
          line: 10,
          column: 13,
          endLine: 10,
          endColumn: 25
        },
        {
          message: 'Unexpected side effect in "test3" computed property.',
          line: 14,
          column: 20,
          endLine: 14,
          endColumn: 44
        },
        {
          message: 'Unexpected side effect in "test4" computed property.',
          line: 17,
          column: 26,
          endLine: 17,
          endColumn: 64
        },
        {
          message: 'Unexpected side effect in "test5" computed property.',
          line: 21,
          column: 13,
          endLine: 21,
          endColumn: 49
        },
        {
          message: 'Unexpected side effect in "test6" computed property.',
          line: 25,
          column: 20,
          endLine: 25,
          endColumn: 46
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
          message: 'Unexpected side effect in "test1" computed property.',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 39
        },
        {
          message: 'Unexpected side effect in "test2" computed property.',
          line: 11,
          column: 15,
          endLine: 11,
          endColumn: 30
        },
        {
          message: 'Unexpected side effect in "test2" computed property.',
          line: 12,
          column: 15,
          endLine: 12,
          endColumn: 27
        },
        {
          message: 'Unexpected side effect in "test3" computed property.',
          line: 18,
          column: 22,
          endLine: 18,
          endColumn: 46
        },
        {
          message: 'Unexpected side effect in "test4" computed property.',
          line: 23,
          column: 28,
          endLine: 23,
          endColumn: 66
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
      languageOptions: { parser: tsEslintParser },
      errors: [
        {
          message: 'Unexpected side effect in "test1" computed property.',
          line: 5,
          column: 22,
          endLine: 5,
          endColumn: 46
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
          message: 'Unexpected side effect in "test1" computed property.',
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 37
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
        {
          message: 'Unexpected side effect in "test1" computed property.',
          line: 4,
          column: 20,
          endLine: 4,
          endColumn: 48
        },
        {
          message: 'Unexpected side effect in "test2" computed property.',
          line: 7,
          column: 20,
          endLine: 7,
          endColumn: 50
        },
        {
          message: 'Unexpected side effect in "test3" computed property.',
          line: 10,
          column: 20,
          endLine: 10,
          endColumn: 50
        }
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
          message: 'Unexpected side effect in "fooBar" computed property.',
          line: 4,
          column: 18,
          endLine: 4,
          endColumn: 22
        },
        {
          message: 'Unexpected side effect in "fooBar" computed property.',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 20
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
          message: 'Unexpected side effect in computed function.',
          line: 12,
          column: 13,
          endLine: 12,
          endColumn: 36
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 13,
          column: 13,
          endLine: 13,
          endColumn: 34
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 17,
          column: 13,
          endLine: 17,
          endColumn: 27
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 18,
          column: 13,
          endLine: 18,
          endColumn: 24
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 21,
          column: 40,
          endLine: 21,
          endColumn: 63
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 23,
          column: 26,
          endLine: 23,
          endColumn: 63
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 27,
          column: 13,
          endLine: 27,
          endColumn: 52
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 30,
          column: 40,
          endLine: 30,
          endColumn: 65
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 33,
          column: 22,
          endLine: 33,
          endColumn: 45
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 37,
          column: 13,
          endLine: 37,
          endColumn: 24
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 40,
          column: 13,
          endLine: 40,
          endColumn: 24
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 42,
          column: 42,
          endLine: 42,
          endColumn: 52
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
          message: 'Unexpected side effect in computed function.',
          line: 8,
          column: 40,
          endLine: 8,
          endColumn: 53
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
          message: 'Unexpected side effect in computed function.',
          line: 8,
          column: 40,
          endLine: 8,
          endColumn: 63
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
          message: 'Unexpected side effect in computed function.',
          line: 10,
          column: 9,
          endLine: 10,
          endColumn: 32
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 11,
          column: 9,
          endLine: 11,
          endColumn: 30
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 15,
          column: 9,
          endLine: 15,
          endColumn: 23
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 16,
          column: 9,
          endLine: 16,
          endColumn: 20
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 19,
          column: 36,
          endLine: 19,
          endColumn: 59
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 21,
          column: 22,
          endLine: 21,
          endColumn: 59
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 25,
          column: 9,
          endLine: 25,
          endColumn: 48
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 28,
          column: 36,
          endLine: 28,
          endColumn: 61
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 31,
          column: 18,
          endLine: 31,
          endColumn: 41
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 35,
          column: 9,
          endLine: 35,
          endColumn: 20
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 38,
          column: 9,
          endLine: 38,
          endColumn: 20
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 40,
          column: 38,
          endLine: 40,
          endColumn: 48
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
          message: 'Unexpected side effect in computed function.',
          line: 6,
          column: 36,
          endLine: 6,
          endColumn: 49
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
          message: 'Unexpected side effect in computed function.',
          line: 6,
          column: 36,
          endLine: 6,
          endColumn: 59
        }
      ]
    },
    {
      // Object.assign mutating the prop as first argument in computed properties
      filename: 'test.vue',
      code: `
      <script>
      import {ref, computed} from 'vue'
      export default {
        setup() {
          const foo = useFoo()

          const test1 = computed(() => Object.assign(foo.data, { extra: 'value' }))
          const test2 = computed(() => {
            return Object.assign(foo.user, foo.updates)
          })
          const test3 = computed({
            get() {
              Object.assign(foo.settings, { theme: 'dark' })
              return foo.settings
            }
          })
        }
      }
      </script>
      `,
      errors: [
        {
          message: 'Unexpected side effect in computed function.',
          line: 8,
          column: 40,
          endLine: 8,
          endColumn: 83
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 10,
          column: 20,
          endLine: 10,
          endColumn: 56
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 14,
          column: 15,
          endLine: 14,
          endColumn: 61
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          foo() {
            this.$store.commit({})
            this.$store.dispatch('', {})
            return true
          },
          bar() {
            this.$router.go(-1)
            this.$router.push({})
            this.$router.replace({})
            return true
          },
          baz: {
            get() {
              console.log(this.a)
              return this.a
            }
          }
        }
      }
      </script>`,
      errors: [
        {
          message: 'Unexpected side effect in "foo" computed property.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 35
        },
        {
          message: 'Unexpected side effect in "foo" computed property.',
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 41
        },
        {
          message: 'Unexpected side effect in "bar" computed property.',
          line: 11,
          column: 13,
          endLine: 11,
          endColumn: 32
        },
        {
          message: 'Unexpected side effect in "bar" computed property.',
          line: 12,
          column: 13,
          endLine: 12,
          endColumn: 34
        },
        {
          message: 'Unexpected side effect in "bar" computed property.',
          line: 13,
          column: 13,
          endLine: 13,
          endColumn: 37
        },
        {
          message: 'Unexpected side effect in "baz" computed property.',
          line: 18,
          column: 15,
          endLine: 18,
          endColumn: 34
        }
      ]
    },
    {
      // the result of the call is discarded
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          test1() {
            this.load?.()
            void this.load()
            this.a && this.load()
            this.a ? this.load() : this.reset()
            return (this.load(), this.a)
          },
          test2() {
            ;(() => {
              this.a = 1
            })()
            return this.a
          }
        }
      }
      </script>`,
      errors: [
        {
          message: 'Unexpected side effect in "test1" computed property.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 26
        },
        {
          message: 'Unexpected side effect in "test1" computed property.',
          line: 7,
          column: 18,
          endLine: 7,
          endColumn: 29
        },
        {
          message: 'Unexpected side effect in "test1" computed property.',
          line: 8,
          column: 23,
          endLine: 8,
          endColumn: 34
        },
        {
          message: 'Unexpected side effect in "test1" computed property.',
          line: 9,
          column: 22,
          endLine: 9,
          endColumn: 33
        },
        {
          message: 'Unexpected side effect in "test1" computed property.',
          line: 9,
          column: 36,
          endLine: 9,
          endColumn: 48
        },
        {
          message: 'Unexpected side effect in "test1" computed property.',
          line: 10,
          column: 21,
          endLine: 10,
          endColumn: 32
        },
        {
          message: 'Unexpected side effect in "test2" computed property.',
          line: 13,
          column: 14,
          endLine: 15,
          endColumn: 17
        }
      ]
    },
    {
      // mutating calls are reported once
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          test1() {
            this.list.push(1)
            this.$set(this.obj, 'a', 1)
            return this.list
          }
        }
      }
      </script>`,
      errors: [
        {
          message: 'Unexpected side effect in "test1" computed property.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 30
        },
        {
          message: 'Unexpected side effect in "test1" computed property.',
          line: 7,
          column: 18,
          endLine: 7,
          endColumn: 22
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { computed } from 'vue'
      import { useStore } from 'vuex'
      const store = useStore()
      const list = []

      const test1 = computed(() => {
        callSomething()
      })
      const test2 = computed(() => (console.log('a'), true))
      const test3 = computed({
        get() {
          store.dispatch('load')
          list.push(1)
          return list
        }
      })
      </script>`,
      errors: [
        {
          message: 'Unexpected side effect in computed function.',
          line: 9,
          column: 9,
          endLine: 9,
          endColumn: 24
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 11,
          column: 37,
          endLine: 11,
          endColumn: 53
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 14,
          column: 11,
          endLine: 14,
          endColumn: 33
        },
        {
          message: 'Unexpected side effect in computed function.',
          line: 15,
          column: 11,
          endLine: 15,
          endColumn: 23
        }
      ]
    }
  ]
})
