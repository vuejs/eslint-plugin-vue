/**
 * @author Yang Bai
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-dollar-el'
import tsParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-dollar-el', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <input ref="input" v-bind="$attrs" @focus="$refs.input.select()">
        </template>
        <script>
        export default {
          mounted() {
            this.$refs.input.focus()
            this.$emit('ready', this.$elements, this.el)
          }
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <div v-for="$el in items" :key="$el.id">{{ $el.name }}</div>
        </template>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
        import { useTemplateRef, onMounted } from 'vue'
        const input = useTemplateRef('input')
        onMounted(() => input.value?.focus())
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          mounted() {
            const key = '$el'
            this[key]
          }
        }
        const view = function () {
          return this.$el
        }
        </script>
      `
    },
    {
      filename: 'test.js',
      code: `
        const view = new Backbone.View()
        view.$el.addClass('active')
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <template>
          <button @click="$el.querySelector('input').focus()">Focus</button>
        </template>
      `,
      errors: [
        {
          message: 'Unexpected use of `$el`.',
          line: 3,
          column: 27,
          endLine: 3,
          endColumn: 30
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <template>
          <MyModal ref="modal" />
          <button @click="$refs.modal.$el.focus()">Focus</button>
          <span>{{ $parent?.$el }}</span>
        </template>
      `,
      errors: [
        {
          message: 'Unexpected use of `$el`.',
          line: 4,
          column: 39,
          endLine: 4,
          endColumn: 42
        },
        {
          message: 'Unexpected use of `$el`.',
          line: 5,
          column: 29,
          endLine: 5,
          endColumn: 32
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          mounted() {
            this.$el.querySelector('input')
            this.$refs.modal.$el.focus()
            this['$el']
          }
        }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected use of `$el`.',
          line: 5,
          column: 18,
          endLine: 5,
          endColumn: 21
        },
        {
          message: 'Unexpected use of `$el`.',
          line: 6,
          column: 30,
          endLine: 6,
          endColumn: 33
        },
        {
          message: 'Unexpected use of `$el`.',
          line: 7,
          column: 18,
          endLine: 7,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        import { getCurrentInstance } from 'vue'
        export default {
          setup() {
            const instance = getCurrentInstance()
            return () => instance.proxy.$el
          }
        }
        </script>
      `,
      errors: [
        {
          message: 'Unexpected use of `$el`.',
          line: 7,
          column: 41,
          endLine: 7,
          endColumn: 44
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { useTemplateRef, onMounted } from 'vue'
        import MyModal from './MyModal.vue'
        const modal = useTemplateRef<InstanceType<typeof MyModal>>('modal')
        onMounted(() => modal.value?.$el.focus())
        </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          message: 'Unexpected use of `$el`.',
          line: 6,
          column: 38,
          endLine: 6,
          endColumn: 41
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          mounted() {
            this.$el.focus()
          }
        }
        </script>
        <script setup>
        const getEl = (component) => component.$el
        </script>
      `,
      errors: [
        {
          message: 'Unexpected use of `$el`.',
          line: 5,
          column: 18,
          endLine: 5,
          endColumn: 21
        },
        {
          message: 'Unexpected use of `$el`.',
          line: 10,
          column: 48,
          endLine: 10,
          endColumn: 51
        }
      ]
    },
    {
      filename: 'test.js',
      code: `
        import { defineComponent } from 'vue'
        export default defineComponent({
          mounted() {
            this.$el.focus()
          }
        })
      `,
      errors: [
        {
          message: 'Unexpected use of `$el`.',
          line: 5,
          column: 18,
          endLine: 5,
          endColumn: 21
        }
      ]
    }
  ]
})
