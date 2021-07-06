/**
 * @fileoverview Disallow unused refs.
 * @author Yosuke Ota
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-unused-refs')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-unused-refs', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <!-- ✓ GOOD -->
        <input ref="foo" />
      </template>
      <script>
      export default {
        mounted() {
          this.$refs.foo.value = 'foo'
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="foo" />
        <button @click="alert($refs.foo.value)">Click Me</button>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input :ref="e=>foo=e" />
        <button @click="alert($refs.foo.value)">Click Me</button>
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input id="foo" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="a" />
        <input ref="b" />
        <input ref="c" />
        <input ref="d" />
        <input ref="e" />
        <input ref="f" />
      </template>
      <script>
      export default {
        mounted() {
          this.$refs.a;
          const {b} = this.$refs;
          ({c} = this.$refs);
          $refs.d;
          const {e} = $refs;
          ({f} = $refs);
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="a" />
        <input ref="b" />
        <input ref="c" />
        <input ref="d" />
        <input ref="e" />
      </template>
      <script>
      export default {
        mounted() {
          this.$refs?.a;
          this?.$refs.b;
          $refs?.c;
          this?.$refs?.d;
          (this?.$refs)?.e;
        }
      }
      </script>
      `
    },

    // has unknown
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="foo" />
        <input ref="bar" />
      </template>
      <script>
      export default {
        mounted() {
          this.$refs[foo].value = 'foo'
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
        <button @click="alert($refs[foo].value)">Click Me</button>
        <input ref="y" />
        <input ref="z" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
        <button @click="alert($refs[foo].value)">Click Me</button>
        <input ref="y" />
        <button @click="alert($refs.z.value)">Click Me</button>
        <input ref="z" />
      </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
      </template>
      <script>
      export default {
        mounted() {
          this.$refs[a];
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
      </template>
      <script>
      export default {
        mounted() {
          const {[a]: a} = this.$refs;
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
      </template>
      <script>
      export default {
        mounted() {
          ({[a]: a} = this.$refs);
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
      </template>
      <script>
      export default {
        mounted() {
          const {...a} = this.$refs;
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
      </template>
      <script>
      export default {
        mounted() {
          const a = this.$refs;
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
      </template>
      <script>
      export default {
        mounted() {
          a = this.$refs;
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
      </template>
      <script>
      export default {
        mounted() {
          fn(this.$refs)
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
      </template>
      <script>
      export default {
        mounted() {
          for(const k in this.$refs) {}
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
      </template>
      <script>
      export default {
        methods: {
          getRefs() {
            return this.$refs
          }
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
      </template>
      <script>
      import {ref} from 'vue'
      export default {
        setup() {
          const x = ref(null)
          return {
            x
          }
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
      </template>
      <script setup>
      import {ref} from 'vue'
      const x = ref(null)
      </script>
      `
    }
  ],

  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="foo" />
      </template>
      `,
      errors: [
        {
          message: "'foo' is defined as ref, but never used.",
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <!-- ✓ GOOD -->
        <input ref="foo" />

        <!-- ✗ BAD (bar is not used) -->
        <input ref="bar" />
      </template>
      <script>
      export default {
        mounted() {
          this.$refs.foo.value = 'foo'
        }
      }
      </script>
      `,
      errors: [
        {
          message: "'bar' is defined as ref, but never used.",
          line: 7
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
        <button @click="alert($refs.foo.value)">Click Me</button>
      </template>
      `,
      errors: [
        {
          message: "'x' is defined as ref, but never used.",
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <button @click="alert($refs.foo.value)">Click Me</button>
        <input ref="x" />
      </template>
      `,
      errors: [
        {
          message: "'x' is defined as ref, but never used.",
          line: 4
        }
      ]
    },

    // illegal use
    {
      filename: 'test.vue',
      code: `
      <template>
        <input ref="x" />
      </template>
      <script>
      export default {
        mounted() {
          this.$refs();
          x[this.$refs];
          this.$refs = foo;
          const {[this.$refs]: a} = foo;
          const [b] = this.$refs;
          ([b] = this.$refs);
        }
      }
      </script>
      `,
      errors: ["'x' is defined as ref, but never used."]
    }
  ]
})
