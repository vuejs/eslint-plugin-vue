/**
 * @author Yosuke Ota <https://github.com/ota-meshi>
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-ref-object-reactivity-loss')

const tester = new RuleTester({
  parserOptions: {
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
          line: 4
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 5
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 6
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 7
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 9
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
          line: 4
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 5
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 6
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
          line: 4
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 5
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 6
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
          line: 3
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
          line: 5
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
          line: 15
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 16
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 17
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 18
        },
        {
          message:
            'Getting a value from the ref object in the same scope will cause the value to lose reactivity.',
          line: 19
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
          line: 3
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 4
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
          line: 3
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 4
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
          line: 3
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 4
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
          line: 3
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 4
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 5
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 6
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
          line: 13
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 14
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 15
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 16
        },
        {
          message:
            'Getting a reactive variable in the same scope will cause the value to lose reactivity.',
          line: 17
        }
      ]
    }
  ]
})
