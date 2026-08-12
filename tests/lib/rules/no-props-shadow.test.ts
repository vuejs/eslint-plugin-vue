/**
 * @author Valentin Yushkevich
 * See LICENSE file in root directory for full license.
 */
import { RuleTester } from '../../eslint-compat'
import rule from '../../../lib/rules/no-props-shadow'
import vueEslintParser from 'vue-eslint-parser'

const tester = new RuleTester({
  languageOptions: {
    parser: vueEslintParser,
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-props-shadow', rule, {
  valid: [
    // The `defineProps()` result binding is not a shadowing declaration.
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps(['foo'])
      </script>
      `
    },
    // Reactive props destructure: the binding is the prop itself.
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const { foo } = defineProps({ foo: String })
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const { foo, bar } = defineProps<{ foo: string, bar: number }>()
      </script>
      `,
      languageOptions: {
        parser: vueEslintParser,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        foo: string
      }
      const { foo = 'default' } = withDefaults(defineProps<Props>(), { foo: 'default' })
      </script>
      `,
      languageOptions: {
        parser: vueEslintParser,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    // Different names.
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { ref } from 'vue'
      const props = defineProps(['foo'])
      const bar = ref(props.foo)
      </script>
      `
    },
    // Nested scopes are not exposed to the template.
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps(['foo'])
      function bar() {
        const foo = 1
        return foo
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps(['foo'])
      const bar = (foo) => foo
      </script>
      `
    },
    // `defineModel()` is not handled by this rule.
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps(['bar'])
      const foo = defineModel('foo')
      </script>
      `
    },
    // Type-only declarations cannot be referenced from the template.
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface foo {
        bar: string
      }
      defineProps<{ foo: string }>()
      </script>
      `,
      languageOptions: {
        parser: vueEslintParser,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      import type { foo } from './foo'
      import { type bar } from './bar'
      defineProps<{ foo: foo, bar: string }>()
      </script>
      `,
      languageOptions: {
        parser: vueEslintParser,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    // Not `<script setup>`: a local variable cannot shadow a prop in the template.
    {
      filename: 'test.vue',
      code: `
      <script>
      const foo = 1
      export default {
        props: ['foo'],
        setup() {
          const foo = 2
          return { bar: foo }
        }
      }
      </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const foo = 1
      </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import { ref } from 'vue'
      defineProps(['foo'])
      const foo = ref(false)
      </script>
      `,
      errors: [
        {
          message: "Declaration of 'foo' shadows the prop with the same name.",
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      import { computed } from 'vue'
      const props = defineProps<{ isDisabled: boolean }>()
      const isDisabled = computed(() => props.isDisabled ? 'yes' : 'no')
      </script>
      <template>
        <h1>Disabled: {{ isDisabled }}</h1>
      </template>
      `,
      languageOptions: {
        parser: vueEslintParser,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message:
            "Declaration of 'isDisabled' shadows the prop with the same name.",
          line: 5,
          column: 13,
          endLine: 5,
          endColumn: 23
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
      <script setup>
      const props = defineProps({ foo: String })
      const foo = props.foo.trim()
      </script>
      `,
      errors: [
        {
          message: "Declaration of 'foo' shadows the prop with the same name.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 16
        }
      ]
    },
    // Function declaration.
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps(['foo'])
      function foo() {}
      </script>
      `,
      errors: [
        {
          message: "Declaration of 'foo' shadows the prop with the same name.",
          line: 4,
          column: 16,
          endLine: 4,
          endColumn: 19
        }
      ]
    },
    // Class declaration.
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps(['foo'])
      class foo {}
      </script>
      `,
      errors: [
        {
          message: "Declaration of 'foo' shadows the prop with the same name.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 16
        }
      ]
    },
    // Import binding.
    {
      filename: 'test.vue',
      code: `
      <script setup>
      import foo from './foo'
      defineProps(['foo'])
      </script>
      `,
      errors: [
        {
          message: "Declaration of 'foo' shadows the prop with the same name.",
          line: 3,
          column: 14,
          endLine: 3,
          endColumn: 17
        }
      ]
    },
    // `let` and `var`.
    {
      filename: 'test.vue',
      code: `
      <script setup>
      defineProps(['foo', 'bar'])
      let foo = 1
      var bar = 2
      </script>
      `,
      errors: [
        {
          message: "Declaration of 'foo' shadows the prop with the same name.",
          line: 4,
          column: 11,
          endLine: 4,
          endColumn: 14
        },
        {
          message: "Declaration of 'bar' shadows the prop with the same name.",
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 14
        }
      ]
    },
    // Type-based props declared with an interface reference.
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      interface Props {
        foo: string
      }
      defineProps<Props>()
      const foo = 'bar'
      </script>
      `,
      languageOptions: {
        parser: vueEslintParser,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: "Declaration of 'foo' shadows the prop with the same name.",
          line: 7,
          column: 13,
          endLine: 7,
          endColumn: 16
        }
      ]
    },
    // `withDefaults()`.
    {
      filename: 'test.vue',
      code: `
      <script setup lang="ts">
      const props = withDefaults(defineProps<{ foo?: string }>(), { foo: 'bar' })
      const foo = props.foo
      </script>
      `,
      languageOptions: {
        parser: vueEslintParser,
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
      errors: [
        {
          message: "Declaration of 'foo' shadows the prop with the same name.",
          line: 4,
          column: 13,
          endLine: 4,
          endColumn: 16
        }
      ]
    },
    // Declarations in a normal `<script>` block are exposed to the template too.
    {
      filename: 'test.vue',
      code: `
      <script>
      const foo = 1
      </script>
      <script setup>
      defineProps(['foo'])
      </script>
      `,
      errors: [
        {
          message: "Declaration of 'foo' shadows the prop with the same name.",
          line: 3,
          column: 13,
          endLine: 3,
          endColumn: 16
        }
      ]
    }
  ]
})
