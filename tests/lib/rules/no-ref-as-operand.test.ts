/**
 * @author Yosuke Ota
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-ref-as-operand'
import vueEslintParser from 'vue-eslint-parser'
import { getTypeScriptFixtureTestOptions } from '../../test-utils/typescript'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-ref-as-operand', rule, {
  valid: [
    `
    import { ref } from 'vue'
    const count = ref(0)
    console.log(count.value) // 0

    count.value++
    console.log(count.value) // 1
    `,
    `
    <script>
      import { ref } from 'vue'
      export default {
        setup() {
          const count = ref(0)
          console.log(count.value) // 0

          count.value++
          console.log(count.value) // 1
          return {
            count
          }
        }
      }
    </script>
    `,
    `
    <script>
      import { ref } from '@vue/composition-api'
      export default {
        setup() {
          const count = ref(0)
          console.log(count.value) // 0

          count.value++
          console.log(count.value) // 1
          return {
            count
          }
        }
      }
    </script>
    `,
    `
    import { ref } from 'vue'
    const count = ref(0)
    if (count.value) {}
    switch (count.value) {}
    var foo = -count.value
    var foo = +count.value
    count.value++
    count.value--
    count.value + 1
    1 - count.value
    count.value || other
    count.value && other
    var foo = count.value ? x : y
    `,
    `
    import { ref } from 'vue'
    const foo = ref(true)
    if (bar) foo
    `,
    `
    import { ref } from 'vue'
    const foo = ref(true)
    var a = other || foo // ignore
    var b = other && foo // ignore

    let bar = ref(true)
    var a = bar || other
    var b = bar || other
    `,
    `
    import { ref } from 'vue'
    let count = not_ref(0)

    count++
    `,
    `
    import { ref } from 'vue'
    const foo = ref(0)
    const bar = ref(0)
    var baz = x ? foo : bar
    `,
    `
    import { ref } from 'vue'
    // Probably wrong, but not checked by this rule.
    const {value} = ref(0)
    value++
    `,
    `
    import { ref } from 'vue'
    const count = ref(0)
    function foo() {
      let count = 0
      count++
    }
    `,
    `
    import { ref } from 'unknown'
    const count = ref(0)
    count++
    `,
    `
    import { ref } from 'vue'
    const count = ref
    count++
    `,
    `
    import { ref } from 'vue'
    const count = ref(0)
    foo = count
    `,
    `
    import { ref } from 'vue'
    const count = ref(0)
    const foo = count
    `,
    `
      <script>
        import { ref, computed, toRef, customRef, shallowRef } from 'vue'
        const foo = shallowRef({})
        foo[bar] = 123
      </script>
    `,
    `
      <script>
        import { ref, computed, toRef, customRef, shallowRef } from 'vue'
        const foo = shallowRef({})
        const isComp = foo.effect
      </script>
    `,
    `
      <script>
      import { ref } from 'vue'
      let foo;

      if (!foo) {
        foo = ref(5);
      }
      </script>
    `,
    `
      <script>
      import { ref } from 'vue'
      let foo = undefined;

      if (!foo) {
        foo = ref(5);
      }
      </script>
    `,
    `
      <script>
      import { ref } from 'vue'
      const foo = ref(0)
      func(foo)
      function func(foo) {}
      </script>
    `,
    `
      <script>
      import { ref } from 'vue'
      const foo = ref(0)
      tag\`\${foo}\`
      function tag(arr, ...args) {}
      </script>
    `,
    `
    <script setup>
    const model = defineModel();
    console.log(model.value);
    function process() {
      if (model.value) console.log('foo')
    }
    function update(value) {
      model.value = value;
    }
    </script>
    `,
    `
    <script setup>
    const [model, mod] = defineModel();
    console.log(model.value);
    function process() {
      if (model.value) console.log('foo')
    }
    function update(value) {
      model.value = value;
    }
    </script>
    `,
    `
    <script setup>
    const emit = defineEmits(['test'])
    const [model, mod] = defineModel();

    function update() {
      emit('test', model.value)
    }
    </script>
    `,
    `
    <script>
    import { ref, defineComponent } from 'vue'

    export default defineComponent({
      emits: ['incremented'],
      setup(_, ctx) {
        const counter = ref(0)

        ctx.emit('incremented', counter.value)

        return {
          counter
        }
      }
    })
    </script>
    `,
    `
    <script>
    import { ref, defineComponent } from 'vue'

    export default defineComponent({
      emits: ['incremented'],
      setup(_, { emit }) {
        const counter = ref(0)

        emit('incremented', counter.value)

        return {
          counter
        }
      }
    })
    </script>
    `,
    `
    <script>
    import { ref, defineComponent } from 'vue'

    export default defineComponent({
      emits: ['incremented'],
      setup(_, { emit }) {
        const counter = ref(0)

        emit('incremented', counter.value, 'xxx')

        return {
          counter
        }
      }
    })
    </script>
    `,
    `
    <script>
    import { ref, defineComponent } from 'vue'

    export default defineComponent({
      emits: ['incremented'],
      setup(_, { emit }) {
        const counter = ref(0)

        emit('incremented', 'xxx')

        return {
          counter
        }
      }
    })
    </script>
    `,
    `
    <script>
    import { ref, defineComponent } from 'vue'

    export default defineComponent({
      emits: ['incremented'],
      setup(_, { emit }) {
        const counter = ref(0)

        emit('incremented')

        return {
          counter
        }
      }
    })
    </script>
    `
  ],
  invalid: [
    {
      code: `
      import { ref } from 'vue'
      let count = ref(0)

      count++ // error
      console.log(count + 1) // error
      console.log(1 + count) // error
      `,
      output: `
      import { ref } from 'vue'
      let count = ref(0)

      count.value++ // error
      console.log(count.value + 1) // error
      console.log(1 + count.value) // error
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 12
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 6,
          column: 19,
          endLine: 6,
          endColumn: 24
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 7,
          column: 23,
          endLine: 7,
          endColumn: 28
        }
      ]
    },
    {
      code: `
      <script>
        import { ref } from 'vue'
        export default {
          setup() {
            let count = ref(0)

            count++ // error
            console.log(count + 1) // error
            console.log(1 + count) // error
            return {
              count
            }
          }
        }
      </script>
      `,
      output: `
      <script>
        import { ref } from 'vue'
        export default {
          setup() {
            let count = ref(0)

            count.value++ // error
            console.log(count.value + 1) // error
            console.log(1 + count.value) // error
            return {
              count
            }
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 8,
          column: 13,
          endLine: 8,
          endColumn: 18
        },
        {
          messageId: 'requireDotValue',
          line: 9,
          column: 25,
          endLine: 9,
          endColumn: 30
        },
        {
          messageId: 'requireDotValue',
          line: 10,
          column: 29,
          endLine: 10,
          endColumn: 34
        }
      ]
    },
    {
      code: `
      <script>
        import { ref } from '@vue/composition-api'
        export default {
          setup() {
            let count = ref(0)

            count++ // error
            console.log(count + 1) // error
            console.log(1 + count) // error
            return {
              count
            }
          }
        }
      </script>
      `,
      output: `
      <script>
        import { ref } from '@vue/composition-api'
        export default {
          setup() {
            let count = ref(0)

            count.value++ // error
            console.log(count.value + 1) // error
            console.log(1 + count.value) // error
            return {
              count
            }
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 8,
          column: 13,
          endLine: 8,
          endColumn: 18
        },
        {
          messageId: 'requireDotValue',
          line: 9,
          column: 25,
          endLine: 9,
          endColumn: 30
        },
        {
          messageId: 'requireDotValue',
          line: 10,
          column: 29,
          endLine: 10,
          endColumn: 34
        }
      ]
    },
    {
      code: `
      import { ref } from 'vue'
      const foo = ref(true)
      if (foo) {
        //
      }
      `,
      output: `
      import { ref } from 'vue'
      const foo = ref(true)
      if (foo.value) {
        //
      }
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 14
        }
      ]
    },
    {
      code: `
      import { ref } from 'vue'
      const foo = ref(true)
      switch (foo) {
        //
      }
      `,
      output: `
      import { ref } from 'vue'
      const foo = ref(true)
      switch (foo.value) {
        //
      }
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 18
        }
      ]
    },
    {
      code: `
      import { ref } from 'vue'
      const foo = ref(0)
      var a = -foo
      var b = +foo
      var c = !foo
      var d = ~foo
      `,
      output: `
      import { ref } from 'vue'
      const foo = ref(0)
      var a = -foo.value
      var b = +foo.value
      var c = !foo.value
      var d = ~foo.value
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 4,
          column: 16,
          endLine: 4,
          endColumn: 19
        },
        {
          messageId: 'requireDotValue',
          line: 5,
          column: 16,
          endLine: 5,
          endColumn: 19
        },
        {
          messageId: 'requireDotValue',
          line: 6,
          column: 16,
          endLine: 6,
          endColumn: 19
        },
        {
          messageId: 'requireDotValue',
          line: 7,
          column: 16,
          endLine: 7,
          endColumn: 19
        }
      ]
    },
    {
      code: `
      import { ref } from 'vue'
      let foo = ref(0)
      foo += 1
      foo -= 1
      baz += foo
      baz -= foo
      `,
      output: `
      import { ref } from 'vue'
      let foo = ref(0)
      foo.value += 1
      foo.value -= 1
      baz += foo.value
      baz -= foo.value
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 10
        },
        {
          messageId: 'requireDotValue',
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 10
        },
        {
          messageId: 'requireDotValue',
          line: 6,
          column: 14,
          endLine: 6,
          endColumn: 17
        },
        {
          messageId: 'requireDotValue',
          line: 7,
          column: 14,
          endLine: 7,
          endColumn: 17
        }
      ]
    },
    {
      code: `
      import { ref } from 'vue'
      const foo = ref(true)
      var a = foo || other
      var b = foo && other
      `,
      output: `
      import { ref } from 'vue'
      const foo = ref(true)
      var a = foo.value || other
      var b = foo.value && other
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 18
        },
        {
          messageId: 'requireDotValue',
          line: 5,
          column: 15,
          endLine: 5,
          endColumn: 18
        }
      ]
    },
    {
      code: `
      import { ref } from 'vue'
      let foo = ref(true)
      var a = foo ? x : y
      `,
      output: `
      import { ref } from 'vue'
      let foo = ref(true)
      var a = foo.value ? x : y
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 4,
          column: 15,
          endLine: 4,
          endColumn: 18
        }
      ]
    },
    {
      code: `
      <script>
        import { ref } from 'vue'
        let count = ref(0)
        export default {
          setup() {
            count++ // error
            console.log(count + 1) // error
            console.log(1 + count) // error
            return {
              count
            }
          }
        }
      </script>
      `,
      output: `
      <script>
        import { ref } from 'vue'
        let count = ref(0)
        export default {
          setup() {
            count.value++ // error
            console.log(count.value + 1) // error
            console.log(1 + count.value) // error
            return {
              count
            }
          }
        }
      </script>
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 18
        },
        {
          messageId: 'requireDotValue',
          line: 8,
          column: 25,
          endLine: 8,
          endColumn: 30
        },
        {
          messageId: 'requireDotValue',
          line: 9,
          column: 29,
          endLine: 9,
          endColumn: 34
        }
      ]
    },
    {
      code: `
      <script>
        import { ref, computed, toRef, customRef, shallowRef } from 'vue'
        let count = ref(0)
        let cntcnt = computed(()=>count.value+count.value)

        const state = reactive({
          foo: 1,
          bar: 2
        })

        const fooRef = toRef(state, 'foo')

        let value = 'hello'
        const cref = customRef((track, trigger) => {
          return {
            get() {
              track()
              return value
            },
            set(newValue) {
              clearTimeout(timeout)
              timeout = setTimeout(() => {
                value = newValue
                trigger()
              }, delay)
            }
          }
        })

        const foo = shallowRef({})

        count++ // error
        cntcnt++ // error

        const s = \`\${fooRef} : \${cref}\` // error x 2

        const n = foo + 1 // error
      </script>
      `,
      output: `
      <script>
        import { ref, computed, toRef, customRef, shallowRef } from 'vue'
        let count = ref(0)
        let cntcnt = computed(()=>count.value+count.value)

        const state = reactive({
          foo: 1,
          bar: 2
        })

        const fooRef = toRef(state, 'foo')

        let value = 'hello'
        const cref = customRef((track, trigger) => {
          return {
            get() {
              track()
              return value
            },
            set(newValue) {
              clearTimeout(timeout)
              timeout = setTimeout(() => {
                value = newValue
                trigger()
              }, delay)
            }
          }
        })

        const foo = shallowRef({})

        count.value++ // error
        cntcnt.value++ // error

        const s = \`\${fooRef.value} : \${cref.value}\` // error x 2

        const n = foo.value + 1 // error
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 33,
          column: 9,
          endLine: 33,
          endColumn: 14
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `computed()`.',
          line: 34,
          column: 9,
          endLine: 34,
          endColumn: 15
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `toRef()`.',
          line: 36,
          column: 22,
          endLine: 36,
          endColumn: 28
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `customRef()`.',
          line: 36,
          column: 34,
          endLine: 36,
          endColumn: 38
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `shallowRef()`.',
          line: 38,
          column: 19,
          endLine: 38,
          endColumn: 22
        }
      ]
    },
    {
      code: `
      <script>
        import { ref, computed, toRef, customRef, shallowRef } from 'vue'
        const foo = shallowRef({})
        foo.bar = 123
      </script>
      `,
      output: `
      <script>
        import { ref, computed, toRef, customRef, shallowRef } from 'vue'
        const foo = shallowRef({})
        foo.value.bar = 123
      </script>
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 5,
          column: 9,
          endLine: 5,
          endColumn: 12
        }
      ]
    },
    {
      code: `
      <script>
        import { ref } from 'vue'
        const foo = ref(123)
        const bar = foo?.bar
      </script>
      `,
      output: `
      <script>
        import { ref } from 'vue'
        const foo = ref(123)
        const bar = foo.value?.bar
      </script>
      `,
      errors: [
        {
          messageId: 'requireDotValue',
          line: 5,
          column: 21,
          endLine: 5,
          endColumn: 24
        }
      ]
    },
    {
      code: `
      <script>
      import { ref } from 'vue'
      let foo = undefined;

      if (!foo) {
        foo = ref(5);
      }
      let bar = foo;
      bar = 4;
      </script>
      `,
      output: `
      <script>
      import { ref } from 'vue'
      let foo = undefined;

      if (!foo) {
        foo = ref(5);
      }
      let bar = foo;
      bar.value = 4;
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 10,
          column: 7,
          endLine: 10,
          endColumn: 10
        }
      ]
    },
    {
      code: `
      <script>
      let model = defineModel();
      console.log(model);
      function process() {
        if (model) console.log('foo')
      }
      function update(value) {
        model = value;
      }
      </script>
      `,
      output: `
      <script>
      let model = defineModel();
      console.log(model);
      function process() {
        if (model.value) console.log('foo')
      }
      function update(value) {
        model.value = value;
      }
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `defineModel()`.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 18
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `defineModel()`.',
          line: 9,
          column: 9,
          endLine: 9,
          endColumn: 14
        }
      ]
    },
    {
      code: `
      <script setup>
      let [model, mod] = defineModel();
      console.log(model);
      function process() {
        if (model) console.log('foo')
      }
      function update(value) {
        model = value;
      }
      </script>
      `,
      output: `
      <script setup>
      let [model, mod] = defineModel();
      console.log(model);
      function process() {
        if (model.value) console.log('foo')
      }
      function update(value) {
        model.value = value;
      }
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `defineModel()`.',
          line: 6,
          column: 13,
          endLine: 6,
          endColumn: 18
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `defineModel()`.',
          line: 9,
          column: 9,
          endLine: 9,
          endColumn: 14
        }
      ]
    },
    {
      code: `
      <script setup>
      import { ref } from 'vue'
      const emits = defineEmits(['test'])
      const count = ref(0)

      function update() {
        emits('test', count)
      }
      </script>
      `,
      output: `
      <script setup>
      import { ref } from 'vue'
      const emits = defineEmits(['test'])
      const count = ref(0)

      function update() {
        emits('test', count.value)
      }
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 8,
          column: 23,
          endLine: 8,
          endColumn: 28
        }
      ]
    },
    {
      code: `
      <script>
      import { ref, defineComponent } from 'vue'

      export default defineComponent({
        emits: ['incremented'],
        setup(_, ctx) {
          const counter = ref(0)

          ctx.emit('incremented', counter)

          return {
            counter
          }
        }
      })
      </script>
      `,
      output: `
      <script>
      import { ref, defineComponent } from 'vue'

      export default defineComponent({
        emits: ['incremented'],
        setup(_, ctx) {
          const counter = ref(0)

          ctx.emit('incremented', counter.value)

          return {
            counter
          }
        }
      })
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 10,
          column: 35,
          endLine: 10,
          endColumn: 42
        }
      ]
    },
    {
      code: `
      <script>
      import { ref, defineComponent } from 'vue'

      export default defineComponent({
        emits: ['incremented'],
        setup(_, { emit }) {
          const counter = ref(0)

          emit('incremented', counter)

          return {
            counter
          }
        }
      })
      </script>
      `,
      output: `
      <script>
      import { ref, defineComponent } from 'vue'

      export default defineComponent({
        emits: ['incremented'],
        setup(_, { emit }) {
          const counter = ref(0)

          emit('incremented', counter.value)

          return {
            counter
          }
        }
      })
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 10,
          column: 31,
          endLine: 10,
          endColumn: 38
        }
      ]
    },
    {
      code: `
      <script>
      import { ref, defineComponent } from 'vue'

      export default defineComponent({
        emits: ['incremented'],
        setup(_, { emit }) {
          const counter = ref(0)

          emit('incremented', 'xxx', counter)

          return {
            counter
          }
        }
      })
      </script>
      `,
      output: `
      <script>
      import { ref, defineComponent } from 'vue'

      export default defineComponent({
        emits: ['incremented'],
        setup(_, { emit }) {
          const counter = ref(0)

          emit('incremented', 'xxx', counter.value)

          return {
            counter
          }
        }
      })
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 10,
          column: 38,
          endLine: 10,
          endColumn: 45
        }
      ]
    },
    // Auto-import
    {
      code: `
      let count = ref(0)

      count++ // error
      console.log(count + 1) // error
      console.log(1 + count) // error
      `,
      output: `
      let count = ref(0)

      count.value++ // error
      console.log(count.value + 1) // error
      console.log(1 + count.value) // error
      `,
      languageOptions: {
        globals: {
          ref: 'readonly'
        }
      },
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 4,
          column: 7,
          endLine: 4,
          endColumn: 12
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 5,
          column: 19,
          endLine: 5,
          endColumn: 24
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 6,
          column: 23,
          endLine: 6,
          endColumn: 28
        }
      ]
    }
  ]
})

const tsOptions = getTypeScriptFixtureTestOptions()
const typeScriptTester = new RuleTester({
  languageOptions: tsOptions.languageOptions
})

typeScriptTester.run('no-ref-as-operand (TypeScript type-aware)', rule, {
  valid: [
    // Composable ref used with .value
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      console.log(count.value)
      count.value++
      </script>
      `
    },
    // Plain value from composable
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { usePlainValue } from './ref-composables'
      const val = usePlainValue()
      if (val) {}
      </script>
      `
    },
    // MaybeRef pattern — should not report
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useMaybeRef } from './ref-composables'
      const val = useMaybeRef()
      if (val) {}
      </script>
      `
    },
    // Destructured object composable used with .value
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useObjectComposable } from './ref-composables'
      const { count, label } = useObjectComposable()
      console.log(count.value)
      console.log(label.value)
      </script>
      `
    },
    // Destructured array composable used with .value
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useArrayComposable } from './ref-composables'
      const [count, label] = useArrayComposable()
      console.log(count.value)
      console.log(label.value)
      </script>
      `
    },
    // Limitation: TypeScript resolves the type to `any` in update/assignment
    // expressions where using a Ref directly is a type error, so these
    // cannot be detected via type information alone.
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      count++
      </script>
      `
    },
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      count += 1
      </script>
      `
    }
  ],
  invalid: [
    // Composable ref in if statement
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      if (count) {}
      </script>
      `,
      output: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      if (count.value) {}
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 16
        }
      ]
    },
    // Composable ref in unary expression
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      !count
      </script>
      `,
      output: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      !count.value
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 5,
          column: 8,
          endLine: 5,
          endColumn: 13
        }
      ]
    },
    // Composable ref in binary expression
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      const x = count + 1
      </script>
      `,
      output: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      const x = count.value + 1
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 22
        }
      ]
    },
    // Composable ref in conditional expression
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      const x = count ? 'yes' : 'no'
      </script>
      `,
      output: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      const x = count.value ? 'yes' : 'no'
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 22
        }
      ]
    },
    // Composable ref in template literal
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      const x = \`\${count}\`
      </script>
      `,
      output: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      const x = \`\${count.value}\`
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 5,
          column: 20,
          endLine: 5,
          endColumn: 25
        }
      ]
    },
    // Composable ref in member expression (not .value or .effect)
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      count.toString()
      </script>
      `,
      output: `
      <script setup lang="ts">
      import { useCount } from './ref-composables'
      const count = useCount()
      count.value.toString()
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 12
        }
      ]
    },
    // ComputedRef from composable
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useComputed } from './ref-composables'
      const comp = useComputed()
      if (comp) {}
      </script>
      `,
      output: `
      <script setup lang="ts">
      import { useComputed } from './ref-composables'
      const comp = useComputed()
      if (comp.value) {}
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `computed()`.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 15
        }
      ]
    },
    // ShallowRef from composable
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useShallow } from './ref-composables'
      const shallow = useShallow()
      shallow.name
      </script>
      `,
      output: `
      <script setup lang="ts">
      import { useShallow } from './ref-composables'
      const shallow = useShallow()
      shallow.value.name
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `shallowRef()`.',
          line: 5,
          column: 7,
          endLine: 5,
          endColumn: 14
        }
      ]
    },
    // Nullable ref (Ref<T> | undefined) — should still report
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useNullableRef } from './ref-composables'
      const val = useNullableRef()
      if (val) {}
      </script>
      `,
      output: `
      <script setup lang="ts">
      import { useNullableRef } from './ref-composables'
      const val = useNullableRef()
      if (val.value) {}
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 14
        }
      ]
    },
    // Destructured ref from object composable
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useObjectComposable } from './ref-composables'
      const { count, label } = useObjectComposable()
      if (count) {}
      if (label) {}
      </script>
      `,
      output: `
      <script setup lang="ts">
      import { useObjectComposable } from './ref-composables'
      const { count, label } = useObjectComposable()
      if (count.value) {}
      if (label.value) {}
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 16
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `computed()`.',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 16
        }
      ]
    },
    // Destructured ref from array composable
    {
      filename: tsOptions.filename,
      code: `
      <script setup lang="ts">
      import { useArrayComposable } from './ref-composables'
      const [count, label] = useArrayComposable()
      if (count) {}
      if (label) {}
      </script>
      `,
      output: `
      <script setup lang="ts">
      import { useArrayComposable } from './ref-composables'
      const [count, label] = useArrayComposable()
      if (count.value) {}
      if (label.value) {}
      </script>
      `,
      errors: [
        {
          message:
            'Must use `.value` to read or write the value wrapped by `ref()`.',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 16
        },
        {
          message:
            'Must use `.value` to read or write the value wrapped by `computed()`.',
          line: 6,
          column: 11,
          endLine: 6,
          endColumn: 16
        }
      ]
    }
  ]
})
