'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const eslint = require('eslint')
const rules = new eslint.Linter().getRules()
const ruleNoUnusedVars = rules.get('no-unused-vars')
const ruleNoUndef = rules.get('no-undef')

const RuleTester = eslint.RuleTester
const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
})

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

describe('vue-eslint-parser should properly mark the variables used in the template', () => {
  ruleTester.run('no-unused-vars', ruleNoUnusedVars, {
    valid: [
      {
        filename: 'test.vue',
        code: `
        <script setup>
          // imported components are also directly usable in template
          import Foo from './Foo.vue'
          import { ref } from 'vue'

          // write Composition API code just like in a normal setup()
          // but no need to manually return everything
          const count = ref(0)
          const inc = () => {
            count.value++
          }
        </script>

        <template>
          <Foo :count="count" @click="inc" />
        </template>
        `
      },
      {
        filename: 'test.vue',
        code: `
        <script setup>
          const msg = 'Hello!'
        </script>

        <template>
          <div>{{ msg }}</div>
        </template>
        `
      },
      {
        filename: 'test.vue',
        code: `
        <script setup>
          import Foo from './Foo.vue'
          import MyComponent from './MyComponent.vue'
        </script>

        <template>
          <Foo />
          <!-- kebab-case also works -->
          <my-component />
        </template>
        `
      },
      {
        filename: 'test.vue',
        code: `
        <script setup>
          import Foo from './Foo.vue'
          import Bar from './Bar.vue'
        </script>

        <template>
          <component :is="Foo" />
          <component :is="someCondition ? Foo : Bar" />
        </template>
        `
      },
      {
        filename: 'test.vue',
        code: `
        <script setup>
          import { directive as vClickOutside } from 'v-click-outside'
        </script>

        <template>
          <div v-click-outside />
        </template>
        `
      },

      // Resolve component name
      {
        filename: 'test.vue',
        code: `
        <script setup>
          import FooPascalCase from './component.vue'
          import BarPascalCase from './component.vue'
          import BazPascalCase from './component.vue'
        </script>

        <template>
          <FooPascalCase />
          <bar-pascal-case />
          <bazPascalCase />
        </template>
        `
      },
      {
        filename: 'test.vue',
        code: `
        <script setup>
          import fooCamelCase from './component.vue'
          import barCamelCase from './component.vue'
        </script>

        <template>
          <fooCamelCase />
          <bar-camel-case />
        </template>
        `
      },

      // TopLevel await
      {
        filename: 'test.vue',
        code: `
        <script setup>
          const post = await fetch(\`/api/post/1\`).then((r) => r.json())
        </script>

        <template>
          {{post}}
        </template>
        `,
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'module'
        }
      },

      // ref
      {
        filename: 'test.vue',
        code: `
        <script setup>
          import {ref} from 'vue'
          const v = ref(null)
        </script>

        <template>
          <div ref="v"/>
        </template>
        `
      },

      //style vars
      {
        filename: 'test.vue',
        code: `
        <script setup>
          const color = 'red'
          const font = { size: '2em' }
        </script>

        <style>
          * {
            color: v-bind(color);
            font-size: v-bind('font.size');
          }
        </style>
        `
      },
      // ns
      {
        filename: 'test.vue',
        code: `
        <script setup>
        import * as Form from './form-components'
        </script>

        <template>
          <Form.Input>
            <Form.Label>label</Form.Label>
          </Form.Input>
        </template>
        `
      }
    ],

    invalid: [
      {
        filename: 'test.vue',
        code: `
        <script setup>
          // imported components are also directly usable in template
          import Foo from './Foo.vue'
          import Bar from './Bar.vue'
          import { ref } from 'vue'

          // write Composition API code just like in a normal setup()
          // but no need to manually return everything
          const count = ref(0)
          const inc = () => {
            count.value++
          }
          const foo = ref(42)
          console.log(foo.value)
          const bar = ref(42)
          bar.value++
          const baz = ref(42)
        </script>

        <template>
          <Foo :count="count" @click="inc" />
        </template>
        `,
        errors: [
          {
            message: "'Bar' is defined but never used.",
            line: 5
          },
          {
            message: "'baz' is assigned a value but never used.",
            line: 18
          }
        ]
      },

      // Resolve component name
      {
        filename: 'test.vue',
        code: `
        <script setup>
          import camelCase from './component.vue'
        </script>

        <template>
          <CamelCase />
        </template>
        `,
        errors: [
          {
            message: "'camelCase' is defined but never used.",
            line: 3
          }
        ]
      },

      // Scope tests
      {
        filename: 'test.vue',
        code: `
        <script setup>
          if (a) {
            const msg = 'Hello!'
          }
        </script>

        <template>
          <div>{{ msg }}</div>
        </template>
        `,
        errors: [
          {
            message: "'msg' is assigned a value but never used.",
            line: 4
          }
        ]
      },
      {
        filename: 'test.vue',
        code: `
        <script setup>
          const i = 42
          const list = [1,2,3]
        </script>

        <template>
          <div v-for="i in list">{{ i }}</div>
        </template>
      `,
        errors: [
          {
            message: "'i' is assigned a value but never used.",
            line: 3
          }
        ]
      },

      // Not `<script setup>`
      {
        filename: 'test.vue',
        code: `
        <script>
          const msg = 'Hello!'
        </script>

        <template>
          <div>{{ msg }}</div>
        </template>
        `,
        errors: [
          {
            message: "'msg' is assigned a value but never used.",
            line: 3
          }
        ]
      },

      //style vars
      {
        filename: 'test.vue',
        code: `
        <script setup>
          const color = 'red'
        </script>

        <style lang="scss">
          .v-bind .color {
            color: 'v-bind(color)';
            background-color: 'v-bind(color)';
          }
          /* v-bind(color) */
          // v-bind(color)
        </style>
        `,
        errors: ["'color' is assigned a value but never used."]
      }
    ]
  })

  ruleTester.run('no-undef', ruleNoUndef, {
    valid: [
      {
        filename: 'test.vue',
        code: `
        <script setup>
        const props = defineProps({
          foo: String
        })

        const emit = defineEmits(['change', 'delete'])
        </script>
        `
      }
    ],
    invalid: [
      {
        filename: 'test.vue',
        code: `
        <script setup>
        const props = defineUnknown({
          foo: String
        })

        const emit = defineUnknown(['change', 'delete'])
        </script>
        `,
        errors: [
          {
            message: "'defineUnknown' is not defined.",
            line: 3
          },
          {
            message: "'defineUnknown' is not defined.",
            line: 7
          }
        ]
      }
    ]
  })
})
