/**
 * @author neferqiqi
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-required-prop-with-default')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

tester.run('no-required-prop-with-default', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            name?: string
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: "World",
            }
          );
        </script>
      `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          type TestPropType = {
            name?: string
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: "World",
            }
          );
        </script>
      `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            name?
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: "World",
            }
          );
        </script>
      `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            get name(): string
            set name(a: string)
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              'name': 'World',
            }
          );
        </script>
      `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            get name(): void
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              'name': 'World',
            }
          );
        </script>
      `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          const [name] = 'test'

          interface TestPropType {
            [name]: string
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              [name]: 'World'
            }
          );
        </script>
      `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          props: {
            name: {
              required: false,
              default: 'Hello'
            }
          }
        }
        </script>
      `
    },
    // ignore array prop
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          props: ['name']
        }
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          const props = defineProps({
            name: {
              required: false,
              default: 'Hello'
            }
          })
        </script>
      `
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            name: string
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: "World",
            }
          );
        </script>
      `,
      output: `
        <script setup lang="ts">
          interface TestPropType {
            name?: string
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: "World",
            }
          );
        </script>
      `,
      options: [{ autofix: true }],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: 'Prop "name" should be optional.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            name: string | number
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: "World",
            }
          );
        </script>
      `,
      output: `
        <script setup lang="ts">
          interface TestPropType {
            name?: string | number
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: "World",
            }
          );
        </script>
      `,
      options: [{ autofix: true }],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: 'Prop "name" should be optional.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            'na::me': string
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              'na::me': "World",
            }
          );
        </script>
      `,
      output: `
        <script setup lang="ts">
          interface TestPropType {
            'na::me'?: string
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              'na::me': "World",
            }
          );
        </script>
      `,
      options: [{ autofix: true }],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: 'Prop "na::me" should be optional.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          import nameType from 'name.ts';
          interface TestPropType {
            name: nameType
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: "World",
            }
          );
        </script>
      `,
      output: `
        <script setup lang="ts">
          import nameType from 'name.ts';
          interface TestPropType {
            name?: nameType
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: "World",
            }
          );
        </script>
      `,
      options: [{ autofix: true }],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: 'Prop "name" should be optional.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            name
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: "World",
            }
          );
        </script>
      `,
      output: `
        <script setup lang="ts">
          interface TestPropType {
            name?
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: "World",
            }
          );
        </script>
      `,
      options: [{ autofix: true }],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: 'Prop "name" should be optional.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            name
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: "World",
            }
          );
        </script>
      `,
      output: `
        <script setup lang="ts">
          interface TestPropType {
            name?
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: "World",
            }
          );
        </script>
      `,
      options: [{ autofix: true }],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: 'Prop "name" should be optional.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            'na\\"me2'
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              'na\\"me2': "World",
            }
          );
        </script>
      `,
      output: `
        <script setup lang="ts">
          interface TestPropType {
            'na\\"me2'?
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              'na\\"me2': "World",
            }
          );
        </script>
      `,
      options: [{ autofix: true }],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: 'Prop "na"me2" should be optional.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            foo(): void
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              foo() {console.log(123)},
            }
          );
        </script>
      `,
      output: `
        <script setup lang="ts">
          interface TestPropType {
            foo?(): void
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              foo() {console.log(123)},
            }
          );
        </script>
      `,
      options: [{ autofix: true }],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: 'Prop "foo" should be optional.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            readonly name
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: 'World',
            }
          );
        </script>
      `,
      output: `
        <script setup lang="ts">
          interface TestPropType {
            readonly name?
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              name: 'World',
            }
          );
        </script>
      `,
      options: [{ autofix: true }],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: 'Prop "name" should be optional.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            readonly 'name'
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              'name': 'World',
            }
          );
        </script>
      `,
      output: `
        <script setup lang="ts">
          interface TestPropType {
            readonly 'name'?
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              'name': 'World',
            }
          );
        </script>
      `,
      options: [{ autofix: true }],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: 'Prop "name" should be optional.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            readonly 'a'
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              '\\u0061': 'World',
            }
          );
        </script>
      `,
      output: `
        <script setup lang="ts">
          interface TestPropType {
            readonly 'a'?
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              '\\u0061': 'World',
            }
          );
        </script>
      `,
      options: [{ autofix: true }],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: 'Prop "a" should be optional.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          interface TestPropType {
            readonly '\\u0061'
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              'a': 'World',
            }
          );
        </script>
      `,
      output: `
        <script setup lang="ts">
          interface TestPropType {
            readonly '\\u0061'?
            age?: number
          }
          const props = withDefaults(
            defineProps<TestPropType>(),
            {
              'a': 'World',
            }
          );
        </script>
      `,
      options: [{ autofix: true }],
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: 'Prop "a" should be optional.',
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          props: {
            name: {
              required: true,
              default: 'Hello'
            }
          }
        }
        </script>
      `,
      output: `
        <script>
        export default {
          props: {
            name: {
              required: false,
              default: 'Hello'
            }
          }
        }
        </script>
      `,
      options: [{ autofix: true }],
      errors: [
        {
          message: 'Prop "name" should be optional.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        export default {
          props: {
            'name': {
              required: true,
              default: 'Hello'
            }
          }
        }
        </script>
      `,
      output: `
        <script>
        export default {
          props: {
            'name': {
              required: false,
              default: 'Hello'
            }
          }
        }
        </script>
      `,
      options: [{ autofix: true }],
      errors: [
        {
          message: 'Prop "name" should be optional.',
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        import { defineComponent } from 'vue'
        export default defineComponent({
          props: {
            'name': {
              required: true,
              default: 'Hello'
            }
          }
        })
        </script>
      `,
      output: `
        <script>
        import { defineComponent } from 'vue'
        export default defineComponent({
          props: {
            'name': {
              required: false,
              default: 'Hello'
            }
          }
        })
        </script>
      `,
      options: [{ autofix: true }],
      errors: [
        {
          message: 'Prop "name" should be optional.',
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        import { defineComponent } from 'vue'
        export default defineComponent({
          props: {
            name: {
              required: true,
              default: 'Hello'
            }
          }
        })
        </script>
      `,
      output: `
        <script>
        import { defineComponent } from 'vue'
        export default defineComponent({
          props: {
            name: {
              required: false,
              default: 'Hello'
            }
          }
        })
        </script>
      `,
      options: [{ autofix: true }],
      errors: [
        {
          message: 'Prop "name" should be optional.',
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
        import { defineComponent } from 'vue'
        export default defineComponent({
          props: {
            name: {
              required: true,
              default: 'Hello'
            }
          }
        })
        </script>
      `,
      output: null,
      errors: [
        {
          message: 'Prop "name" should be optional.',
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          const props = defineProps({
            name: {
              required: true,
              default: 'Hello'
            }
          })
        </script>
      `,
      output: `
        <script setup>
          const props = defineProps({
            name: {
              required: false,
              default: 'Hello'
            }
          })
        </script>
      `,
      options: [{ autofix: true }],
      errors: [
        {
          message: 'Prop "name" should be optional.',
          line: 4
        }
      ]
    }
  ]
})
