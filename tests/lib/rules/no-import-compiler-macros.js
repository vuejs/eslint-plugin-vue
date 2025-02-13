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
      import { ref } from 'vue'
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
      import { computed, defineProps } from 'vue'
      import { defineEmits, ref, withDefaults } from '@vue/runtime-core'
      import { defineExpose, watch } from '@vue/runtime-dom'
      </script>
      `,
      output: `
      <script setup>
      import { computed } from 'vue'
      import { ref } from '@vue/runtime-core'
      import { watch } from '@vue/runtime-dom'
      </script>
      `,
      errors: [
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'defineProps',
            source: 'vue'
          },
          line: 3,
          column: 26
        },
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'defineEmits',
            source: '@vue/runtime-core'
          },
          line: 4,
          column: 16
        },
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'withDefaults',
            source: '@vue/runtime-core'
          },
          line: 4,
          column: 34
        },
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'defineExpose',
            source: '@vue/runtime-dom'
          },
          line: 5,
          column: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { defineProps, withDefaults, ref } from 'vue'
      </script>
      `,
      output: `
      <script setup>
      import { withDefaults, ref } from 'vue'
      </script>
      `,
      errors: [
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'defineProps',
            source: 'vue'
          },
          line: 3,
          column: 16
        },
        {
          messageId: 'noImportCompilerMacros',
          data: {
            name: 'withDefaults',
            source: 'vue'
          },
          line: 3,
          column: 29
        }
      ]
    }
  ]
})
