/**
 * @fileoverview Check if there are no side effects inside computed properties
 * @author 2017 Armano
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-async-in-computed-properties')
const RuleTester = require('eslint').RuleTester

const parserOptions = {
  ecmaVersion: 2020,
  sourceType: 'module'
}
const parser = require.resolve('vue-eslint-parser')

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

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
      parserOptions
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
      parserOptions
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
      parserOptions
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
      parserOptions
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
      parserOptions
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
      parserOptions
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
      parserOptions
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
      parserOptions
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
      parserOptions
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
      parserOptions
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
      parserOptions
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
      parserOptions
    },
    {
      code: `
        Vue.component('test',{
          data1: new Promise(),
          data2: Promise.resolve(),
        })`,
      parserOptions
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
      parserOptions
    },
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1690
      filename: 'test.vue',
      parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2020
      },
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
      </script>`
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
      parserOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in "foo" computed property.',
          line: 4
        },
        {
          message: 'Unexpected await operator in "foo" computed property.',
          line: 5
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
      parserOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in "foo" computed property.',
          line: 4
        },
        {
          message: 'Unexpected Promise object in "foo" computed property.',
          line: 5
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
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
      parserOptions,
      errors: ['Unexpected asynchronous action in "foo" computed property.']
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
      parserOptions,
      errors: ['Unexpected asynchronous action in "foo" computed property.']
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6
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
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6
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
      parserOptions: { ecmaVersion: 6 },
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
        },
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6
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
      parserOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in "foo" computed property.',
          line: 4
        },
        {
          message: 'Unexpected await operator in "foo" computed property.',
          line: 5
        },
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
        },
        {
          message: 'Unexpected await operator in "foo" computed property.',
          line: 6
        },
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 5
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 6
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 7
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 8
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 9
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 10
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 11
        },
        {
          message: 'Unexpected timed function in "foo" computed property.',
          line: 12
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
      parserOptions,
      errors: [
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.'
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
      parserOptions,
      errors: [
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.'
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
      parserOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 5
        },
        {
          message: 'Unexpected await operator in computed function.',
          line: 6
        },
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 8
        },
        {
          message: 'Unexpected await operator in computed function.',
          line: 8
        },
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 9
        },
        {
          message: 'Unexpected await operator in computed function.',
          line: 10
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
      parserOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 5
        },
        {
          message: 'Unexpected Promise object in computed function.',
          line: 6
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 6
        },
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 9
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 7
        },
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 12
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
      parserOptions,
      errors: [
        {
          message: 'Unexpected timed function in computed function.',
          line: 6
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 7
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 8
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 9
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 10
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 11
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 12
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 13
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
      parserOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 5
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
      parser,
      parserOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 4
        },
        {
          message: 'Unexpected await operator in computed function.',
          line: 5
        },
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 7
        },
        {
          message: 'Unexpected await operator in computed function.',
          line: 7
        },
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 8
        },
        {
          message: 'Unexpected await operator in computed function.',
          line: 9
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
      parser,
      parserOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 4
        },
        {
          message: 'Unexpected Promise object in computed function.',
          line: 5
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
      parser,
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 5
        },
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 8
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
      parser,
      parserOptions,
      errors: [
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 6
        },
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 11
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
      parser,
      parserOptions,
      errors: [
        {
          message: 'Unexpected timed function in computed function.',
          line: 5
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 6
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 7
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 8
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 9
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 10
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 11
        },
        {
          message: 'Unexpected timed function in computed function.',
          line: 12
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
      parser,
      parserOptions,
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 4
        }
      ]
    }
  ]
})
