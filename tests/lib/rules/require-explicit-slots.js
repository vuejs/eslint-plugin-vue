/**
 * @author Mussin Benarbia
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/require-explicit-slots')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      parser: require.resolve('@typescript-eslint/parser')
    }
  }
})

tester.run('require-explicit-slots', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot />
        </div>
      </template>
      <script setup lang="ts">
      defineSlots<{
        default(props: { msg: string }): any
      }>()
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot></slot>
        </div>
      </template>
      <script setup lang="ts">
      defineSlots<{
        default(props: { msg: string }): any
      }>()
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot name="foo"></slot>
        </div>
      </template>
      <script setup lang="ts">
      defineSlots<{
        foo(props: { msg: string }): any
      }>()
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot name="foo"></slot>
        </div>
      </template>
      <script setup lang="ts">
      defineSlots<{
        foo: (props: { msg: string }) => any
      }>()
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot name="foo-bar"></slot>
        </div>
      </template>
      <script setup lang="ts">
      defineSlots<{
        'foo-bar'(props: { msg: string }): any
      }>()
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot />
        </div>
      </template>
      <script lang="ts">
      import { SlotsType } from 'vue'

      defineComponent({
        slots: Object as SlotsType<{
          default: { msg: string }
        }>,
      })
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot></slot>
        </div>
      </template>
      <script lang="ts">
      import { SlotsType } from 'vue'

      defineComponent({
        slots: Object as SlotsType<{
          default: { msg: string }
        }>,
      })
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot name="foo"></slot>
        </div>
      </template>
      <script lang="ts">
      import { SlotsType } from 'vue'

      defineComponent({
        slots: Object as SlotsType<{
          foo(props: { msg: string }): any
        }>,
      })
      </script>`
    },
    // does not report any error if the script is not TS
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot name="foo"></slot>
        </div>
      </template>
      <script setup>
      </script>`,
      languageOptions: {
        parserOptions: {
          parser: null
        }
      }
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot />
        </div>
      </template>
      <script setup lang="ts">
      </script>`,
      errors: [
        {
          message: 'Slots must be explicitly defined.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot></slot>
        </div>
      </template>
      <script setup lang="ts">
      </script>`,
      errors: [
        {
          message: 'Slots must be explicitly defined.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot name="foo" />
        </div>
      </template>
      <script setup lang="ts">
      </script>`,
      errors: [
        {
          message: 'Slots must be explicitly defined.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot name="foo" />
        </div>
      </template>
      <script setup lang="ts">
      defineSlots<{
        default(props: { msg: string }): any
      }>()
      </script>`,
      errors: [
        {
          message: 'Slots must be explicitly defined.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot name="foo" />
        </div>
      </template>
      <script setup lang="ts">
      defineSlots<{
        default: (props: { msg: string }) => any
      }>()
      </script>`,
      errors: [
        {
          message: 'Slots must be explicitly defined.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot name />
        </div>
      </template>
      <script setup lang="ts">
      defineSlots<{
        'foo-bar'(props: { msg: string }): any
      }>()
      </script>`,
      errors: [
        {
          message: 'Slots must be explicitly defined.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot name="foo" />
        </div>
      </template>
      <script lang="ts">
      import { SlotsType } from 'vue'

      defineComponent({
        slots: Object as SlotsType<{
          default: { msg: string }
        }>,
      })
      </script>`,
      errors: [
        {
          message: 'Slots must be explicitly defined.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot name="foo" />
        </div>
      </template>
      <script setup lang="ts">
      defineSlots<{
        foo(props: { msg: string }): any
        foo(props: { msg: string }): any
      }>()
      </script>`,
      errors: [
        {
          message: 'Slot foo is already defined.'
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot name="foo" />
        </div>
      </template>
      <script setup lang="ts">
      defineSlots<{
        foo(props: { msg: string }): any
      }>()
      defineSlots<{
        default(props: { msg: string }): any,
        foo(props: { msg: string }): any
      }>()
      </script>`,
      errors: [
        {
          message: 'Slot foo is already defined.'
        }
      ]
    }
  ]
})
