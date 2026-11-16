/**
 * @author Kamogelo Moalusi
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/prefer-define-component'
import tsParser from '@typescript-eslint/parser'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('prefer-define-component', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      import { defineComponent } from 'vue'
      export default defineComponent({
        name: 'Test'
      })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import { defineComponent } from 'vue'
      export default defineComponent({
        props: {
          message: { type: String, required: true }
        }
      })
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } }
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import { defineComponent as createComponent } from 'vue'
      export default createComponent({
        name: 'Test'
      })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import { defineComponent, type Component } from 'vue'
      export default defineComponent({
        name: 'Test'
      }) satisfies Component
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } }
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import type { Component } from 'vue'
      import Base from './Base.vue'
      export default Base satisfies Component
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { ref } from 'vue'
      const count = ref(0)
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = defineProps<{ message: string }>()
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } }
    },
    // A normal `<script>` next to `<script setup>` only adds options (see `vue/prefer-define-options`).
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        inheritAttrs: false
      }
      </script>
      <script setup>
      import { ref } from 'vue'
      const count = ref(0)
      </script>
      `
    },
    // Not a component object.
    {
      filename: 'test.vue',
      code: `
      <script>
      import Base from './Base.vue'
      export default Base
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import Vue from 'vue'
      import Base from './Base.vue'
      export default Vue.extend(Base)
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default function render() {}
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default class Foo {}
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export default defineNuxtComponent({
        name: 'Test'
      })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      export const helpers = {
        foo: 'bar'
      }
      </script>
      `
    },
    {
      filename: 'test.js',
      code: `
      export default {
        name: 'Test'
      }
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script>
      export default {
        name: 'Test'
      }
      </script>
      `,
      errors: [
        {
          message: 'Use `defineComponent` to define the component.',
          line: 3,
          column: 7,
          endLine: 5,
          endColumn: 8
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      export default {
        name: 'Test'
      }
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          message: 'Use `defineComponent` to define the component.',
          line: 3,
          column: 7,
          endLine: 5,
          endColumn: 8
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import type { ComponentOptions } from 'vue'
      export default {
        name: 'Test'
      } as ComponentOptions
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          message: 'Use `defineComponent` to define the component.',
          line: 4,
          column: 7,
          endLine: 6,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import type { Component } from 'vue'
      export default {
        name: 'Test'
      } satisfies Component
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          message: 'Use `defineComponent` to define the component.',
          line: 4,
          column: 7,
          endLine: 6,
          endColumn: 28
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import type { Component } from 'vue'
      export default ({
        name: 'Test'
      }) satisfies Component
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          message: 'Use `defineComponent` to define the component.',
          line: 4,
          column: 7,
          endLine: 6,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import type { Component, ComponentOptions } from 'vue'
      export default ({
        name: 'Test'
      } as ComponentOptions) satisfies Component
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          message: 'Use `defineComponent` to define the component.',
          line: 4,
          column: 7,
          endLine: 6,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import type { Component, ComponentOptions } from 'vue'
      export default ({
        name: 'Test'
      } satisfies Component) as ComponentOptions
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          message: 'Use `defineComponent` to define the component.',
          line: 4,
          column: 7,
          endLine: 6,
          endColumn: 49
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import Vue from 'vue'
      import type { Component } from 'vue'
      export default Vue.extend({
        name: 'Test'
      }) satisfies Component
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          message: 'Use `defineComponent` to define the component.',
          line: 5,
          column: 7,
          endLine: 7,
          endColumn: 29
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script lang="ts">
      import Vue from 'vue'
      import type { ComponentOptions } from 'vue'
      export default Vue.extend({
        name: 'Test'
      } satisfies ComponentOptions)
      </script>
      `,
      languageOptions: { parserOptions: { parser: tsParser } },
      errors: [
        {
          message: 'Use `defineComponent` to define the component.',
          line: 5,
          column: 7,
          endLine: 7,
          endColumn: 36
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <template>
        <div />
      </template>
      <script>
      export default {}
      </script>
      `,
      errors: [
        {
          message: 'Use `defineComponent` to define the component.',
          line: 6,
          column: 7,
          endLine: 6,
          endColumn: 24
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      import Vue from 'vue'
      export default Vue.extend({
        name: 'Test'
      })
      </script>
      `,
      errors: [
        {
          message: 'Use `defineComponent` to define the component.',
          line: 4,
          column: 7,
          endLine: 6,
          endColumn: 9
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script>
      const obj = { foo: 'bar' }
      export const helpers = {
        method() { return 'helper' }
      }
      export default {
        name: 'Test'
      }
      </script>
      `,
      errors: [
        {
          message: 'Use `defineComponent` to define the component.',
          line: 7,
          column: 7,
          endLine: 9,
          endColumn: 8
        }
      ]
    },
    {
      filename: 'test.jsx',
      code: `
      export default {
        render() {
          return <div />
        }
      }
      `,
      languageOptions: {
        parserOptions: { ecmaFeatures: { jsx: true } }
      },
      errors: [
        {
          message: 'Use `defineComponent` to define the component.',
          line: 2,
          column: 7,
          endLine: 6,
          endColumn: 8
        }
      ]
    }
  ]
})
