/**
 * @author Mussin Benarbia
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/require-explicit-slots')
const {
  getTypeScriptFixtureTestOptions
} = require('../../test-utils/typescript')

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
          <slot />
        </div>
      </template>
      <script setup lang="ts">
      interface Slots {
        default(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
      <script setup lang="ts">
      type Slots = {
        default(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
          <slot></slot>
        </div>
      </template>
      <script setup lang="ts">
      interface Slots {
        default(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
      type Slots = {
        default(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
      interface Slots {
        foo(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
      type Slots = {
        foo(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
          <slot name="foo"></slot>
        </div>
      </template>
      <script setup lang="ts">
      interface Slots {
        foo: (props: { msg: string }) => any
      }
      defineSlots<Slots>()
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
      type Slots = {
        foo: (props: { msg: string }) => any
      }
      defineSlots<Slots>()
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
          <slot name="foo-bar"></slot>
        </div>
      </template>
      <script setup lang="ts">
      interface Slots {
        'foo-bar'(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
      type Slots = {
        'foo-bar'(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
          <slot></slot>
          <slot name="foo"></slot>
        </div>
      </template>
      <script setup lang="ts">
      import type {Slots1 as Slots} from './test01'
      defineSlots<Slots>()
      </script>`,
      ...getTypeScriptFixtureTestOptions()
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
    },
    // attribute binding
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot :name="'foo'"></slot>
          <slot :name="\`bar\`"></slot>
        </div>
      </template>
      <script setup lang="ts">
      defineSlots<{
        foo(props: { msg: string }): any
        bar(props: { msg: string }): any
      }>()
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot :name="'foo'"></slot>
          <slot :name="\`bar\`"></slot>
        </div>
      </template>
      <script setup lang="ts">
      interface Slots {
        foo(props: { msg: string }): any
        bar(props: { msg: string }): any
      }
      defineSlots<Slots>()
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot :name="'foo'"></slot>
          <slot :name="\`bar\`"></slot>
        </div>
      </template>
      <script setup lang="ts">
      type Slots = {
        foo(props: { msg: string }): any
        bar(props: { msg: string }): any
      }
      defineSlots<Slots>()
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot :name="bar"></slot>
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
          <slot :name="bar"></slot>
        </div>
      </template>
      <script setup lang="ts">
      interface Slots {
        default(props: { msg: string }): any
      }
      defineSlots<Slots>()
      </script>`
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot :name="bar"></slot>
        </div>
      </template>
      <script setup lang="ts">
      type Slots = {
        default(props: { msg: string }): any
      }
      defineSlots<Slots>()
      </script>`
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
      interface Slots {
        default(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
      type Slots = {
        default(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
          <slot name="foo" />
        </div>
      </template>
      <script setup lang="ts">
      interface Slots {
        default: (props: { msg: string }) => any
      }
      defineSlots<Slots>()
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
      type Slots = {
        default: (props: { msg: string }) => any
      }
      defineSlots<Slots>()
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
          <slot name />
        </div>
      </template>
      <script setup lang="ts">
      interface Slots {
        'foo-bar'(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
      type Slots = {
        'foo-bar'(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
          <slot name="foo"></slot>
          <slot name="bar"></slot>
        </div>
      </template>
      <script setup lang="ts">
      import type {Slots1 as Slots} from './test01'
      defineSlots<Slots>()
      </script>`,
      errors: [
        {
          message: 'Slots must be explicitly defined.',
          line: 5,
          column: 11
        }
      ],
      ...getTypeScriptFixtureTestOptions()
    },
    {
      // ignore attribute binding except string literal
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot :name="'foo'"></slot>
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
      // ignore attribute binding except string literal
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot :name="'foo'"></slot>
        </div>
      </template>
      <script setup lang="ts">
      interface Slots {
        default(props: { msg: string }): any
      }
      defineSlots<Slots>()
      </script>`,
      errors: [
        {
          message: 'Slots must be explicitly defined.'
        }
      ]
    },
    {
      // ignore attribute binding except string literal
      filename: 'test.vue',
      code: `
      <template>
        <div>
          <slot :name="'foo'"></slot>
        </div>
      </template>
      <script setup lang="ts">
      type Slots = {
        default(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
      interface Slots {
        foo(props: { msg: string }): any
        foo(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
      type Slots = {
        foo(props: { msg: string }): any
        foo(props: { msg: string }): any
      }
      defineSlots<Slots>()
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
      interface SlotsA {
        foo(props: { msg: string }): any
      }
      defineSlots<SlotsA>()
      interface SlotsB {
        default(props: { msg: string }): any,
        foo(props: { msg: string }): any
      }
      defineSlots<SlotsB>()
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
      type SlotsA = {
        foo(props: { msg: string }): any
      }
      defineSlots<SlotsA>()
      type SlotsB = {
        default(props: { msg: string }): any,
        foo(props: { msg: string }): any
      }
      defineSlots<SlotsB>()
      </script>`,
      errors: [
        {
          message: 'Slot foo is already defined.'
        }
      ]
    }
  ]
})
