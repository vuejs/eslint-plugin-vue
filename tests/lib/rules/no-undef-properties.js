/**
 * @fileoverview Disallow undefined properties.
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-undef-properties')
const {
  getTypeScriptFixtureTestOptions
} = require('../../test-utils/typescript')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-undef-properties', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :attr="foo"> {{ bar }} </div>
      </template>
      <script>
        export default {
          props: ['foo'],
          data () {
            return {
              bar: 42
            }
          },
          created() {
            this.baz()
          },
          methods: {
            baz() {}
          }
        };
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :attr="foo"> {{ bar }} </div>
      </template>
      <script>
        export default {
          inject: ['foo'],
          setup() {
            return {
              bar: 42
            }
          },
          computed: {
            baz() {
              return 42
            }
          },
          created() {
            console.log(this.baz)
          }
        };
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div> {{ foo }} </div>
      </template>
      <script>
        export default {
          asyncData() {
            return {
              foo: 42
            }
          },
        };
      </script>
      `
    },
    //default ignores
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>{{ $t('foo') }}</div>
      </template>
      <script>
        export default {
          mounted() {
            const hash = this.$route.hash
            this.$on('click', this.click)
          },
          methods: {
            click() {
              this.$nextTick()
            }
          }
        }
      </script>
      `
    },
    {
      // global in template
      filename: 'test.vue',
      code: `
      <template>
        <div>{{ undefined }}</div>
      </template>
      <script>
        export default {
        }
      </script>
      `
    },

    //watch
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: ['foo'],
          watch: {
            foo: 'bar'
          },
          methods: {
            bar() {}
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
          data () {
            return {
              foo: {
                bar :42
              }
            }
          },
          watch: {
            'foo.bar': 'baz'
          },
          methods: {
            baz() {}
          }
        };
      </script>
      `
    },

    // props
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: ['foo'],
          data (props) {
            return {
              bar: props.foo
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
          props: ['foo'],
          setup (props) {
            return {
              bar: props.foo
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
          functional: true,
          props: ['foo'],
          render (_, {props}) {
            return h(props.foo)
          }
        };
      </script>
      `
    },

    // arg vm
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data () {return {foo:42}},
          render (vm) {
            return h(vm.foo)
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
          data () {return {foo:42}},
          computed: { p: (vm) => vm.foo }
        };
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data () {return {foo:42}},
          computed: { p: { get: (vm) => vm.foo } }
        };
      </script>
      `
    },

    // deep
    {
      filename: 'test.vue',
      code: `
      <template> {{ foo.bar }} </template>
      <script>
        export default {
          data () {
            return {
              foo: {
                bar: 42
              }
            }
          },
        };
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template> {{ foo.bar.baz }} </template>
      <script>
        export default {
          data () {
            return {
              foo: {
                bar: {
                  baz: 42
                }
              }
            }
          },
        };
      </script>
      `
    },

    // track
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data () {
            return {
              foo: 42
            }
          },
          mounted() {
            fn(this)
          }
        };

        function fn(vm) {
          return vm.foo
        }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        const fn = function(vm) {
          return vm.foo
        }
        export default {
          data () {
            return {
              foo: 42
            }
          },
          mounted() {
            fn(this)
          }
        };
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        function a(vm) {
          return vm.foo
        }
        const fn = a
        export default {
          data () {
            return {
              foo: 42
            }
          },
          mounted() {
            fn(this)
          }
        };
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        function a(vm) {
          return vm.foo2
        }
        export default {
          data () {
            return {
              foo: 42
            }
          },
          mounted() {
            b(this)
          }
        };
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        function a(vm) {
          return vm.foo2
        }
        const b = unknown
        export default {
          data () {
            return {
              foo: 42
            }
          },
          mounted() {
            b(this)
          }
        };
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        function a(vm) {
          return vm.foo2
        }
        let b = a
        export default {
          data () {
            return {
              foo: 42
            }
          },
          mounted() {
            b(this)
          }
        };
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        function fn( { foo } = {} ) {
        }
        export default {
          data () {
            return {
              foo: 42
            }
          },
          mounted() {
            fn(this)
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
          data () {
            return {
              foo: 42
            }
          },
          mounted() {
            const { foo = 42 } = this
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
          data () {
            return {
              foo: {
                bar: 42
              }
            }
          },
          mounted() {
            const { foo : { bar = 42 } = {} } = this
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
          data () {
            return {
              foo: {
                bar: 42
              }
            }
          },
          mounted() {
            ({ foo : { bar: v = 42 } = {} } = this)
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
          data () {
            return {
              foo: 41
            }
          },
          mounted() {
            const vm = this
            vm.foo
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
          data () {
            return {
              foo: {
                bar: 42
              }
            }
          },
          mounted() {
            const vm = this
            ;(vm?.foo)?.bar
          }
        };
      </script>
      `
    },

    // Vue2 functional component
    {
      filename: 'test.vue',
      code: `
      <template functional>
        <div>{{props.a}} {{props.b}}</div>
      </template>

      <script>
      export default {
        props: {
          a: String,
          b: String,
        },
      };
      </script>`
    },

    {
      // unknown type
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      import type { Props1 } from './test01';

      defineProps<Props1>();

      </script>

      <template>
      <div>{{ foo }}</div>
      <div>{{ unknown }}</div>
      </template>`,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      // Vuex
      filename: 'test.vue',
      code: `
      <script>
      import { mapState } from 'vuex';

      export default {
        computed: {
          ...mapState({
            a: (vm) => vm.a,
            b: (vm) => vm.b,
          })
        },
        methods: {
          c() {return this.a * this.b}
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapActions } from 'vuex';

      export default {
          methods: {
          ...mapActions({
            a: 'a',
            b: 'b',
          }),
          c() {return this.a()},
          d() {return this.b()},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapMutations } from 'vuex';

      export default {
          methods: {
          ...mapMutations({
            a: 'a',
            b: 'b',
          }),
          c() {return this.a()},
          d() {return this.b()},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapActions } from 'vuex';

      export default {
          methods: {
          ...mapActions(['a', 'b']),
          c() {return this.a()},
          d() {return this.b()},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapMutations } from 'vuex';

      export default {
        methods: {
          ...mapMutations(['a', 'b']),
          c() {return this.a()},
          d() {return this.b()},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapGetters } from 'vuex';

      export default {
        computed: {
          ...mapGetters(['a', 'b'])
        },
        methods: {
          c() {return this.a},
          d() {return this.b},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `
    },
    {
      // Pinia
      filename: 'test.vue',
      code: `
      <script>
      import { mapGetters } from 'pinia'
      import { useStore } from '../store'

      export default {
        computed: {
          ...mapGetters(useStore, ['a', 'b'])
        },
        methods: {
          c() {return this.a},
          d() {return this.b},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapState } from 'pinia'
      import { useStore } from '../store'

      export default {
        computed: {
          ...mapState(useStore, {
            a: 'a',
            b: store => store.b,
          })
        },
        methods: {
          c() {return this.a},
          d() {return this.b},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapWritableState } from 'pinia'
      import { useStore } from '../store'

      export default {
        computed: {
          ...mapWritableState(useStore, {
            a: 'a',
            b: 'b',
          })
        },
        methods: {
          c() {return this.a},
          d() {return this.b},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapWritableState } from 'pinia'
      import { useStore } from '../store'

      export default {
        computed: {
          ...mapWritableState(useStore, ['a', 'b'])
        },
        methods: {
          c() {return this.a},
          d() {return this.b},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapActions } from 'pinia'
      import { useStore } from '../store'

      export default {
          methods: {
          ...mapActions(useStore, ['a', 'b']),
          c() {return this.a()},
          d() {return this.b()},
        }
      }
      </script>
      <template>
      {{ a() }} {{ b() }}
      </template>
      `
    },
    `
    <script setup>
    const model = defineModel();
    const woof = computed(() => model.value);
    </script>
    <template>
      <div id="app">Woof: {{ woof }}</div>
    </template>`
  ],

  invalid: [
    // undef property
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :attr="foo2"> {{ bar2 }} </div>
      </template>
      <script>
        export default {
          props: ['foo'],
          data () {
            return {
              bar: 42
            }
          },
          created() {
            this.baz2()
          },
          methods: {
            baz() {}
          }
        };
      </script>
      `,
      errors: [
        {
          message: "'foo2' is not defined.",
          line: 3
        },
        {
          message: "'bar2' is not defined.",
          line: 3
        },
        {
          message: "'baz2' is not defined.",
          line: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :attr="foo2"> {{ bar2 }} </div>
      </template>
      <script>
        export default {
          inject: ['foo'],
          setup() {
            return {
              bar: 42
            }
          },
          computed: {
            baz() {
              return 42
            }
          },
          created() {
            console.log(this.baz2)
          }
        };
      </script>
      `,
      errors: [
        {
          message: "'foo2' is not defined.",
          line: 3
        },
        {
          message: "'bar2' is not defined.",
          line: 3
        },
        {
          message: "'baz2' is not defined.",
          line: 19
        }
      ]
    },

    // same names
    {
      filename: 'test.vue',
      code: `
      <template>
        <div :attr="foo2"> {{ foo2 }} </div>
      </template>
      <script>
        export default {
          props: ['foo'],
          created() {
            this.foo2

            this.foo2
          }
        };
      </script>
      `,
      errors: [
        {
          message: "'foo2' is not defined.",
          line: 9
        }
      ]
    },

    //watch
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          props: ['foo'],
          watch: {
            foo2: 'bar2'
          },
          methods: {
            bar() {}
          }
        };
      </script>
      `,
      errors: [
        {
          message: "'foo2' is not defined.",
          line: 6
        },
        {
          message: "'bar2' is not defined.",
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data () {
            return {
              foo: {
                bar :42
              }
            }
          },
          watch: {
            'foo2.bar': 'baz',
            'foo.bar2': 'baz',
          },
          methods: {
            baz() {}
          }
        };
      </script>
      `,
      errors: [
        {
          message: "'foo2' is not defined.",
          line: 12
        },
        {
          message: "'foo.bar2' is not defined.",
          line: 13
        }
      ]
    },

    // props
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            foo () {}
          },
          data (props) {
            return {
              bar: props.foo
            }
          }
        };
      </script>
      `,
      errors: ["'foo' is not defined in props."]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          computed: {
            foo () {}
          },
          setup (props) {
            return {
              bar: props.foo
            }
          }
        };
      </script>
      `,
      errors: ["'foo' is not defined in props."]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          functional: true,
          computed: {
            foo () {}
          },
          render (_, {props}) {
            return h(props.foo)
          }
        };
      </script>
      `,
      errors: ["'foo' is not defined in props."]
    },

    // arg vm
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data () {return {foo:42}},
          render (vm) {
            return h(vm.bar)
          }
        };
      </script>
      `,
      errors: ["'bar' is not defined."]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data () {return {foo:42}},
          computed: { p: (vm) => vm.bar }
        };
      </script>
      `,
      errors: ["'bar' is not defined."]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data () {return {foo:42}},
          computed: { p: { get: (vm) => vm.bar } }
        };
      </script>
      `,
      errors: ["'bar' is not defined."]
    },

    // deep
    {
      filename: 'test.vue',
      code: `
      <template> {{ foo.baz }} </template>
      <script>
        export default {
          data () {
            return {
              foo: {
                bar: 42
              }
            }
          },
        };
      </script>
      `,
      errors: ["'foo.baz' is not defined."]
    },
    {
      filename: 'test.vue',
      code: `
      <template> {{ foo.bar.baz2 }} </template>
      <script>
        export default {
          data () {
            return {
              foo: {
                bar: {
                  baz: 42
                }
              }
            }
          },
        };
      </script>
      `,
      errors: ["'foo.bar.baz2' is not defined."]
    },

    // track
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data () {
            return {
              foo: 42
            }
          },
          mounted() {
            fn(this)
          }
        };

        function fn(vm) {
          return vm.foo2
        }
      </script>
      `,
      errors: [
        {
          message: "'foo2' is not defined.",
          line: 15
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        const fn = function(vm) {
          return vm.foo2
        }
        export default {
          data () {
            return {
              foo: 42
            }
          },
          mounted() {
            fn(this)
          }
        };
      </script>
      `,
      errors: [
        {
          message: "'foo2' is not defined.",
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        function a(vm) {
          return vm.foo2
        }
        const fn = a
        export default {
          data () {
            return {
              foo: 42
            }
          },
          mounted() {
            fn(this)
          }
        };
      </script>
      `,
      errors: [
        {
          message: "'foo2' is not defined.",
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        function fn( { foo2 } = {} ) {
        }
        export default {
          data () {
            return {
              foo: 42
            }
          },
          mounted() {
            fn(this)
          }
        };
      </script>
      `,
      errors: [
        {
          message: "'foo2' is not defined.",
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data () {
            return {
              foo: 42
            }
          },
          mounted() {
            const { foo2 = 42 } = this
          }
        };
      </script>
      `,
      errors: [
        {
          message: "'foo2' is not defined.",
          line: 10
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data () {
            return {
              foo: {
                bar: 42
              }
            }
          },
          mounted() {
            const { foo : { bar2 = 42 } = {} } = this
          }
        };
      </script>
      `,
      errors: [
        {
          message: "'foo.bar2' is not defined.",
          line: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data () {
            return {
              foo: {
                bar: 42
              }
            }
          },
          mounted() {
            ({ foo : { bar2: v = 42 } = {} } = this)
          }
        };
      </script>
      `,
      errors: [
        {
          message: "'foo.bar2' is not defined.",
          line: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data () {
            return {
              foo: 41
            }
          },
          mounted() {
            const vm = this
            vm.foo2
          }
        };
      </script>
      `,
      errors: [
        {
          message: "'foo2' is not defined.",
          line: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
        export default {
          data () {
            return {
              foo: {
                bar: 42
              }
            }
          },
          mounted() {
            const vm = this
            ;(vm?.foo)?.bar2
          }
        };
      </script>
      `,
      errors: [
        {
          message: "'foo.bar2' is not defined.",
          line: 13
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <!-- ✓ GOOD -->
        <div>{{ name }}: {{ count }}</div>
        <!-- ✗ BAD -->
        <div>{{ label }}: {{ cnt }}</div>
      </template>
      <script setup>
      const prop = defineProps(['name', 'def'])
      let count = 0

      /* ✓ GOOD */
      watch(() => prop.def, () => console.log('Updated!'))

      /* ✗ BAD */
      watch(() => prop.undef, () => console.log('Updated!'))
      </script>
      `,
      errors: [
        {
          message: "'label' is not defined.",
          line: 6
        },
        {
          message: "'cnt' is not defined.",
          line: 6
        },
        {
          message: "'undef' is not defined.",
          line: 16
        }
      ]
    },

    // Vue2 functional component
    {
      filename: 'test.vue',
      code: `
      <template functional>
        <div>{{props.a}} {{props.b}} {{props.c}}</div>
      </template>

      <script>
      export default {
        props: {
          a: String,
          b: String,
        },
      };
      </script>`,
      errors: [
        {
          message: "'c' is not defined.",
          line: 3,
          column: 46
        }
      ]
    },

    {
      // known type
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      import type { Props1 } from './test01';

      defineProps<Props1>();

      </script>

      <template>
      <div>{{ foo }}</div>
      <div>{{ unknown }}</div>
      </template>`,
      errors: [
        {
          message: "'unknown' is not defined.",
          line: 11
        }
      ],
      ...getTypeScriptFixtureTestOptions()
    },

    {
      // defineModel
      filename: 'test.vue',
      code: `
      <script setup>
      const m = defineModel()
      const a = defineModel('A')
      const [withModifiers, modifiers] = defineModel('withModifiers')
      </script>
      <template>
        <div>
          {{ m }} {{ modelValue }}
          {{ a }} {{ A }}
          {{withModifiers}} {{modifiers}}
        </div>

        <div>{{ undef }}</div>
      </template>
      `,
      errors: [
        {
          message: "'undef' is not defined.",
          line: 14
        }
      ]
    },
    {
      // Vuex
      filename: 'test.vue',
      code: `
      <script>
      import { mapState } from 'vuex';

      export default {
        computed: {
          ...mapState({
            a: (vm) => vm.a,
            b: (vm) => vm.b,
          })
        },
        methods: {
          c() {return this.a * this.g}
        }
      }
      </script>
      <template>
      {{ a }} {{ b }} {{ c }}
      </template>
      `,
      errors: [
        {
          message: "'g' is not defined.",
          line: 13
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapActions } from 'vuex';

      export default {
          methods: {
          ...mapActions({
            a: 'a',
            b: 'b',
          }),
          c() {return this.a()},
          d() {return this.f()},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `,
      errors: [
        {
          message: "'f' is not defined.",
          line: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapMutations } from 'vuex';

      export default {
          methods: {
          ...mapMutations({
            a: 'a',
            b: 'b',
          }),
          c() {return this.a()},
          d() {return this.b()},
          d() {return this.x()},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `,
      errors: [
        {
          message: "'x' is not defined.",
          line: 13
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapActions } from 'vuex';

      export default {
          methods: {
          ...mapActions(['a', 'b']),
          c() {return this.a()},
          d() {return this.b()},
          d() {return this.f()},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `,
      errors: [
        {
          message: "'f' is not defined.",
          line: 10
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapMutations } from 'vuex';

      export default {
        methods: {
          ...mapMutations(['a', 'b']),
          c() {return this.a()},
          d() {return this.b()},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }} {{ q }}
      </template>
      `,
      errors: [
        {
          message: "'q' is not defined.",
          line: 14
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapGetters } from 'vuex';

      export default {
        computed: {
          ...mapGetters(['a', 'b'])
        },
        methods: {
          c() {return this.a},
          d() {return this.b},
          d() {return this.z},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `,
      errors: [
        {
          message: "'z' is not defined.",
          line: 12
        }
      ]
    },
    {
      // Pinia
      filename: 'test.vue',
      code: `
      <script>
      import { mapGetters } from 'pinia'
      import { useStore } from '../store'

      export default {
        computed: {
          ...mapGetters(useStore, ['a', 'b'])
        },
        methods: {
          c() {return this.a},
          d() {return this.b},
          d() {return this.z},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `,
      errors: [
        {
          message: "'z' is not defined.",
          line: 13
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapState } from 'pinia'
      import { useStore } from '../store'

      export default {
        computed: {
          ...mapState(useStore, {
            a: 'a',
            b: store => store.b,
          })
        },
        methods: {
          c() {return this.a},
          d() {return this.b},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }} {{ q }}
      </template>
      `,
      errors: [
        {
          message: "'q' is not defined.",
          line: 20
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapWritableState } from 'pinia'
      import { useStore } from '../store'

      export default {
        computed: {
          ...mapWritableState(useStore, {
            a: 'a',
            b: 'b',
          })
        },
        methods: {
          c() {return this.a},
          d() {return this.b},
          d() {return this.z},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `,
      errors: [
        {
          message: "'z' is not defined.",
          line: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapWritableState } from 'pinia'
      import { useStore } from '../store'

      export default {
        computed: {
          ...mapWritableState(useStore, ['a', 'b'])
        },
        methods: {
          c() {return this.a},
          d() {return this.b},
          d() {return this.z},
        }
      }
      </script>
      <template>
      {{ a }} {{ b }}
      </template>
      `,
      errors: [
        {
          message: "'z' is not defined.",
          line: 13
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { mapActions } from 'pinia'
      import { useStore } from '../store'

      export default {
          methods: {
          ...mapActions(useStore, ['a', 'b']),
          c() {return this.a()},
          d() {return this.b()},
          d() {return this.x()},
        }
      }
      </script>
      <template>
      {{ a() }} {{ b() }}
      </template>
      `,
      errors: [
        {
          message: "'x' is not defined.",
          line: 11
        }
      ]
    }
  ]
})
