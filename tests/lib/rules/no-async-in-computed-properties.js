/**
 * @fileoverview Check if there are no side effects inside computed properties
 * @author 2017 Armano
 */
'use strict'

const rule = require('../../../lib/rules/no-async-in-computed-properties')
const RuleTester = require('../../eslint-compat').RuleTester

const parser = require('vue-eslint-parser')
const languageOptions = {
  ecmaVersion: 2020,
  sourceType: 'module'
}

const ruleTester = new RuleTester()

ruleTester.run('no-async-in-computed-properties', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              return;
            },
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          ...foo,
          computed: {
            ...mapGetters({
              test: 'getTest'
            }),
            foo: function () {
              var bar = 0
              try {
                bar = bar / 0
              } catch (e) {
                return e
              } finally {
                return bar
              }
            },
            bar: {
              set () {
                new Promise((resolve, reject) => {})
              }
            },
            baz: {
              ...mapGetters({ get: 'getBaz' }),
              ...mapActions({ set: 'setBaz' })
            }
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        async function resolveComponents(components) {
          return await Promise.all(components.map(async (component) => {
              if(typeof component === 'function') {
                    return await component()
                }
                return component;
          }));
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo() {
              return {
                async bar() {
                  const data = await baz(this.a)
                  return data
                }
              }
            }
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo() {
              const a = 'test'
              return [
                async () => {
                  const baz = await bar(a)
                  return baz
                },
                'b',
                {}
              ]
            }
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo() {
              return function () {
                return async () => await bar()
              }
            },
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo() {
              return new Promise.resolve()
            },
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo() {
              return new Bar(async () => await baz())
            },
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo() {
              return someFunc.doSomething({
                async bar() {
                  return await baz()
                }
              })
            },
          }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
            computed: {
                foo() {
                    return this.bar
                      ? {
                          baz:() => Promise.resolve(1)
                        }
                      : {}
                }
            }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
            computed: {
                foo() {
                    return this.bar ? () => Promise.resolve(1) : null
                }
            }
        }
      `,
      languageOptions
    },
    {
      filename: 'test.vue',
      code: `
        export default {
            computed: {
                foo() {
                    return this.bar ? async () => 1 : null
                }
            }
        }
      `,
      languageOptions
    },
    {
      code: `
        Vue.component('test',{
          data1: new Promise(),
          data2: Promise.resolve(),
        })`,
      languageOptions
    },
    {
      code: `
        import {computed} from 'vue'
        export default {
          setup() {
            const test1 = computed(() => {})
            const test2 = computed(function () {
              var bar = 0
              try {
                bar = bar / 0
              } catch (e) {
                return e
              } finally {
                return bar
              }
            })
            const test3 = computed({
              set() {
                new Promise((resolve, reject) => {})
              }
            })
            const test4 = computed(() => {
              return {
                async bar() {
                  const data = await baz(this.a)
                  return data
                }
              }
            })
            const test5 = computed(() => {
              const a = 'test'
              return [
                async () => {
                  const baz = await bar(a)
                  return baz
                },
                'b',
                {}
              ]
            })
            const test6 = computed(() => function () {
              return async () => await bar()
            })
            const test7 = computed(() => new Promise.resolve())
            const test8 = computed(() => {
              return new Bar(async () => await baz())
            })
            const test9 = computed(() => {
              return someFunc.doSomething({
                async bar() {
                  return await baz()
                }
              })
            })
            const test10 = computed(() => {
              return this.bar
                      ? {
                          baz:() => Promise.resolve(1)
                        }
                      : {}
            })
            const test11 = computed(() => {
              return this.bar ? () => Promise.resolve(1) : null
            })
            const test12 = computed(() => {
              return this.bar ? async () => 1 : null
            })
            const test13 = computed(() => {
              bar()
            })
          }
        }
        `,
      languageOptions
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1690
      filename: 'test.vue',
      code: `
      <template>
        <div class="f-c" style="height: 100%;">
        </div>
      </template>
      <script setup>
      import { ref, computed } from 'vue' // each time uncomment error will print. anything from 'vue'
      import { useStore } from 'vuex' // others like this is ok
      </script>
      <script>
      export default {
        name: 'App',
        components: {
        },
      }
      </script>`,
      languageOptions: {
        parser,
        sourceType: 'module',
        ecmaVersion: 2020
      }
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: async function () {
              return await someFunc()
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in "foo" computed property.',
          line: 4,
          column: 18,
          endLine: 6,
          endColumn: 14
        },
        {
          message: 'Unexpected await operator in "foo" computed property.',
          line: 5,
          column: 22,
          endLine: 5,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: async function () {
              return new Promise((resolve, reject) => {})
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in "foo" computed property.',
          line: 4,
          column: 18,
          endLine: 6,
          endColumn: 14
        },
        {
          message: 'Unexpected Promise object in "foo" computed property.',
          line: 5,
          column: 22,
          endLine: 5,
          endColumn: 58
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              return bar.then(response => {})
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5,
          column: 22,
          endLine: 5,
          endColumn: 46
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              return bar?.then?.(response => {})
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5,
          column: 22,
          endLine: 5,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              return (bar?.then)?.(response => {})
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5,
          column: 22,
          endLine: 5,
          endColumn: 51
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              return bar.catch(e => {})
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5,
          column: 22,
          endLine: 5,
          endColumn: 40
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              return Promise.all([])
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5,
          column: 22,
          endLine: 5,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        export default {
          computed: {
            foo: function () {
              return bar.finally(res => {})
            }
          }
        }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5,
          column: 22,
          endLine: 5,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo: function () {
            return Promise.race([])
          }
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5,
          column: 20,
          endLine: 5,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo: function () {
            return Promise.reject([])
          }
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5,
          column: 20,
          endLine: 5,
          endColumn: 38
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo: function () {
            return Promise.resolve([])
          }
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5,
          column: 20,
          endLine: 5,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo () {
            return Promise.resolve([])
          }
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5,
          column: 20,
          endLine: 5,
          endColumn: 39
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo: {
            get () {
              return Promise.resolve([])
            }
          }
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6,
          column: 22,
          endLine: 6,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      new Vue({
        computed: {
          foo: {
            get () {
              return Promise.resolve([])
            }
          }
        }
      })
      `,
      languageOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6,
          column: 22,
          endLine: 6,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      new Vue({
        computed: {
          foo: {
            get () {
              return test.blabla.then([])
            }
          }
        }
      })
      `,
      languageOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6,
          column: 22,
          endLine: 6,
          endColumn: 42
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      new Vue({
        computed: {
          foo () {
            this.$nextTick(() => {})
            Vue.nextTick(() => {})
            return 'foo'
          }
        }
      })
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 37
        },
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      new Vue({
        computed: {
          async foo () {
            await this.$nextTick()
            await Vue.nextTick()
            return 'foo'
          }
        }
      })
      `,
      languageOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in "foo" computed property.',
          line: 4,
          column: 21,
          endLine: 8,
          endColumn: 12
        },
        {
          message: 'Unexpected await operator in "foo" computed property.',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 35
        },
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5,
          column: 19,
          endLine: 5,
          endColumn: 35
        },
        {
          message: 'Unexpected await operator in "foo" computed property.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 33
        },
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6,
          column: 19,
          endLine: 6,
          endColumn: 33
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo: function () {
            setTimeout(() => { }, 0)
            window.setTimeout(() => { }, 0)
            setInterval(() => { }, 0)
            window.setInterval(() => { }, 0)
            setImmediate(() => { })
            window.setImmediate(() => { })
            requestAnimationFrame(() => {})
            window.requestAnimationFrame(() => {})
          }
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 37
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 44
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 38
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 8,
          column: 13,
          endLine: 8,
          endColumn: 45
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 36
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 10,
          column: 13,
          endLine: 10,
          endColumn: 43
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 11,
          column: 13,
          endLine: 11,
          endColumn: 44
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 12,
          column: 13,
          endLine: 12,
          endColumn: 51
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo: function () {
            setTimeout?.(() => { }, 0)
            window?.setTimeout?.(() => { }, 0)
            setInterval(() => { }, 0)
            window?.setInterval?.(() => { }, 0)
            setImmediate?.(() => { })
            window?.setImmediate?.(() => { })
            requestAnimationFrame?.(() => {})
            window?.requestAnimationFrame?.(() => {})
          }
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 39
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 47
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 38
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 8,
          column: 13,
          endLine: 8,
          endColumn: 48
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 38
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 10,
          column: 13,
          endLine: 10,
          endColumn: 46
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 11,
          column: 13,
          endLine: 11,
          endColumn: 46
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 12,
          column: 13,
          endLine: 12,
          endColumn: 54
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        computed: {
          foo: function () {
            setTimeout?.(() => { }, 0)
            ;(window?.setTimeout)?.(() => { }, 0)
            setInterval(() => { }, 0)
            ;(window?.setInterval)?.(() => { }, 0)
            setImmediate?.(() => { })
            ;(window?.setImmediate)?.(() => { })
            requestAnimationFrame?.(() => {})
            ;(window?.requestAnimationFrame)?.(() => {})
          }
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 39
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 6,
          column: 14,
          endLine: 6,
          endColumn: 50
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 38
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 8,
          column: 14,
          endLine: 8,
          endColumn: 51
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 38
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 10,
          column: 14,
          endLine: 10,
          endColumn: 49
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 11,
          column: 13,
          endLine: 11,
          endColumn: 46
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 12,
          column: 14,
          endLine: 12,
          endColumn: 57
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      import {computed} from 'vue'
      export default {
        setup() {
          const test1 = computed(async () => {
            return await someFunc()
          })
          const test2 = computed(async () => await someFunc())
          const test3 = computed(async function () {
            return await someFunc()
          })
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 5,
          column: 34,
          endLine: 7,
          endColumn: 12
        },
        {
          message: 'Unexpected await operator in computed function.',
          line: 6,
          column: 20,
          endLine: 6,
          endColumn: 36
        },
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 8,
          column: 34,
          endLine: 8,
          endColumn: 62
        },
        {
          message: 'Unexpected await operator in computed function.',
          line: 8,
          column: 46,
          endLine: 8,
          endColumn: 62
        },
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 9,
          column: 34,
          endLine: 11,
          endColumn: 12
        },
        {
          message: 'Unexpected await operator in computed function.',
          line: 10,
          column: 20,
          endLine: 10,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      import {computed} from 'vue'
      export default {
        setup() {
          const test = computed(async () => {
            return new Promise((resolve, reject) => {})
          })
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 5,
          column: 33,
          endLine: 7,
          endColumn: 12
        },
        {
          message: 'Unexpected Promise object in computed function.',
          line: 6,
          column: 20,
          endLine: 6,
          endColumn: 56
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      import {computed} from 'vue'
      export default {
        setup() {
          const test1 = computed(() => {
            return bar.then(response => {})
          })
          const test2 = computed(() => {
            return Promise.all([])
          })
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 6,
          column: 20,
          endLine: 6,
          endColumn: 44
        },
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 9,
          column: 20,
          endLine: 9,
          endColumn: 35
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      import {computed} from 'vue'
      export default {
        setup() {
          const test1 = computed({
            get: () => {
              return Promise.resolve([])
            }
          })
          const test2 = computed({
            get() {
              return Promise.resolve([])
            }
          })
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 7,
          column: 22,
          endLine: 7,
          endColumn: 41
        },
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 12,
          column: 22,
          endLine: 12,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      import {computed} from 'vue'
      export default {
        setup() {
          const test = computed(() => {
            setTimeout(() => { }, 0)
            window.setTimeout(() => { }, 0)
            setInterval(() => { }, 0)
            window.setInterval(() => { }, 0)
            setImmediate(() => { })
            window.setImmediate(() => { })
            requestAnimationFrame(() => {})
            window.requestAnimationFrame(() => {})
          })
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message: 'Unexpected timed function in computed function.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 37
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 44
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 8,
          column: 13,
          endLine: 8,
          endColumn: 38
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 9,
          column: 13,
          endLine: 9,
          endColumn: 45
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 10,
          column: 13,
          endLine: 10,
          endColumn: 36
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 11,
          column: 13,
          endLine: 11,
          endColumn: 43
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 12,
          column: 13,
          endLine: 12,
          endColumn: 44
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 13,
          column: 13,
          endLine: 13,
          endColumn: 51
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      import {computed} from 'vue'
      export default {
        setup() {
          const test = computed(async () => {
            bar()
          })
        }
      }
      `,
      languageOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 5,
          column: 33,
          endLine: 7,
          endColumn: 12
        }
      ]
    },

    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {computed} from 'vue'
      const test1 = computed(async () => {
        return await someFunc()
      })
      const test2 = computed(async () => await someFunc())
      const test3 = computed(async function () {
        return await someFunc()
      })
      </script>
      `,
      languageOptions: {
        parser,
        ...languageOptions
      },
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 4,
          column: 30,
          endLine: 6,
          endColumn: 8
        },
        {
          message: 'Unexpected await operator in computed function.',
          line: 5,
          column: 16,
          endLine: 5,
          endColumn: 32
        },
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 7,
          column: 30,
          endLine: 7,
          endColumn: 58
        },
        {
          message: 'Unexpected await operator in computed function.',
          line: 7,
          column: 42,
          endLine: 7,
          endColumn: 58
        },
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 8,
          column: 30,
          endLine: 10,
          endColumn: 8
        },
        {
          message: 'Unexpected await operator in computed function.',
          line: 9,
          column: 16,
          endLine: 9,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {computed} from 'vue'
      const test = computed(async () => {
        return new Promise((resolve, reject) => {})
      })
      </script>
      `,
      languageOptions: {
        parser,
        ...languageOptions
      },
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 4,
          column: 29,
          endLine: 6,
          endColumn: 8
        },
        {
          message: 'Unexpected Promise object in computed function.',
          line: 5,
          column: 16,
          endLine: 5,
          endColumn: 52
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {computed} from 'vue'
      const test1 = computed(() => {
        return bar.then(response => {})
      })
      const test2 = computed(() => {
        return Promise.all([])
      })
      </script>
      `,
      languageOptions: {
        parser,
        ...languageOptions
      },
      errors: [
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 5,
          column: 16,
          endLine: 5,
          endColumn: 40
        },
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 8,
          column: 16,
          endLine: 8,
          endColumn: 31
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {computed} from 'vue'
      const test1 = computed({
        get: () => {
          return Promise.resolve([])
        }
      })
      const test2 = computed({
        get() {
          return Promise.resolve([])
        }
      })
      </script>
      `,
      languageOptions: {
        parser,
        ...languageOptions
      },
      errors: [
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 6,
          column: 18,
          endLine: 6,
          endColumn: 37
        },
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 11,
          column: 18,
          endLine: 11,
          endColumn: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {computed} from 'vue'
      const test = computed(() => {
        setTimeout(() => { }, 0)
        window.setTimeout(() => { }, 0)
        setInterval(() => { }, 0)
        window.setInterval(() => { }, 0)
        setImmediate(() => { })
        window.setImmediate(() => { })
        requestAnimationFrame(() => {})
        window.requestAnimationFrame(() => {})
      })
      </script>
      `,
      languageOptions: {
        parser,
        ...languageOptions
      },
      errors: [
        {
          message: 'Unexpected timed function in computed function.',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 33
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 40
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 7,
          column: 9,
          endLine: 7,
          endColumn: 34
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 8,
          column: 9,
          endLine: 8,
          endColumn: 41
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 9,
          column: 9,
          endLine: 9,
          endColumn: 32
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 10,
          column: 9,
          endLine: 10,
          endColumn: 39
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 11,
          column: 9,
          endLine: 11,
          endColumn: 40
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 12,
          column: 9,
          endLine: 12,
          endColumn: 47
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {computed} from 'vue'
      const test = computed(async () => {
        bar()
      })
      </script>
      `,
      languageOptions: {
        parser,
        ...languageOptions
      },
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 4,
          column: 29,
          endLine: 6,
          endColumn: 8
        }
      ]
    }
  ]
})
