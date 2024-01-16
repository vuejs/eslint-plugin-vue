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
      ],
      languageOptions
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
      ],
      languageOptions
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
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
        }
      ],
      languageOptions
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
      errors: ['Unexpected asynchronous action in "foo" computed property.'],
      languageOptions
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
      errors: ['Unexpected asynchronous action in "foo" computed property.'],
      languageOptions
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
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
        }
      ],
      languageOptions
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
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
        }
      ],
      languageOptions
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
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
        }
      ],
      languageOptions
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
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
        }
      ],
      languageOptions
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
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
        }
      ],
      languageOptions
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
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
        }
      ],
      languageOptions
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
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
        }
      ],
      languageOptions
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
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6
        }
      ],
      languageOptions
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
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6
        }
      ],
      languageOptions: { ecmaVersion: 6 }
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
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6
        }
      ],
      languageOptions: { ecmaVersion: 6 }
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
      errors: [
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 5
        },
        {
          message: 'Unexpected asynchronous action in "foo" computed property.',
          line: 6
        }
      ],
      languageOptions
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
      ],
      languageOptions
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
      ],
      languageOptions
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
      errors: [
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.'
      ],
      languageOptions
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
      errors: [
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.',
        'Unexpected timed function in "foo" computed property.'
      ],
      languageOptions
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
      ],
      languageOptions
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
      ],
      languageOptions
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
      errors: [
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 6
        },
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 9
        }
      ],
      languageOptions
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
      errors: [
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 7
        },
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 12
        }
      ],
      languageOptions
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
      ],
      languageOptions
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
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 5
        }
      ],
      languageOptions
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
      ],
      languageOptions: {
        parser,
        ...languageOptions
      }
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
      ],
      languageOptions: {
        parser,
        ...languageOptions
      }
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
      errors: [
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 5
        },
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 8
        }
      ],
      languageOptions: {
        parser,
        ...languageOptions
      }
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
      errors: [
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 6
        },
        {
          message: 'Unexpected asynchronous action in computed function.',
          line: 11
        }
      ],
      languageOptions: {
        parser,
        ...languageOptions
      }
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
      ],
      languageOptions: {
        parser,
        ...languageOptions
      }
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
      errors: [
        {
          message:
            'Unexpected async function declaration in computed function.',
          line: 4
        }
      ],
      languageOptions: {
        parser,
        ...languageOptions
      }
    }
  ]
})
