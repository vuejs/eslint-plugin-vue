/**
 * @fileoverview Prevent `<script setup>` variables used in `<template>` to be marked as unused
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const eslint = require('eslint')
const rule = require('../../../lib/rules/script-setup-uses-vars')
const ruleNoUnusedVars = require('eslint/lib/rules/no-unused-vars')

const RuleTester = eslint.RuleTester
const ruleTester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  }
})

const linter = ruleTester.linter || eslint.linter
linter.defineRule('script-setup-uses-vars', rule)

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

describe('script-setup-uses-vars', () => {
  ruleTester.run('no-unused-vars', ruleNoUnusedVars, {
    valid: [
      {
        filename: 'test.vue',
        code: `
        <script setup>
          /* eslint script-setup-uses-vars: 1 */
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
          /* eslint script-setup-uses-vars: 1 */
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
          /* eslint script-setup-uses-vars: 1 */
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
          /* eslint script-setup-uses-vars: 1 */
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
          /* eslint script-setup-uses-vars: 1 */
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
          /* eslint script-setup-uses-vars: 1 */
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
          /* eslint script-setup-uses-vars: 1 */
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
          /* eslint script-setup-uses-vars: 1 */
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
          /* eslint script-setup-uses-vars: 1 */
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
          /* eslint script-setup-uses-vars: 1 */
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
        /* eslint script-setup-uses-vars: 1 */
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
          /* eslint script-setup-uses-vars: 1 */
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
            line: 6
          },
          {
            message: "'baz' is assigned a value but never used.",
            line: 19
          }
        ]
      },

      // Resolve component name
      {
        filename: 'test.vue',
        code: `
        <script setup>
          /* eslint script-setup-uses-vars: 1 */
          import camelCase from './component.vue'
        </script>

        <template>
          <CamelCase />
        </template>
        `,
        errors: [
          {
            message: "'camelCase' is defined but never used.",
            line: 4
          }
        ]
      },

      // Scope tests
      {
        filename: 'test.vue',
        code: `
        <script setup>
          /* eslint script-setup-uses-vars: 1 */
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
            line: 5
          }
        ]
      },
      {
        filename: 'test.vue',
        code: `
        <script setup>
          /* eslint script-setup-uses-vars: 1 */
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
            line: 4
          }
        ]
      },

      // Not `<script setup>`
      {
        filename: 'test.vue',
        code: `
        <script>
          /* eslint script-setup-uses-vars: 1 */
          const msg = 'Hello!'
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

      //style vars
      {
        filename: 'test.vue',
        code: `
        <script setup>
          /* eslint script-setup-uses-vars: 1 */
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
})
