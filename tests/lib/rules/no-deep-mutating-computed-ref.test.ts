/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-deep-mutating-computed-ref'
import tsParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2022,
    sourceType: 'module'
  }
})

tester.run('no-deep-mutating-computed-ref', rule, {
  valid: [
    // the setter is called
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { ref, computed } from 'vue'
      const value = ref('French')
      const language = computed({
        get: () => ({ selected: value.value }),
        set: ({ selected }) => { value.value = selected }
      })
      language.value = { selected: 'English' }
      </script>
      `
    },
    // the getter returns an existing (possibly reactive) object
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { reactive, computed } from 'vue'
      const store = reactive({ user: { name: '' }, list: [] })
      const user = computed(() => store.user)
      const list = computed(() => store.list)
      const wrapped = computed(() => reactive({ name: '' }))
      user.value.name = 'x'
      list.value.push(1)
      wrapped.value.name = 'x'
      </script>
      `
    },
    // one of the returns is not a new object
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { computed } from 'vue'
      const props = defineProps(['user'])
      const user = computed(() => {
        if (props.user) {
          return props.user
        }
        return { name: '' }
      })
      user.value.name = 'x'
      </script>
      `
    },
    // the mutated nested object is not created by the getter
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { reactive, computed } from 'vue'
      const form = reactive({ name: '' })
      const state = computed(() => ({ form, items: form.items, ...form }))
      state.value.form.name = 'x'
      state.value.items.push(1)
      state.value.other.name = 'x'
      </script>
      `
    },
    // reading and non-mutating calls
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { computed } from 'vue'
      const options = computed(() => ({ a: 1, list: [] }))
      const list = computed(() => [1, 2, 3])
      console.log(options.value.a, list.value.map((x) => x * 2))
      const copy = { ...options.value }
      copy.a = 2
      </script>
      `
    },
    // `returns` in nested functions are not the getter's returns
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { computed } from 'vue'
      const props = defineProps(['items'])
      const items = computed(() => {
        const mapped = props.items.map((item) => { return { ...item } })
        return props.items
      })
      items.value.push(1)
      </script>
      `
    },
    // not `computed` from Vue
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { computed } from './my-computed'
      const options = computed(() => ({ a: 1 }))
      options.value.a = 2
      </script>
      `
    },
    // `let` may be reassigned
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { computed } from 'vue'
      let options = computed(() => ({ a: 1 }))
      options.value.a = 2
      </script>
      `
    },
    // template: the setter is called, and other variables with the same name
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { computed } from 'vue'
      const language = computed({
        get: () => ({ selected: 'French' }),
        set: () => {}
      })
      </script>
      <template>
        <input v-model="language">
        <button @click="language = { selected: 'English' }" />
        <div v-for="language in languages">
          <input v-model="language.selected">
        </div>
        <p>{{ language.selected }}</p>
      </template>
      `
    },
    // template: not a `<script setup>` binding
    {
      filename: 'test.vue',
      code: `
      <script>
      import { computed } from 'vue'
      export default {
        setup() {
          const options = computed(() => ({ a: 1 }))
          return { options }
        }
      }
      </script>
      <template>
        <input v-model="options.a">
      </template>
      `
    },
    // the returned object has accessors that forward writes to reactive state
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { ref, computed } from 'vue'
      const value = ref('French')
      const language = computed(() => ({
        get selected() {
          return value.value
        },
        set selected(selected) {
          value.value = selected
        }
      }))
      language.value.selected = 'German'
      </script>
      `
    },
    // a later computed key with an unknown name may override the property
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { reactive, computed } from 'vue'
      const props = defineProps(['key'])
      const state = reactive({ form: { name: '' }, list: [] })
      const a = computed(() => ({ form: {}, [props.key]: state.form }))
      const b = computed(() => ({ list: [], [\`\${props.key}\`]: state.list }))
      const c = computed(() => ({ outer: { form: {}, [props.key]: state.form } }))
      a.value.form.name = 'x'
      b.value.list.push(1)
      c.value.outer.form.name = 'x'
      </script>
      `
    },
    // a later spread may override the property
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { reactive, computed } from 'vue'
      const state = reactive({ form: { name: '' } })
      const options = computed(() => ({ form: {}, ...state }))
      options.value.form.name = 'x'
      </script>
      `
    },
    // the last duplicate key wins
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { reactive, computed } from 'vue'
      const state = reactive({ form: { name: '' } })
      const options = computed(() => ({ form: {}, form: state.form }))
      const other = computed(() => ({ form: {}, ['form']: state.form }))
      options.value.form.name = 'x'
      other.value.form.name = 'x'
      </script>
      `
    },
    // elements of returned arrays are not followed
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { reactive, computed } from 'vue'
      const state = reactive({ list: [{ name: '' }] })
      const list = computed(() => [{ name: '' }, ...state.list])
      const holes = computed(() => [, { name: '' }])
      list.value[0].name = 'x'
      list.value[1].name = 'x'
      holes.value[1].name = 'x'
      </script>
      `
    },
    // the getter may reuse the previous value
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { reactive, computed } from 'vue'
      const state = reactive({ a: { n: 0 } })
      const a = computed((prev) => ({ ...prev, c: state.a.n }))
      const b = computed((prev) => ({ form: { ...prev?.form }, c: state.a.n }))
      const c = computed({
        get(prev) {
          return { ...prev, c: state.a.n }
        },
        set() {}
      })
      a.value.foo = 1
      b.value.form.name = 'x'
      c.value.foo = 1
      </script>
      `
    },
    // the prototype may have setters that forward writes to reactive state
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { reactive, computed } from 'vue'
      const state = reactive({ name: '' })
      const proto = {
        set name(value) {
          state.name = value
        }
      }
      const a = computed(() => ({ __proto__: proto }))
      const b = computed(() => ({ form: { '__proto__': proto } }))
      a.value.name = 'x'
      b.value.form.name = 'x'
      </script>
      `
    }
  ],
  invalid: [
    // the example from the issue
    {
      filename: 'test.vue',
      code: `
      <script>
      import { defineComponent, ref, computed } from 'vue'
      export default defineComponent({
        setup() {
          const value = ref('French')
          const language = computed({
            get() {
              return {
                selected: value.value
              }
            },
            set({ selected }) {
              value.value = selected
            }
          })
          language.value = { selected: 'English' }
          language.value.selected = 'German'
          return { language }
        }
      })
      </script>
      `,
      errors: [
        {
          message:
            'Unexpected mutation of a property of the computed ref "language". Its getter returns a new object, so the change is not reactive and is lost on the next evaluation.',
          line: 18,
          column: 11,
          endLine: 18,
          endColumn: 45
        }
      ]
    },
    // assignments, updates, `delete`, array methods, `Object.assign`
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { computed } from 'vue'
      const props = defineProps(['user', 'tags'])
      const user = computed(() => ({ ...props.user }))
      const tags = computed(() => [...props.tags])
      const counter = computed(function () {
        return { count: 0 }
      })
      user.value.name = 'x'
      user.value['age'] += 1
      delete user.value.name
      counter.value.count++
      tags.value.push('new')
      tags.value[0] = 'first'
      tags.value.sort()
      Object.assign(user.value, { name: 'x' })
      </script>
      `,
      errors: [
        {
          messageId: 'unexpected',
          data: { name: 'user' },
          line: 10,
          column: 7,
          endLine: 10,
          endColumn: 28
        },
        {
          messageId: 'unexpected',
          data: { name: 'user' },
          line: 11,
          column: 7,
          endLine: 11,
          endColumn: 29
        },
        {
          messageId: 'unexpected',
          data: { name: 'user' },
          line: 12,
          column: 7,
          endLine: 12,
          endColumn: 29
        },
        {
          messageId: 'unexpected',
          data: { name: 'counter' },
          line: 13,
          column: 7,
          endLine: 13,
          endColumn: 28
        },
        {
          messageId: 'unexpected',
          data: { name: 'tags' },
          line: 14,
          column: 7,
          endLine: 14,
          endColumn: 29
        },
        {
          messageId: 'unexpected',
          data: { name: 'tags' },
          line: 15,
          column: 7,
          endLine: 15,
          endColumn: 30
        },
        {
          messageId: 'unexpected',
          data: { name: 'tags' },
          line: 16,
          column: 7,
          endLine: 16,
          endColumn: 24
        },
        {
          messageId: 'unexpected',
          data: { name: 'user' },
          line: 17,
          column: 7,
          endLine: 17,
          endColumn: 47
        }
      ]
    },
    // nested literals and several returns
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { computed } from 'vue'
      const props = defineProps(['mode'])
      const state = computed(() => {
        if (props.mode === 'a') {
          return { form: { name: 'a' }, list: [] }
        }
        return { form: { name: 'b' }, list: [] }
      })
      state.value.form.name = 'x'
      state.value.list.push(1)
      </script>
      `,
      errors: [
        {
          messageId: 'unexpected',
          data: { name: 'state' },
          line: 11,
          column: 7,
          endLine: 11,
          endColumn: 34
        },
        {
          messageId: 'unexpected',
          data: { name: 'state' },
          line: 12,
          column: 7,
          endLine: 12,
          endColumn: 31
        }
      ]
    },
    // inside functions
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { computed } from 'vue'
      const filters = computed(() => ({ query: '' }))
      function onInput(event) {
        filters.value.query = event.target.value
      }
      </script>
      `,
      errors: [
        {
          messageId: 'unexpected',
          data: { name: 'filters' },
          line: 6,
          column: 9,
          endLine: 6,
          endColumn: 49
        }
      ]
    },
    // template
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { computed } from 'vue'
      const props = defineProps(['filters'])
      const filters = computed(() => ({ ...props.filters }))
      </script>
      <template>
        <input v-model="filters.query">
        <input v-model.trim="filters['name']">
        <button @click="filters.page++" />
        <button @click="filters.query = ''" />
      </template>
      `,
      errors: [
        {
          messageId: 'unexpected',
          data: { name: 'filters' },
          line: 8,
          column: 25,
          endLine: 8,
          endColumn: 38
        },
        {
          messageId: 'unexpected',
          data: { name: 'filters' },
          line: 9,
          column: 30,
          endLine: 9,
          endColumn: 45
        },
        {
          messageId: 'unexpected',
          data: { name: 'filters' },
          line: 10,
          column: 25,
          endLine: 10,
          endColumn: 39
        },
        {
          messageId: 'unexpected',
          data: { name: 'filters' },
          line: 11,
          column: 25,
          endLine: 11,
          endColumn: 43
        }
      ]
    },
    // TypeScript
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      import { computed } from 'vue'
      interface Filters { query: string }
      const filters = computed<Filters>(() => ({ query: '' }) as Filters)
      const other = computed(() => ({ query: '' }) satisfies Filters)
      filters.value.query = 'x'
      other.value.query = 'x'
      </script>
      `,
      languageOptions: {
        parserOptions: { parser: tsParser }
      },
      errors: [
        {
          messageId: 'unexpected',
          data: { name: 'filters' },
          line: 7,
          column: 7,
          endLine: 7,
          endColumn: 32
        },
        {
          messageId: 'unexpected',
          data: { name: 'other' },
          line: 8,
          column: 7,
          endLine: 8,
          endColumn: 30
        }
      ]
    },
    // overrides by earlier keys and spreads, statically known computed keys
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { reactive, computed } from 'vue'
      const props = defineProps(['key'])
      const state = reactive({ form: { name: '' } })
      const a = computed(() => ({ [props.key]: state.form, form: {} }))
      const b = computed(() => ({ ...state, form: {} }))
      const c = computed(() => ({ form: state.form, form: {} }))
      const d = computed(() => ({ ['form']: {}, [\`list\`]: [] }))
      const e = computed(() => ({ form: { name: '', [props.key]: state.form } }))
      a.value.form.name = 'x'
      b.value.form.name = 'x'
      c.value.form.name = 'x'
      d.value.form.name = 'x'
      d.value.list.push(1)
      e.value.form.name = 'x'
      </script>
      `,
      errors: [
        {
          messageId: 'unexpected',
          data: { name: 'a' },
          line: 11,
          column: 7,
          endLine: 11,
          endColumn: 30
        },
        {
          messageId: 'unexpected',
          data: { name: 'b' },
          line: 12,
          column: 7,
          endLine: 12,
          endColumn: 30
        },
        {
          messageId: 'unexpected',
          data: { name: 'c' },
          line: 13,
          column: 7,
          endLine: 13,
          endColumn: 30
        },
        {
          messageId: 'unexpected',
          data: { name: 'd' },
          line: 14,
          column: 7,
          endLine: 14,
          endColumn: 30
        },
        {
          messageId: 'unexpected',
          data: { name: 'd' },
          line: 15,
          column: 7,
          endLine: 15,
          endColumn: 27
        },
        {
          messageId: 'unexpected',
          data: { name: 'e' },
          line: 16,
          column: 7,
          endLine: 16,
          endColumn: 30
        }
      ]
    },
    // computed and shorthand `__proto__` keys define own properties
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { computed } from 'vue'
      const __proto__ = { name: '' }
      const a = computed(() => ({ ['__proto__']: __proto__ }))
      const b = computed(() => ({ __proto__ }))
      a.value.name = 'x'
      b.value.name = 'x'
      </script>
      `,
      errors: [
        {
          messageId: 'unexpected',
          data: { name: 'a' },
          line: 7,
          column: 7,
          endLine: 7,
          endColumn: 25
        },
        {
          messageId: 'unexpected',
          data: { name: 'b' },
          line: 8,
          column: 7,
          endLine: 8,
          endColumn: 25
        }
      ]
    }
  ]
})
