/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-ref-object-reactivity-loss'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-ref-object-reactivity-loss', rule, {
  valid: [
    `
    import { ref } from 'vue'
    const count = ref(0)
    const value1 = computed(() => count.value)
    const value2 = fn(count)
    const value3 = computed(() => fn(count.value))
    `,
    `
    import { toRefs } from 'vue'
    const { count } = toRefs(foo)
    const value1 = computed(() => count.value)
    const value2 = fn(count)
    const value3 = computed(() => fn(count.value))
    `,
    `
    import { toRefs } from 'vue'
    const refs = toRefs(foo)
    const value1 = computed(() => refs.count.value)
    const value2 = fn(refs.count)
    const value3 = computed(() => fn(refs.count.value))
    `,
    `
    import { ref } from 'vue'
    const count = ref(0)
    count.value = 42
    `,
    `
    import { ref } from 'vue'
    const count = ref(0)
    count.value++
    `,
    `
    import { ref } from 'vue'
    const count = ref(0)
    ;( { foo: count.value } = bar )
    `,
    `
    import { ref, computed, shallowRef, customRef, toRef } from 'vue'
    const r = ref(0)
    const c = computed(() => r.value)
    const sr = shallowRef({ count: 1 })
    const cr = customRef((track, trigger) => {
      return {
        get() { return sr.value },
        set(newValue) { sr.value = newValue }
      }
    })
    const tr = toRef(sr, 'count')
    function fn() {
      console.log(c.value, cr.value, tr.value)
    }
    `,
    // unknown
    `
    import { ref } from 'vue'
    const [a] = ref(0)
    foo.bar = ref(0)
    unknown.value
    `,
    `
    import { ref } from 'vue'
    let foo = ref(0)
    foo = foo
    `,
    // Reactivity Transform
    `
    const count = $ref(0)
    const value1 = computed(() => count)
    const value2 = fn($$(count))
    const value3 = computed(() => fn(count))
    `,
    `
    const count = $(foo)
    const value1 = computed(() => count)
    const value2 = fn($$(count))
    const value3 = computed(() => fn(count))
    `,
    `
    const { count } = $(foo)
    const value1 = computed(() => count)
    const value2 = fn($$(count))
    const value3 = computed(() => fn(count))
    `,
    `
    let count = $ref(0)
    count = 42
    `,
    `
    let count = $ref(0)
    count++
    `,
    `
    let count = $ref(0)
    ;( { foo: count } = bar )
    `,
    `
    const { v1, v2, v3, v4 } = $(foo)
    fn($$({ v1, a: [v2], a: [...v3], ...v4}))
    `,
    `
    let r = $ref(0)
    let c = $computed(() => r)
    let sr = $shallowRef({ count: 1 })
    let cr = $customRef((track, trigger) => {
      return {
        get() { return sr },
        set(newValue) { sr = newValue }
      }
    })
    let tr = $toRef($$(sr), 'count')
    function fn() {
      console.log(
        r.value,
        c.value,
        sr.value,
        cr.value,
        tr.value
      )
    }
    `
  ],
  invalid: [
    {
      code: `
      import { ref } from 'vue'
      const count = ref(0)
      const value1 = count.value
      const { value: value2 } = count
      const value3 = fn(count.value)
      const { value: value4 = 42 } = count
      if (foo) {
        const value1 = count.value
      }
      `,
      errors: [
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 4,
          column: 22,
          endLine: 4,
          endColumn: 27
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 30
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 6,
          column: 25,
          endLine: 6,
          endColumn: 30
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 35
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 9,
          column: 24,
          endLine: 9,
          endColumn: 29
        }
      ]
    },
    {
      code: `
      import { toRefs } from 'vue'
      const { count } = toRefs(foo)
      const value1 = count.value
      const { value: value2 } = count
      const value3 = fn(count.value)
      `,
      errors: [
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 4,
          column: 22,
          endLine: 4,
          endColumn: 27
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 30
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 6,
          column: 25,
          endLine: 6,
          endColumn: 30
        }
      ]
    },
    {
      code: `
      import { toRefs } from 'vue'
      const refs = toRefs(foo)
      const value1 = refs.count.value
      const { value: value2 } = refs.count
      const value3 = fn(refs.count.value)
      `,
      errors: [
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 4,
          column: 22,
          endLine: 4,
          endColumn: 32
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 30
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 6,
          column: 25,
          endLine: 6,
          endColumn: 35
        }
      ]
    },
    {
      code: `
      import { ref } from 'vue'
      const count = ref(0).value
      `,
      errors: [
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 3,
          column: 21,
          endLine: 3,
          endColumn: 27
        }
      ]
    },
    {
      code: `
      import { toRefs } from 'vue'
      const refs = toRefs(foo)
      const { foo = 42 } = refs
      const v = foo.value
      `,
      errors: [
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 5,
          column: 17,
          endLine: 5,
          endColumn: 20
        }
      ]
    },
    {
      code: `
      import { ref, computed, shallowRef, customRef, toRef } from 'vue'
      const r = ref(0)
      const c = computed(() => r.value)
      const sr = shallowRef({ count: 1 })
      const cr = customRef((track, trigger) => {
        return {
          get() { return sr.value },
          set(newValue) { sr.value = newValue }
        }
      })
      const tr = toRef(sr, 'count')

      console.log(
        r.value,
        c.value,
        sr.value,
        cr.value,
        tr.value
      )
      `,
      errors: [
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 15,
          column: 9,
          endLine: 15,
          endColumn: 10
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 16,
          column: 9,
          endLine: 16,
          endColumn: 10
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 17,
          column: 9,
          endLine: 17,
          endColumn: 11
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 18,
          column: 9,
          endLine: 18,
          endColumn: 11
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 19,
          column: 9,
          endLine: 19,
          endColumn: 11
        }
      ]
    },
    {
      code: `
      <script setup>
      const model1 = defineModel();
      const [model2, mod] = defineModel();
      console.log(
        model1.value,
        model2.value,
        mod.value // OK
      )
      </script>`,
      languageOptions: { parser: vueEslintParser },
      errors: [
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 15
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 7,
          column: 9,
          endLine: 7,
          endColumn: 15
        }
      ]
    },
    // Reactivity Transform
    {
      code: `
      const count = $ref(0)
      const value1 = count
      const value2 = fn(count)
      `,
      errors: [
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 27
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 30
        }
      ]
    },
    {
      code: `
      const count = $(foo)
      const value1 = count
      const value2 = fn(count)
      `,
      errors: [
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 27
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 30
        }
      ]
    },
    {
      code: `
      const { count } = $(foo)
      const value1 = count
      const value2 = fn(count)
      `,
      errors: [
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 27
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 4,
          column: 25,
          endLine: 4,
          endColumn: 30
        }
      ]
    },
    {
      code: `
      const { v1, a: [v2 = 42], b: [...v3], ...v4 } = $(foo)
      const value1 = v1
      const value2 = v2
      const value3 = v3
      const value4 = v4
      `,
      errors: [
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 3,
          column: 22,
          endLine: 3,
          endColumn: 24
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 4,
          column: 22,
          endLine: 4,
          endColumn: 24
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 5,
          column: 22,
          endLine: 5,
          endColumn: 24
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 6,
          column: 22,
          endLine: 6,
          endColumn: 24
        }
      ]
    },
    {
      code: `
      let r = $ref(0)
      let c = $computed(() => r)
      let sr = $shallowRef({ count: 1 })
      let cr = $customRef((track, trigger) => {
        return {
          get() { return sr },
          set(newValue) { sr = newValue }
        }
      })
      let tr = $toRef($$(sr), 'count')
      console.log(
        r.value,
        c.value,
        sr.value,
        cr.value,
        tr.value
      )
      `,
      errors: [
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 13,
          column: 9,
          endLine: 13,
          endColumn: 10
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 14,
          column: 9,
          endLine: 14,
          endColumn: 10
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 15,
          column: 9,
          endLine: 15,
          endColumn: 11
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 16,
          column: 9,
          endLine: 16,
          endColumn: 11
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 17,
          column: 9,
          endLine: 17,
          endColumn: 11
        }
      ]
    }
  ]
})
