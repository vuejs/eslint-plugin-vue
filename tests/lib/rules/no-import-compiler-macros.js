/**
 * @author Wayne Zhang
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/no-import-compiler-macros')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-import-compiler-macros', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { ref, computed } from 'vue'
      import { someFunction } from '@vue/runtime-core'
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { defineProps } from 'some-other-package'
      </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { defineProps } from 'vue'
      </script>
      `,
      output: `
      <script setup>
      
      </script>
      `,
      errors: [
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'defineProps'
          },
          line: 3,
          column: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import {
        ref,
        defineProps
      } from 'vue'
      </script>
      `,
      output: `
      <script setup>
      import {
        ref
      } from 'vue'
      </script>
      `,
      errors: [
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'defineProps'
          },
          line: 5,
          column: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { ref, defineProps } from 'vue'
      import { defineEmits, computed } from '@vue/runtime-core'
      import { defineExpose, watch, withDefaults } from '@vue/runtime-dom'
      </script>
      `,
      output: `
      <script setup>
      import { ref } from 'vue'
      import {  computed } from '@vue/runtime-core'
      import {  watch } from '@vue/runtime-dom'
      </script>
      `,
      errors: [
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'defineProps'
          },
          line: 3,
          column: 21
        },
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'defineEmits'
          },
          line: 4,
          column: 16
        },
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'defineExpose'
          },
          line: 5,
          column: 16
        },
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'withDefaults'
          },
          line: 5,
          column: 37
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { defineModel, defineOptions } from 'vue'
      </script>
      `,
      output: `
      <script setup>
      import {  defineOptions } from 'vue'
      </script>
      `,
      errors: [
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'defineModel'
          },
          line: 3,
          column: 16
        },
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'defineOptions'
          },
          line: 3,
          column: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      import { ref as refFoo, defineSlots as defineSlotsFoo, type computed } from '@vue/runtime-core'
      </script>
      `,
      output: `
      <script setup lang="ts">
      import { ref as refFoo,  type computed } from '@vue/runtime-core'
      </script>
      `,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'defineSlots'
          },
          line: 3,
          column: 31
        }
      ]
    }
  ]
})
