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
const deepDataOptions = [{ groups: ['data'], deepData: true }]

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
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            props: ['foo'],
            watch: {
              foo: [
                'bar',
                {
                  handler: 'baz'
                }
              ],
            },
            methods: {
              bar () {},
              baz () {},
            }
          };
        </script>
      `,
      options: allOptions
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
    },
    // contexts
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: ['x'],
          data: ({ x }) => ({
              y: x
          })
        };
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: ['x'],
          computed: {
            y: (vm) => vm.x * 2
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
          props: ['x'],
          computed: {
            y: {
              get: () => this.x * 2
            }
          }
        };
      </script>
      `
    },

    // deep data
    {
      filename: 'test.vue',
      code: `
        <template>
         {{ foo.baz.b }}
        </template>
        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                  baz: {
                    b: 1
                  }
                }
              }
            },
            methods: {
              a () {
                return this.foo.bar.a
              }
            }
          };
        </script>
      `,
      options: deepDataOptions
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                  baz: {
                    b: 1
                  }
                }
              }
            },
            created() {
              alert(this.foo)
            }
          };
        </script>
      `,
      options: deepDataOptions
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                  baz: {
                    b: 1
                  }
                }
              }
            },
            created() {
              fn(this.foo)
            }
          };
          function fn(foo) {
            return foo.bar.a + foo.baz.b
          }
        </script>
      `,
      options: deepDataOptions
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          {{ foo.bar }}
          {{ foo.baz }}
        </template>
        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                  baz: {
                    b: 1
                  }
                }
              }
            }
          };
        </script>
      `,
      options: deepDataOptions
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                  baz: {
                    b: 1
                  }
                }
              }
            },
            methods: {
              a () {
                return this.foo
              }
            }
          };
        </script>
      `,
      options: deepDataOptions
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <Foo :param="{ a: foo.bar }"></Foo>
        </template>

        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                  baz: {
                    b: 1
                  }
                }
              }
            },
            methods: {
              fn () {
                return {
                  b: this.foo.baz
                }
              }
            }
          };
        </script>
      `,
      options: deepDataOptions
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <Foo :class="[ foo.bar ]"></Foo>
        </template>

        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                  baz: {
                    b: 1
                  }
                }
              }
            },
            methods: {
              fn () {
                return [this.foo.baz]
              }
            }
          };
        </script>
      `,
      options: deepDataOptions
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <Foo :param="[ {a: foo.bar} ]"></Foo>
        </template>

        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                  baz: {
                    b: 1
                  }
                }
              }
            },
            methods: {
              fn () {
                return {
                  b: [this.foo.baz]
                }
              }
            }
          };
        </script>
      `,
      options: deepDataOptions
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                  baz: {
                    b: 1
                  }
                }
              }
            },
            methods: {
              fn () {
                unknown(this.foo.bar)
                f( () => this.foo.baz )
              }
            }
          };

          function f (a) {

          }
        </script>
      `,
      options: deepDataOptions
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div> {{ obj.num.toLocaleString() }} </div>
      </template>
      <script>
      export default {
        data () {
          return {
            obj: { num: 42 }
          }
        }
      }
      </script>`,
      options: deepDataOptions
    },

    // ignore public members
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          data: () => ({
            /** @public */
            publicData: 'foo'
          })
        }
        </script>
      `,
      options: [{ groups: ['data'], ignorePublicMembers: true }]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          computed: {
            /** @public */
            unusedComputed() {
              return 'foo'
            }
          }
        }
        </script>
      `,
      options: [{ groups: ['computed'], ignorePublicMembers: true }]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          methods: {
            /** @public */
            publicMethod() {}
          }
        }
        </script>
      `,
      options: [{ groups: ['methods'], ignorePublicMembers: true }]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          setup() {
            return {
              /** @public */
              publicRef: 3
            }
          }
        }
        </script>
      `,
      options: [{ groups: ['setup'], ignorePublicMembers: true }]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
      </template>
      <script>
      export default {
        props: {
          a: String,
        },
        setup() {
          return {
            /** @public */
            b: 42
          }
        },
        data () {
          return {
            /** @public */
            c: 42
          }
        },
        computed: {
          /** @public */
          d () { return this.a }
        },
        methods: {
          /** @public */
          e () {},
          f:
            /** @public */
            function () {},
          g:
            /** @public */
            () => {},
        },
      }
      </script>`,
      options: [
        {
          groups: ['props', 'data', 'computed', 'methods', 'setup'],
          ignorePublicMembers: true
        }
      ]
    },

    // expose
    {
      filename: 'test.vue',
      code: `
      <template>
        {{a}}
      </template>
      <script>
      export default {
        expose: ['a', 'b', 'c', 'd'],
        props: ['a'],
        data() {
          return {
            b: 42,
          }
        },
        computed:{
          c() {},
        },
        methods:{
          d() {},
        }
      }
      </script>`,
      options: allOptions
    },

    //style vars
    {
      filename: 'test.vue',
      code: `
        <template>
          <div class="text">hello</div>
        </template>

        <script>
          export default {
            data() {
              return {
                color: 'red',
                font: {
                  size: '2em',
                },
              }
            },
          }
        </script>

        <style>
          .text {
            color: v-bind(color);

            /* expressions (wrap in quotes) */
            font-size: v-bind('font.size');
          }
        </style>
        `
    },

    // toRefs
    {
      // https://github.com/vuejs/eslint-plugin-vue/issues/1643
      filename: 'test.vue',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      },
      code: `
      <template>
        <span v-for="(item, index) of pages" :key="index" @click="changePage(item)">
          {{ item }}
        </span>
      </template>

      <script setup lang="ts">
      import {
        computed,
        defineProps,
        toRefs,
        withDefaults,
        defineEmits,
        ComputedRef,
      } from 'vue';
      import { getPagesOnPagination } from '@/libs/pagination';

      const props = withDefaults(
        defineProps<{
          currentPage: number;
          totalRows: number;
          rowsPerPage: number;
        }>(),
        {
          currentPage: 1,
          totalRows: 100,
          rowsPerPage: 10,
        }
      );
      const { currentPage, totalRows, rowsPerPage } = toRefs(props);

      const totalPages = computed(() =>
        Math.ceil(totalRows.value / rowsPerPage.value)
      );

      const pages: ComputedRef<(number | '...')[]> = computed(() =>
        getPagesOnPagination(currentPage.value, totalPages.value)
      );

      const emit = defineEmits<{
        (e: 'changePage', page: number): void;
      }>();

      function changePage(page: number | '...') {
        if (page === '...') {
          return;
        }
        emit('changePage', page);
      }
      </script>

      <style lang="scss" scoped>
      //
      </style>`
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
    },

    // contexts
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: ['x'],
          data: () => ({
              y: x
          })
        };
      </script>
      `,
      errors: ["'x' of property found, but never used."]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: ['x'],
          computed: {
            [(vm) => vm.x * 2]: y
          }
        };
      </script>
      `,
      errors: ["'x' of property found, but never used."]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: ['x'],
          computed: {
            y: {
              handler: (vm) => vm.z * 2,
              deep: (vm) => vm.x * 2
            }
          }
        };
      </script>
      `,
      errors: ["'x' of property found, but never used."]
    },

    // deep data
    {
      filename: 'test.vue',
      code: `
        <template>
         {{ foo.baz.a }}
        </template>
        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                  baz: {
                    b: 1
                  }
                }
              }
            },
            methods: {
              a () {
                return this.foo.bar
              }
            }
          };
        </script>
      `,
      options: deepDataOptions,
      errors: [
        {
          message: "'foo.baz.b' of data found, but never used.",
          line: 14,
          column: 21
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                  baz: {
                    b: 1
                  }
                }
              }
            },
            created() {
              fn(this.foo)
            }
          };
          function fn(b) {
            b.baz()
          }
        </script>
      `,
      options: deepDataOptions,
      errors: [
        "'foo.bar' of data found, but never used.",
        "'foo.baz.b' of data found, but never used."
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                  baz: {
                    b: 1
                  }
                }
              }
            },
            created() {
              fn(this.foo)
            }
          };
          function fn(foo) {
            return foo.bar + foo.baz.b
          }
        </script>
      `,
      options: deepDataOptions,
      errors: ["'foo.bar.a' of data found, but never used."]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                  baz: {
                    b: 1
                  }
                }
              }
            },
            created() {
              fn(this.foo)
              this.foo.baz
            }
          };
          function fn(foo) {
            foo.bar
          }
        </script>
      `,
      options: deepDataOptions,
      errors: [
        "'foo.bar.a' of data found, but never used.",
        "'foo.baz.b' of data found, but never used."
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                }
              }
            },
            mounted () {
              if (this.foo.bar) {
              }
            }
          };
        </script>
      `,
      options: deepDataOptions,
      errors: ["'foo.bar.a' of data found, but never used."]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            data() {
              return {
                foo: {
                  bar: {
                    a: 1
                  },
                }
              }
            },
            methods: {
              fn () {
                return this.foo.bar ? 1 : 2
              }
            }
          };
        </script>
      `,
      options: deepDataOptions,
      errors: ["'foo.bar.a' of data found, but never used."]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          export default {
            data() {
              const bar = {
                a: 1
              }
              const baz = {
                a: 1
              }
              return {
                foo: {
                  bar,
                  baz,
                }
              }
            },
            methods: {
              fn () {
                console.log(this.foo.bar + this.foo.baz)
              }
            }
          };
        </script>
      `,
      options: deepDataOptions,
      errors: [
        {
          message: "'foo.bar.a' of data found, but never used.",
          line: 6,
          column: 17
        },
        {
          message: "'foo.baz.a' of data found, but never used.",
          line: 9,
          column: 17
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
      </template>
      <script>
      export default {
        props: {
          _a: String,
          /** @public Props do not support public. */
          a: String,
        },
        setup() {
          return {
            /** @public */
            b: 42,
            _b: 42
          }
        },
        data () {
          return {
            c: {
              /** @public */
              _c1: 42,
              /** @public */
              _c2: 42
            },
            _c: 42
          }
        },
        computed: {
          /** @public */
          // _eslint-disable-next-line foo
          d () { return this.c._c1 },
          /* non jsdoc @public */
          _d () { return 42 }
        },
        methods: {
          /** @public */
          e () {},
          _e () {},
          f:
            /** @public */
            function () {},
          _f: function () {},
          g:
            /** @public */
            () => {},
          _g: () => {},
        },
      }
      </script>`,
      options: [
        {
          groups: ['props', 'data', 'computed', 'methods', 'setup'],
          ignorePublicMembers: true,
          deepData: true
        }
      ],
      errors: [
        "'_a' of property found, but never used.",
        "'a' of property found, but never used.",
        "'_b' of property returned from `setup()` found, but never used.",
        "'c._c2' of data found, but never used.",
        "'_c' of data found, but never used.",
        "'_d' of computed property found, but never used.",
        "'_e' of method found, but never used.",
        "'_f' of method found, but never used.",
        "'_g' of method found, but never used."
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
      </template>
      <script>
      export default {
        // Edge case
        data: [
          /** @public doesn't public supports array style */
          'a',
          /** @public doesn't public supports array style */
          'b'
        ]
      }
      </script>`,
      options: [
        {
          groups: ['data'],
          ignorePublicMembers: true,
          deepData: true
        }
      ],
      errors: [
        "'a' of data found, but never used.",
        "'b' of data found, but never used."
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        {{a}}
      </template>
      <script setup>
      const props = defineProps(['a', 'b', 'c'])
      props.b
      </script>`,
      errors: ["'c' of property found, but never used."]
    },

    // expose
    {
      filename: 'test.vue',
      code: `
      <template>
        {{a}}
      </template>
      <script>
      export default {
        expose: ['a', 'c', 'e', 'g'],
        props: ['a', 'b'],
        data() {
          return {
            c: 42,
            d: 42
          }
        },
        computed:{
          e() {},
          f() {}
        },
        methods:{
          g() {},
          h() {}
        }
      }
      </script>`,
      options: allOptions,
      errors: [
        "'b' of property found, but never used.",
        "'d' of data found, but never used.",
        "'f' of computed property found, but never used.",
        "'h' of method found, but never used."
      ]
    },

    // toRef, toRefs
    {
      filename: 'test.vue',
      code: `
      <script>
        import {toRefs} from 'vue'

        export default {
          props: ['foo', 'bar'],
          setup(props) {
            const {foo} = toRefs(props)
          },
        }
      </script>
      `,
      errors: ["'bar' of property found, but never used."]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        import {toRef} from 'vue'

        export default {
          props: ['foo', 'bar'],
          setup(props) {
            const foo = toRef(props, 'foo')
          },
        }
      </script>
      `,
      errors: ["'bar' of property found, but never used."]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        import {toRefs} from 'vue'

        export default {
          data() {
            return {
              foo: {
                bar: {
                  a: 1
                },
                baz: {
                  b: 1
                }
              }
            }
          },
          methods: {
            m () {
              const {foo} = toRefs(this)
              f(foo.value.bar)
            }
          }
        }
      </script>
      `,
      options: deepDataOptions,
      errors: ["'foo.baz' of data found, but never used."]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        import {toRefs} from 'vue'

        export default {
          data() {
            return {
              foo: {
                bar: {
                  a: 1,
                  b: 1,
                },
                baz: {
                  a: 1
                }
              }
            }
          },
          methods: {
            m () {
              const {bar, baz} = toRefs(this.foo)
              f(bar.value.a)
              f(bar.unknown.b)
              f(bar.b)
            }
          }
        }
      </script>
      `,
      options: deepDataOptions,
      errors: [
        "'foo.bar.b' of data found, but never used.",
        "'foo.baz.a' of data found, but never used."
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        import {toRef} from 'vue'

        export default {
          data() {
            return {
              foo: {
                bar: {
                  a: 1,
                  b: 1,
                },
                baz: {
                  a: 1
                }
              }
            }
          },
          methods: {
            m () {
              const bar = toRef(this.foo, 'bar')
              f(bar.value.a)
              f(bar.unknown.b)
              f(bar.b)
            }
          }
        }
      </script>
      `,
      options: deepDataOptions,
      errors: [
        "'foo.bar.b' of data found, but never used.",
        "'foo.baz' of data found, but never used."
      ]
    }
  ]
})
