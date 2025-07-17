/**
 * @author 2nofa11
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/require-mayberef-unwrap')

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

tester.run('require-mayberef-unwrap', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, unref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        if (unref(maybeRef)) {
          console.log('good')
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, unref, type MaybeRefOrGetter } from 'vue'
        
        const maybeRefOrGetter: MaybeRefOrGetter<boolean> = ref(false)
        if (unref(maybeRefOrGetter)) {
          console.log('good')
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, unref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> | string = ref(false)
        if (unref(maybeRef)) {
          console.log('good')
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, unref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = unref(maybeRef) ? 'true' : 'false'
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, unref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<string> = ref('test')
        const result = 'other' ? maybeRef : 'alternate'
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
        import { ref } from 'vue'
        
        const maybeRef = ref(false)
        if (maybeRef.value) {
          console.log('no TypeScript annotation')
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref } from 'vue'
        
        const normalVar: boolean = false
        if (normalVar) {
          console.log('not MaybeRef')
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref } from 'vue'
        
        const maybeRef: Array<string> = []
        if (maybeRef.length) {
          console.log('not MaybeRef type')
        }
        </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        if (maybeRef) {
          console.log('bad')
        }
        </script>
      `,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 6,
          column: 13,
          suggestions: [
            {
              messageId: 'wrapWithUnref',
              output: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        if (unref(maybeRef)) {
          console.log('bad')
        }
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, type MaybeRefOrGetter } from 'vue'
        
        const maybeRefOrGetter: MaybeRefOrGetter<boolean> = ref(false)
        if (maybeRefOrGetter) {
          console.log('bad')
        }
        </script>
      `,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRefOrGetter)` instead.',
          line: 6,
          column: 13,
          suggestions: [
            {
              messageId: 'wrapWithUnref',
              output: `
        <script setup lang="ts">
        import { ref, type MaybeRefOrGetter } from 'vue'
        
        const maybeRefOrGetter: MaybeRefOrGetter<boolean> = ref(false)
        if (unref(maybeRefOrGetter)) {
          console.log('bad')
        }
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> | string = ref(false)
        if (maybeRef) {
          console.log('bad')
        }
        </script>
      `,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 6,
          column: 13,
          suggestions: [
            {
              messageId: 'wrapWithUnref',
              output: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> | string = ref(false)
        if (unref(maybeRef)) {
          console.log('bad')
        }
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = maybeRef ? 'true' : 'false'
        </script>
      `,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 6,
          column: 24,
          suggestions: [
            {
              messageId: 'wrapWithUnref',
              output: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = unref(maybeRef) ? 'true' : 'false'
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = !maybeRef
        </script>
      `,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 6,
          column: 25,
          suggestions: [
            {
              messageId: 'wrapWithUnref',
              output: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = !unref(maybeRef)
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<number> = ref(0)
        const result = typeof maybeRef
        </script>
      `,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 6,
          column: 31,
          suggestions: [
            {
              messageId: 'wrapWithUnref',
              output: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<number> = ref(0)
        const result = typeof unref(maybeRef)
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = maybeRef || 'default'
        </script>
      `,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 6,
          column: 24,
          suggestions: [
            {
              messageId: 'wrapWithUnref',
              output: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = unref(maybeRef) || 'default'
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = maybeRef == true
        </script>
      `,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 6,
          column: 24,
          suggestions: [
            {
              messageId: 'wrapWithUnref',
              output: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = unref(maybeRef) == true
        </script>
      `
            }
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = Boolean(maybeRef)
        </script>
      `,
      errors: [
        {
          message:
            'MaybeRef should be unwrapped with `unref()` before using in conditions. Use `unref(maybeRef)` instead.',
          line: 6,
          column: 32,
          suggestions: [
            {
              messageId: 'wrapWithUnref',
              output: `
        <script setup lang="ts">
        import { ref, type MaybeRef } from 'vue'
        
        const maybeRef: MaybeRef<boolean> = ref(false)
        const result = Boolean(unref(maybeRef))
        </script>
      `
            }
          ]
        }
      ]
    }
  ]
})
