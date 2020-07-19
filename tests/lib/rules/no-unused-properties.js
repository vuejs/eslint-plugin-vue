/**
 * @fileoverview Disallow unused properties, data and computed properties.
 * @author Learning Equality
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-unused-properties')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

const allOptions = [
  { groups: ['props', 'computed', 'data', 'methods', 'setup'] }
]

tester.run('no-unused-properties', rule, {
  valid: [
    // a property used in a script expression
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['count'],
            created() {
              alert(this.count + 1)
            }
          };
        </script>
      `
    },
    // default options
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            data () {
              return {
                foo: 1
              }
            },
            computed: {
              bar() {}
            },
            methods: {
              baz () {}
            }
          };
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            setup () {
              return {
                foo
              }
            },
          };
        </script>
      `
    },

    // a property being watched
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: {
              count: {
                type: Number,
                default: 0
              }
            },
            watch: {
              count() {
                alert('Increased!');
              },
            },
          };
        </script>
      `
    },

    // a property used as a template identifier
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>{{ count }}</div>
        </template>
        <script>
          export default {
            props: ['count']
          }
        </script>
      `
    },

    // properties used in a template expression
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>{{ count1 + count2 }}</div>
        </template>
        <script>
          export default {
            props: ['count1', 'count2']
          };
        </script>
      `
    },

    // a property used in v-if
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-if="count > 0"></div>
        </template>
        <script>
          export default {
            props: {
              count: {
                type: Number
              }
            }
          };
        </script>
      `
    },

    // a property used in v-for
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-for="color in colors">{{ color }}</div>
        </template>
        <script>
          export default {
            props: {
              colors: {
                type: Array,
                default: () => []
              }
            }
          };
        </script>
      `
    },

    // a property used in v-html
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-html="message" />
        </template>
        <script>
          export default {
            props: ['message']
          };
        </script>
      `
    },

    // a property passed in a component
    {
      filename: 'test.vue',
      code: `
        <template>
          <counter :count="count" />
        </template>
        <script>
          export default {
            props: ['count']
          };
        </script>
      `
    },

    // a property used in v-on
    {
      filename: 'test.vue',
      code: `
        <template>
          <button @click="alert(count)" />
        </template>
        <script>
          export default {
            props: ['count']
          };
        </script>
      `
    },

    // data used in a script expression
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            data () {
              return {
                count: 2
              };
            },
            created() {
              alert(this.count + 1)
            }
          };
        </script>
      `,
      options: allOptions
    },

    // data being watched
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            data() {
              return {
                count: 2
              };
            },
            watch: {
              count() {
                alert('Increased!');
              },
            },
          };
        </script>
      `,
      options: allOptions
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['foo'],
            watch: {
              'foo.bar'() {
                alert('Increased!');
              },
            },
          };
        </script>
      `
    },

    // data used as a template identifier
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>{{ count }}</div>
        </template>
        <script>
          export default {
            data () {
              return {
                count: 2
              };
            }
          }
        </script>
      `,
      options: allOptions
    },

    // data used in a template expression
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>{{ count1 + count2 }}</div>
        </template>
        <script>
          export default {
            data () {
              return {
                count1: 1,
                count2: 2
              };
            }
          };
        </script>
      `,
      options: allOptions
    },

    // data used in v-if
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-if="count > 0"></div>
        </template>
        <script>
          export default {
            data () {
              return {
                count: 2
              };
            }
          };
        </script>
      `,
      options: allOptions
    },

    // data used in v-for
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-for="color in colors">{{ color }}</div>
        </template>
        <script>
          export default {
            data () {
              return {
                colors: ["purple", "green"]
              };
            }
          };
        </script>
      `,
      options: allOptions
    },

    // data used in v-html
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-html="message" />
        </template>
        <script>
          export default {
            data () {
              return {
                message: "<span>Hey!</span>"
              };
            }
          };
        </script>
      `,
      options: allOptions
    },

    // data used in v-model
    {
      filename: 'test.vue',
      code: `
        <template>
          <input v-model="count" />
        </template>
        <script>
          export default {
            data () {
              return {
                count: 2
              };
            }
          };
        </script>
      `,
      options: allOptions
    },

    // data passed in a component
    {
      filename: 'test.vue',
      code: `
        <template>
          <counter :count="count" />
        </template>
        <script>
          export default {
            data () {
              return {
                count: 2
              };
            }
          };
        </script>
      `,
      options: allOptions
    },

    // data used in v-on
    {
      filename: 'test.vue',
      code: `
        <template>
          <button @click="count++" />
        </template>
        <script>
          export default {
            data () {
              return {
                count: 2
              };
            }
          };
        </script>
      `,
      options: allOptions
    },

    // computed property used in a script expression
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            computed: {
              count() {
                return 2;
              }
            },
            created() {
              const dummy = this.count + 1;
            }
          };
        </script>
      `,
      options: allOptions
    },

    // computed property being watched
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            computed: {
              count() {
                return 2;
              }
            },
            watch: {
              count() {
                alert('Increased!');
              },
            },
          };
        </script>
      `,
      options: allOptions
    },

    // computed property used as a template identifier
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>{{ count }}</div>
        </template>
        <script>
          export default {
            computed: {
              count() {
                return 2;
              }
            }
          }
        </script>
      `,
      options: allOptions
    },

    // computed properties used in a template expression
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>{{ count1 + count2 }}</div>
        </template>
        <script>
          export default {
            computed: {
              count1() {
                return 1;
              },
              count2() {
                return 2;
              }
            }
          }
        </script>
      `,
      options: allOptions
    },

    // computed property used in v-if
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-if="count > 0"></div>
        </template>
        <script>
          export default {
            computed: {
              count() {
                return 2;
              }
            }
          }
        </script>
      `,
      options: allOptions
    },

    // computed property used in v-for
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-for="color in colors">{{ color }}</div>
        </template>
        <script>
          export default {
            computed: {
              colors() {
                return ["purple", "green"];
              }
            }
          };
        </script>
      `,
      options: allOptions
    },

    // computed property used in v-html
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-html="message" />
        </template>
        <script>
          export default {
            computed: {
              message() {
                return "<span>Hey!</span>";
              }
            }
          };
        </script>
      `,
      options: allOptions
    },

    // computed property used in v-model
    {
      filename: 'test.vue',
      code: `
        <template>
          <input v-model="fullName" />
        </template>
        <script>
          export default {
            data() {
              return {
                firstName: "David",
                lastName: "Attenborough"
              }
            },
            computed: {
              fullName: {
                get() {
                  return this.firstName + ' ' + this.lastName
                },
                set(newValue) {
                  var names = newValue.split(' ')
                  this.firstName = names[0]
                  this.lastName = names[names.length - 1]
                }
              }
            }
          };
        </script>
      `,
      options: allOptions
    },

    // computed property passed in a component
    {
      filename: 'test.vue',
      code: `
        <template>
          <counter :count="count" />
        </template>
        <script>
          export default {
            computed: {
              count() {
                return 2;
              }
            }
          }
        </script>
      `,
      options: allOptions
    },

    // ignores unused data when marked with eslint-disable
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>{{ cont }}</div>
        </template>
        <script>
          export default {
            data () {
              return {
                // eslint-disable-next-line
                count: 2
              };
            }
          };
        </script>
      `,
      options: allOptions
    },

    // trace this
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['count'],
            methods: {
              click () {
                const vm = this
                fn(vm.count)
              }
            }
          };
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['count'],
            methods: {
              click () {
                const vm = this
                const {count} = vm
              }
            }
          };
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['count'],
            methods: {
              click () {
                const vm = this
                let count;
                ({count} = vm)
              }
            }
          };
        </script>
      `
    },
    // use rest
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>{{ foo }}</div>
        </template>
        <script>
          export default {
            data () {
              return {
                count: 2
              };
            },
            methods: {
              click () {
                const vm = this
                const {...r} = vm
              },
              focus () {
                fn(this.foo)
              },
              blur () {
                const {foo} = this
              },
              keydown () {
                let foo;
                ({foo} = this)
              }
            }
          };
        </script>
      `
    },

    // function trace
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['foo', 'bar', 'baz'],
            setup (props) {
              fn(props)
            }
          }

          function fn(p) {
            return fn2(p)
          }
          function fn2(p2) {
            const {...a} = p2
          }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['foo', 'bar', 'baz'],
            setup (props) {
              fn(props)
            }
          }

          function fn(a) {
            return a[foo]
          }
        </script>
      `
    },

    // render & functional
    {
      filename: 'test.js',
      code: `
      Vue.component('smart-list', {
        functional: true,
        props: {
          items: {
            type: Array,
            required: true
          },
          isOrdered: Boolean
        },
        render: function (createElement, context) {
          function appropriateListComponent () {
            var items = context.props.items

            if (items.length === 0)           return EmptyList
            if (typeof items[0] === 'object') return TableList
            if (context.props.isOrdered)      return OrderedList

            return UnorderedList
          }

          return createElement(
            appropriateListComponent(),
            context.data,
            context.children
          )
        }
      })
      `
    },
    {
      filename: 'test.js',
      code: `
      Vue.component('MyButton', {
        functional: true,
        props: ['foo'],
        render: function (createElement, {props}) {
          return createElement('button', props.foo)
        }
      })
      `
    },
    {
      filename: 'test.js',
      code: `
      Vue.component('MyButton', {
        functional: true,
        props: ['foo'],
        render: function (createElement, ctx) {
          return createElement('button', fn(ctx.props))
        }
      })

      function fn(props) {
        return props.foo
      }
      `
    },
    {
      filename: 'test.js',
      code: `
      Vue.component('MyButton', {
        functional: true,
        props: ['foo'],
        render: function (createElement, ctx) {
          return createElement('button', fn(ctx))
        }
      })

      function fn({props}) {
        return props.foo
      }
      `
    },
    {
      filename: 'test.js',
      code: `
      Vue.component('MyButton', {
        functional: true,
        props: ['foo'],
        render: function (createElement, {props:{foo}}) {
          return createElement('button', foo)
        }
      })
      `
    },
    {
      filename: 'test.js',
      code: `
      Vue.component('MyButton', {
        functional: true,
        props: ['foo'],
        render: function (createElement, {props:[bar]}) {
          return createElement('button')
        }
      })
      `
    },
    {
      filename: 'test.js',
      code: `
      Vue.component('MyButton', {
        functional: true,
        props: ['foo'],
        render: function (createElement, {props:bar={}}) {
          return createElement('button', bar.foo)
        }
      })
      `
    },
    {
      filename: 'test.js',
      code: `
      Vue.component('MyButton', {
        functional: true,
        props: ['foo'],
        render: function (createElement, {...foo}) {
          return createElement('button')
        }
      })
      `
    },
    {
      filename: 'test.js',
      code: `
      Vue.component('MyButton', {
        functional: true,
        props: ['foo', 'bar'],
        render: function (createElement, ctx) {
          const a = ctx.props
          const b = ctx.props
          return createElement('button', a.foo + b.bar)
        }
      })
      `
    },
    {
      filename: 'test.js',
      code: `
      Vue.component('MyButton', {
        functional: true,
        props: ['foo', 'bar'],
        render: function (createElement, {props: a, props: b}) {
          return createElement('button', a.foo + b.bar)
        }
      })
      `
    },
    // render for Vue 3.x
    {
      filename: 'test.vue',
      code: `
      export default {
        props: ['foo'],
        render (props) {
          return h('button', props.foo)
        }
      })
      `
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        props: ['foo'],
        render ({foo}) {
          return h('button', foo)
        }
      })
      `
    },
    {
      filename: 'test.vue',
      code: `
      export default {
        props: ['foo'],
        render (bar) {
          const {...baz} = bar
          return h('button')
        }
      })
      `
    },
    // Vue.js 3.x Template Refs
    {
      filename: 'test.vue',
      code: `
      <template>
        <div ref="root"></div>
      </template>

      <script>
        import { ref, onMounted } from 'vue'

        export default {
          setup() {
            const root = ref(null)

            onMounted(() => {
              // the DOM element will be assigned to the ref after initial render
              console.log(root.value) // <div/>
            })

            return {
              root
            }
          }
        }
      </script>`,
      options: [{ groups: ['props', 'setup'] }]
    },

    // sparse array
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>{{ count }}</div>
        </template>
        <script>
          export default {
            props: [, 'count']
          }
        </script>
        `
    },
    // optional chaining
    {
      filename: 'test.vue',
      code: `
      <script>
        import { ref, onMounted } from 'vue'

        export default {
          props: ['foo', 'bar'],
          methods: {
            fn () {
              fn(this)
            }
          }
        }

        function fn(a) {
          return a?.foo + a?.bar
        }
      </script>`
    },
    {
      filename: 'test.js',
      code: `
      Vue.component('MyButton', {
        functional: true,
        props: ['foo', 'bar'],
        render: function (createElement, ctx) {
          const a = ctx
          const b = a?.props?.foo
          const c = (a?.props)?.bar
        }
      })
      `
    },
    // handlers
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: ['foo', 'bar'],
          watch: {
            foo: 'updateFoo',
            bar: {
              handler: 'updateBar',
              immediate: true
            }
          },
          methods: {
            updateFoo() {},
            updateBar() {}
          }
        };
      </script>
      `,
      options: [{ groups: ['props', 'methods'] }]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: ['foo', 'bar'],
          data () {
            return {
              updateFoo() {},
              updateBar() {}
            }
          },
          watch: {
            foo: 'updateFoo',
            bar: {
              handler: 'updateBar',
              immediate: true
            }
          }
        };
      </script>
      `,
      options: [{ groups: ['props', 'data'] }]
    }
  ],

  invalid: [
    // unused property
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>{{ cont }}</div>
        </template>
        <script>
          export default {
            props: ['count']
          };
        </script>
      `,
      errors: [
        {
          message: "'count' of property found, but never used.",
          line: 7
        }
      ]
    },

    // unused data
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>{{ cont }}</div>
        </template>
        <script>
          export default {
            data () {
              return {
                count: 2
              };
            }
          };
        </script>
      `,
      options: [{ groups: ['props', 'computed', 'data'] }],
      errors: [
        {
          message: "'count' of data found, but never used.",
          line: 9
        }
      ]
    },

    // unused computed property
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>{{ cont }}</div>
        </template>
        <script>
          export default {
            computed: {
              count() {
                return 2;
              }
            }
          };
        </script>
      `,
      options: [{ groups: ['props', 'computed', 'data'] }],
      errors: [
        {
          message: "'count' of computed property found, but never used.",
          line: 8
        }
      ]
    },

    // all options
    {
      filename: 'test.vue',
      code: `
        <template>
          <div>{{ foo }}</div>
        </template>
        <script>
          export default {
            props: ['a'],
            data() {
              return {b:1}
            },
            computed: {
              c() {
                return 2;
              }
            },
            methods: {
              d() {}
            },
            setup() {
              return {e:3}
            }
          };
        </script>
      `,
      options: allOptions,
      errors: [
        {
          message: "'a' of property found, but never used.",
          line: 7
        },
        {
          message: "'b' of data found, but never used.",
          line: 9
        },
        {
          message: "'c' of computed property found, but never used.",
          line: 12
        },
        {
          message: "'d' of method found, but never used.",
          line: 17
        },
        {
          message:
            "'e' of property returned from `setup()` found, but never used.",
          line: 20
        }
      ]
    },

    // trace this
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['count'],
            methods: {
              click () {
                fn(vm.count)
              }
            }
          };
        </script>
      `,
      errors: [
        {
          message: "'count' of property found, but never used.",
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['count'],
            methods: {
              click () {
                const {count} = vm
              }
            }
          };
        </script>
      `,
      errors: [
        {
          message: "'count' of property found, but never used.",
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['count'],
            methods: {
              click () {
                let count;
                ({count} = vm)
              }
            }
          };
        </script>
      `,
      errors: [
        {
          message: "'count' of property found, but never used.",
          line: 4
        }
      ]
    },

    // setup
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props:['foo', 'bar'],
            setup(props) {
              return fn(props.foo)
            }
          };
        </script>
      `,
      errors: ["'bar' of property found, but never used."]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props:['foo', 'bar'],
            setup({foo}) {
              return fn(foo)
            }
          };
        </script>
      `,
      errors: ["'bar' of property found, but never used."]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props:['foo', 'bar'],
            setup(...foo) {
              return fn(foo)
            }
          };
        </script>
      `,
      errors: [
        "'foo' of property found, but never used.",
        "'bar' of property found, but never used."
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props:['foo', 'bar'],
            setup([foo]) {
              return fn(foo)
            }
          };
        </script>
      `,
      errors: [
        "'foo' of property found, but never used.",
        "'bar' of property found, but never used."
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props:['foo', 'bar'],
            setup(props) {
              props = 'foo'
            }
          };
        </script>
      `,
      errors: [
        "'foo' of property found, but never used.",
        "'bar' of property found, but never used."
      ]
    },

    // function trace
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['foo', 'bar'],
            methods: {
              click () {
                const vm = this
                fn(vm)

                fn(vm.vm.bar)
              }
            }
          }

          function fn(vm) {
            return vm.foo
          }
        </script>
      `,
      errors: ["'bar' of property found, but never used."]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['foo', 'bar', 'baz'],
            setup (props) {
              fn(props)
              fn3(props)
            }
          }

          function fn(p) {
            return fn2(p)
          }
          function fn2(p2) {
            return p2.foo
          }
          function fn3({bar}) {}
        </script>
      `,
      errors: ["'baz' of property found, but never used."]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['foo', 'bar'],
            setup (props) {
              fn(props)

              fn(props)
            },
            methods: {
              click(e) {
                fn2(e)
                fn(this)
              }
            }
          }

          function fn(p) {
            return fn(p)
          }
          function fn2(p2) {
            return p2.foo
          }
        </script>
      `,
      errors: [
        "'foo' of property found, but never used.",
        "'bar' of property found, but never used."
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['foo', 'bar', 'baz'],
            setup (props) {
              fn(props)
            }
          }

          function fn(p) {
            return fnUnknown(p)
          }
          function fn3(p2) {
            const {...a} = p2
          }
        </script>
      `,
      errors: [
        "'foo' of property found, but never used.",
        "'bar' of property found, but never used.",
        "'baz' of property found, but never used."
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          const fnVar = (p) => p.baz
          export default {
            props: ['foo', 'bar', 'baz'],
            setup (props) {
              fn(a, b, props)
              fnVar(props)
            }
          }

          function fn(a, b) {
            return a.foo + b.bar
          }
        </script>
      `,
      errors: [
        "'foo' of property found, but never used.",
        "'bar' of property found, but never used."
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['foo', 'bar', 'baz'],
            setup (props) {
              fn(props, props)
            }
          }

          function fn(a, b) {
            return a.foo + b.bar
          }
        </script>
      `,
      errors: ["'baz' of property found, but never used."]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['foo', 'bar', 'baz'],
            setup (props) {
              fn.fn(props, props)
            }
          }

          function fn(a, b) {
            return a.foo + b.bar
          }
        </script>
      `,
      errors: [
        "'foo' of property found, but never used.",
        "'bar' of property found, but never used.",
        "'baz' of property found, but never used."
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          let fnLet = function foo(p){p.foo}
          var fnVar = function foo(p){p.bar}
          var fnVar = function foo(p){p.bar}
          export default {
            props: ['foo', 'bar', 'baz'],
            setup (props) {
              fn(props)
              fn3(props)
              fn4(props)
              fnLet(props)
              fnVar(props)
            }
          }

          function fn(a) {
            a(fn2)
            return fn2.fn2(a)
          }
          function fn2(a) {
            return a.foo
          }
          function fn3(b) {
            foo[b]
          }
          function fn4(b) {
            const foo = {b}
          }
        </script>
      `,
      errors: [
        "'foo' of property found, but never used.",
        "'bar' of property found, but never used.",
        "'baz' of property found, but never used."
      ]
    },

    // render & not functional
    {
      filename: 'test.js',
      code: `
      Vue.component('MyButton', {
        props: ['foo'],
        render: function (createElement, {props}) {
          return createElement('button', props.foo)
        }
      })
      `,
      errors: ["'foo' of property found, but never used."]
    }
  ]
})
