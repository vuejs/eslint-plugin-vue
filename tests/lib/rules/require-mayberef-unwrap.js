/**
 * @author 2nofa11
 * See LICENSE file in root directory for full license.
 */
'use strict'

// Import required modules for testing
const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/require-mayberef-unwrap')

// Configure RuleTester with TypeScript and Vue parser settings
const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: { parser: require.resolve('@typescript-eslint/parser') }
  }
})

// Execute test suite for require-mayberef-unwrap rule
tester.run('require-mayberef-unwrap', rule, {
  // Valid test cases - these should not trigger the rule
  valid: [
    {
      // Test case: Basic MaybeRef with proper unref usage
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, unref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        if (unref(maybeRef)) { console.log('good') }
        </script>`
    },

    {
      // Test case: MaybeRefOrGetter type with proper unref usage
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, unref, type MaybeRefOrGetter } from 'vue'
        const maybeRefOrGetter: MaybeRefOrGetter<boolean> = ref(false)
        if (unref(maybeRefOrGetter)) { console.log('good') }
        </script>`
    },

    {
      // Test case: Union type including MaybeRef with proper unref usage
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, unref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> | string = ref(false)
        if (unref(maybeRef)) { console.log('good') }
        </script>`
    },

    {
      // Test case: Conditional expression with proper unref usage
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, unref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = unref(maybeRef) ? 'true' : 'false'
        </script>`
    },

    {
      // Test case: Variable used in non-conditional context
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, unref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<string> = ref('test')
        const result = 'other' ? maybeRef : 'alternate'
        </script>`
    },

    {
      // Test case: No TypeScript, so no type checking
      filename: 'test.vue',
      code: `<script setup>
        import { ref } from 'vue'
        const maybeRef = ref(false)
        if (maybeRef.value) { console.log('no TypeScript annotation') }
        </script>`
    },

    {
      // Test case: Non-MaybeRef type variable
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref } from 'vue'
        const normalVar: boolean = false
        if (normalVar) { console.log('not MaybeRef') }
        </script>`
    },

    {
      // Test case: Array type, not MaybeRef
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref } from 'vue'
        const maybeRef: Array<string> = []
        if (maybeRef.length) { console.log('not MaybeRef type') }
        </script>`
    },

    {
      // Test case: Props without MaybeRef type
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { type MaybeRef } from 'vue'
        const props = defineProps<{ normalProp: string, anotherProp: number }>()
        if (props.normalProp) { console.log('normal prop') }
        </script>`
    },

    {
      // Test case: Options API without type annotations
      filename: 'test.vue',
      code: `<template></template>
        <script lang="ts">
        export default {
          setup() { const value = 'test'; return { value } }
        }
        </script>`
    },

    {
      // Test case: Options API with untyped props
      filename: 'test.vue',
      code: `<template></template>
        <script lang="ts">
        export default {
          setup(props) { if (props) { console.log('untyped props') } }
        }
        </script>`
    },

    {
      // Test case: Props definition without usage
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { type MaybeRef } from 'vue'
        defineProps<{ count: MaybeRef<number> }>()
        </script>`
    },

    {
      // Test case: Destructured props with MaybeRef type
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { type MaybeRef } from 'vue'
        const { count } = defineProps<{ count: MaybeRef<number> }>()
        if (count) { console.log('destructured') }
        </script>`
    }
  ],

  // Invalid test cases - these should trigger the rule and be auto-fixed
  invalid: [
    {
      // Test case: Basic MaybeRef without unref
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        if (maybeRef) { console.log('bad') }
        </script>`,
      output: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        if (unref(maybeRef)) { console.log('bad') }
        </script>`,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 4,
          column: 13
        }
      ]
    },

    {
      // Test case: MaybeRefOrGetter without unref
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, type MaybeRefOrGetter } from 'vue'
        const maybeRefOrGetter: MaybeRefOrGetter<boolean> = ref(false)
        if (maybeRefOrGetter) { console.log('bad') }
        </script>`,
      output: `<script setup lang="ts">
        import { ref, type MaybeRefOrGetter } from 'vue'
        const maybeRefOrGetter: MaybeRefOrGetter<boolean> = ref(false)
        if (unref(maybeRefOrGetter)) { console.log('bad') }
        </script>`,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRefOrGetter)` instead.',
          line: 4,
          column: 13
        }
      ]
    },

    {
      // Test case: Union type including MaybeRef without unref
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> | string = ref(false)
        if (maybeRef) { console.log('bad') }
        </script>`,
      output: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> | string = ref(false)
        if (unref(maybeRef)) { console.log('bad') }
        </script>`,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 4,
          column: 13
        }
      ]
    },

    {
      // Test case: Conditional expression without unref
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = maybeRef ? 'true' : 'false'
        </script>`,
      output: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = unref(maybeRef) ? 'true' : 'false'
        </script>`,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 4,
          column: 24
        }
      ]
    },

    {
      // Test case: Unary expression without unref
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = !maybeRef
        </script>`,
      output: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = !unref(maybeRef)
        </script>`,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 4,
          column: 25
        }
      ]
    },

    {
      // Test case: Typeof expression without unref
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<number> = ref(0)
        const result = typeof maybeRef
        </script>`,
      output: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<number> = ref(0)
        const result = typeof unref(maybeRef)
        </script>`,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 4,
          column: 31
        }
      ]
    },

    {
      // Test case: Logical OR expression without unref
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = maybeRef || 'default'
        </script>`,
      output: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = unref(maybeRef) || 'default'
        </script>`,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 4,
          column: 24
        }
      ]
    },

    {
      // Test case: Equality comparison without unref
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = maybeRef == true
        </script>`,
      output: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = unref(maybeRef) == true
        </script>`,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 4,
          column: 24
        }
      ]
    },

    {
      // Test case: Boolean constructor without unref
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = Boolean(maybeRef)
        </script>`,
      output: `<script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = Boolean(unref(maybeRef))
        </script>`,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 4,
          column: 32
        }
      ]
    },

    {
      // Test case: Props with MaybeRef type without unref
      filename: 'test.vue',
      code: `<script setup lang="ts">
        import { type MaybeRef } from 'vue'
        const props = defineProps<{ count: MaybeRef<number> }>()
        if (props.count) { console.log('bad') }
        </script>`,
      output: `<script setup lang="ts">
        import { type MaybeRef } from 'vue'
        const props = defineProps<{ count: MaybeRef<number> }>()
        if (unref(props.count)) { console.log('bad') }
        </script>`,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(props.count)` instead.',
          line: 4,
          column: 19
        }
      ]
    },

    {
      // Test case: Options API with typed props without unref
      filename: 'test.vue',
      code: `<template></template>
        <script lang="ts">
        import { type MaybeRef } from 'vue'
        export default {
          setup(props: { count: MaybeRef<number> }) {
            if (props.count) { console.log('bad') }
          }
        }
        </script>`,
      output: `<template></template>
        <script lang="ts">
        import { type MaybeRef } from 'vue'
        export default {
          setup(props: { count: MaybeRef<number> }) {
            if (unref(props.count)) { console.log('bad') }
          }
        }
        </script>`,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(props.count)` instead.',
          line: 6,
          column: 23
        }
      ]
    }
  ]
})
