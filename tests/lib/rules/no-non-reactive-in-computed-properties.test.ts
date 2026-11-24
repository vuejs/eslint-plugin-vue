/**
 * @author clean99
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-non-reactive-in-computed-properties'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-non-reactive-in-computed-properties', rule, {
  valid: [
    // Reactive instance properties.
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          hasClass() {
            return 'class' in this.$attrs
          },
          label() {
            return this.$props.label || this.name
          }
        }
      }
      </script>
      `
    },
    // Methods, watchers and lifecycle hooks are not cached.
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        methods: {
          hasFooter() {
            return !!this.$slots.footer
          }
        },
        watch: {
          value() {
            this.$refs.input.focus()
          }
        },
        mounted() {
          this.width = this.$refs.input.offsetWidth
        }
      }
      </script>
      `
    },
    // Nested functions inside a getter.
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          focus() {
            return () => this.$refs.input.focus()
          }
        }
      }
      </script>
      `
    },
    // The setter of a computed property.
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          value: {
            get() {
              return this.internalValue
            },
            set(value) {
              this.internalValue = value
              this.$refs.input.select()
            }
          }
        }
      }
      </script>
      `
    },
    // Not the component instance.
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          hasContentSlot() {
            return !!this.slots.content || !!other.$slots.content
          }
        }
      }
      </script>
      `
    },
    // Template usage.
    {
      filename: 'test.vue',
      code: `
      <template>
        <div v-if="$slots.content"><slot name="content" /></div>
      </template>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        computed: {
          hasContentSlot() {
            return !!this.$slots.content
          },
          inputWidth: {
            get() {
              return this.$refs.input.offsetWidth
            }
          }
        }
      }
      </script>
      `,
      errors: [
        {
          message:
            'Unexpected `$slots` in "hasContentSlot" computed property. `$slots` is not reactive, so the computed value will not update when it changes.',
          line: 6,
          column: 22,
          endLine: 6,
          endColumn: 33
        },
        {
          message:
            'Unexpected `$refs` in "inputWidth" computed property. `$refs` is not reactive, so the computed value will not update when it changes.',
          line: 10,
          column: 22,
          endLine: 10,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { defineComponent } from 'vue'
      export default defineComponent({
        computed: {
          hasContentSlot() {
            const vm = this
            return !!vm.$slots.content
          },
          hasHeader() {
            const { $slots } = this
            return !!$slots.header
          },
          hasFooter() {
            return !!this['$slots'].footer
          }
        }
      })
      </script>
      `,
      errors: [
        {
          message:
            'Unexpected `$slots` in "hasContentSlot" computed property. `$slots` is not reactive, so the computed value will not update when it changes.',
          line: 8,
          column: 22,
          endLine: 8,
          endColumn: 31
        },
        {
          message:
            'Unexpected `$slots` in "hasHeader" computed property. `$slots` is not reactive, so the computed value will not update when it changes.',
          line: 11,
          column: 21,
          endLine: 11,
          endColumn: 27
        },
        {
          message:
            'Unexpected `$slots` in "hasFooter" computed property. `$slots` is not reactive, so the computed value will not update when it changes.',
          line: 15,
          column: 22,
          endLine: 15,
          endColumn: 36
        }
      ]
    }
  ]
})
