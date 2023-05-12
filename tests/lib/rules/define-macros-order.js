/**
 * @author *****your name*****
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/define-macros-order')

const tester = new RuleTester({
  parser: require.resolve('vue-eslint-parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

const optionsEmitsFirst = [
  {
    order: ['defineEmits', 'defineProps']
  }
]

const optionsPropsFirst = [
  {
    order: ['defineProps', 'defineEmits']
  }
]

function message(macro) {
  return `${macro} should be the first statement in \`<script setup>\` (after any potential import statements or type definitions).`
}

tester.run('define-macros-order', rule, {
  valid: [
    {
      filename: 'test.vue',
      code: `
        <script setup>
          defineProps({
            test: Boolean
          })
          defineEmits(['update:test'])
          console.log('test')
        </script>
      `,
      options: optionsPropsFirst
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          const props = withDefaults(defineProps<Props>(), {
            msg: 'hello',
            labels: () => ['one', 'two']
          })
          const emit = defineEmits<{(e: 'update:test'): void}>()
          console.log('test')
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
          defineEmits(['update:test'])
          console.log('test')
        </script>
      `,
      options: optionsPropsFirst
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          defineProps({
            test: Boolean
          })
          console.log('test')
        </script>
      `,
      options: optionsPropsFirst
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          console.log('test')
        </script>
      `,
      options: optionsPropsFirst
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          import { bar } from 'foo'
          defineEmits(['update:test'])
          defineProps({
            test: Boolean
          })
          console.log('test')
        </script>
      `,
      options: optionsEmitsFirst
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          import { bar } from 'foo'
          export interface Props {
            msg?: string
            labels?: string[]
          }
          defineEmits(['update:test'])
          const props = withDefaults(defineProps<Props>(), {
            msg: 'hello',
            labels: () => ['one', 'two']
          })
          console.log('test')
        </script>
      `,
      options: optionsEmitsFirst,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      }
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          'use strict';
          defineProps({
            test: Boolean
          })
          defineEmits(['update:test'])
        </script>
      `,
      options: optionsPropsFirst
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
        </script>
      `
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          import Foo from 'foo'
          /** options */
          defineOptions({})
          /** emits */
          defineEmits(['update:foo'])
          /** props */
          const props = defineProps(['foo'])
          /** slots */
          const slots = defineSlots()
          console.log('test1')
        </script>
      `,
      options: [
        {
          order: ['defineOptions', 'defineEmits', 'defineProps', 'defineSlots']
        }
      ]
    }
  ],
  invalid: [
    {
      filename: 'test.vue',
      code: `
        <script setup>
          import { bar } from 'foo'
          console.log('test1')
          defineEmits(['update:test'])
        </script>
      `,
      output: `
        <script setup>
          import { bar } from 'foo'
          defineEmits(['update:test'])
          console.log('test1')
        </script>
      `,
      options: optionsEmitsFirst,
      errors: [
        {
          message: message('defineEmits'),
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          import { bar } from 'foo'

          console.log('test1')
          defineEmits(['update:test'])
          console.log('test2')
          defineProps({
            test: Boolean
          })
          console.log('test3')
        </script>
      `,
      output: `
        <script setup>
          import { bar } from 'foo'

          defineProps({
            test: Boolean
          })
          defineEmits(['update:test'])
          console.log('test1')
          console.log('test2')
          console.log('test3')
        </script>
      `,
      options: optionsPropsFirst,
      errors: [
        {
          message: message('defineProps'),
          line: 8
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          import { bar } from 'foo'

          defineEmits(['update:test'])
          defineProps({
            test: Boolean
          })

          console.log('test1')
        </script>
      `,
      output: `
        <script setup>
          import { bar } from 'foo'

          defineProps({
            test: Boolean
          })
          defineEmits(['update:test'])
          console.log('test1')
        </script>
      `,
      options: optionsPropsFirst,
      errors: [
        {
          message: message('defineProps'),
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          console.log('test1')
          const props = defineProps({
            test: Boolean
          })
          console.log('test2')
          const emit = defineEmits(['update:test'])
          console.log('test3')
        </script>
      `,
      output: `
        <script setup>
          const emit = defineEmits(['update:test'])
          const props = defineProps({
            test: Boolean
          })
          console.log('test1')
          console.log('test2')
          console.log('test3')
        </script>
      `,
      options: optionsEmitsFirst,
      errors: [
        {
          message: message('defineEmits'),
          line: 8
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script lang="ts" setup>
          interface Props {
            msg?: string
            labels?: string[]
          }

          const props = withDefaults(defineProps<Props>(), {
            msg: 'hello',
            labels: () => ['one', 'two']
          })
          const emit = defineEmits<{(e: 'update:test'): void}>()
        </script>
      `,
      output: `
        <script lang="ts" setup>
          interface Props {
            msg?: string
            labels?: string[]
          }

          const emit = defineEmits<{(e: 'update:test'): void}>()
          const props = withDefaults(defineProps<Props>(), {
            msg: 'hello',
            labels: () => ['one', 'two']
          })
        </script>
      `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      options: optionsEmitsFirst,
      errors: [
        {
          message: message('defineEmits'),
          line: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script lang="ts" setup>
          import bla from 'bla';
          interface Foo {};
          type Bar = {};
          // <--- auto-fix should move \`defineProps\` here
          const someOtherCode = '';
          import foo from 'bar'; // not idiomatic, but allowed
          interface SomeOtherInterface {};
          defineProps({ test: Boolean });
        </script>
      `,
      output: `
        <script lang="ts" setup>
          import bla from 'bla';
          interface Foo {};
          type Bar = {};
          defineProps({ test: Boolean });
          // <--- auto-fix should move \`defineProps\` here
          const someOtherCode = '';
          import foo from 'bar'; // not idiomatic, but allowed
          interface SomeOtherInterface {};
        </script>
      `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      errors: [
        {
          message: message('defineProps'),
          line: 10
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script lang="ts" setup>
          debugger

          console.log('test1')

          /** Description for props */
          const props = withDefaults(defineProps<Props>(), {
            msg: 'hello'
          });

          console.log('test2')

          // Description for emit
          // Description for emit line 2
          const emit = defineEmits<{(e: 'test'): void}>();

          console.log('test3')
        </script>
      `,
      output: `
        <script lang="ts" setup>
          debugger

          // Description for emit
          // Description for emit line 2
          const emit = defineEmits<{(e: 'test'): void}>();

          /** Description for props */
          const props = withDefaults(defineProps<Props>(), {
            msg: 'hello'
          });

          console.log('test1')

          console.log('test2')

          console.log('test3')
        </script>
      `,
      parserOptions: {
        parser: require.resolve('@typescript-eslint/parser')
      },
      options: optionsEmitsFirst,
      errors: [
        {
          message: message('defineEmits'),
          line: 16
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          const props = defineProps({ test: Boolean });defineEmits(['update:test'])
        </script>
      `,
      output: `
        <script setup>
          defineEmits(['update:test']);const props = defineProps({ test: Boolean });        </script>
      `,
      options: optionsEmitsFirst,
      errors: [
        {
          message: message('defineEmits'),
          line: 3
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script>
          import 'test2'
          export default { inheritAttrs: false };
        </script>

        <script setup>
          import 'test'

          defineEmits(['update:test'])
          const props = defineProps({ test: Boolean });
        </script>
      `,
      output: `
        <script>
          import 'test2'
          export default { inheritAttrs: false };
        </script>

        <script setup>
          import 'test'

          const props = defineProps({ test: Boolean });
          defineEmits(['update:test'])
        </script>
      `,
      errors: [
        {
          message: message('defineProps'),
          line: 11
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>defineEmits(['update:test']);defineProps({ test: Boolean })</script>
      `,
      output: `
        <script setup>defineProps({ test: Boolean });defineEmits(['update:test']);</script>
      `,
      errors: [
        {
          message: message('defineProps'),
          line: 2
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          console.log('test1')
          defineProps({ test: Boolean })
        </script>
      `,
      output: `
        <script setup>
          defineProps({ test: Boolean })
          console.log('test1')
        </script>
      `,
      options: optionsEmitsFirst,
      errors: [
        {
          message: message('defineProps'),
          line: 4
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          defineEmits(['update:test'])
          console.log('test1')
          defineProps({ test: Boolean })
        </script>
      `,
      output: `
        <script setup>
          defineEmits(['update:test'])
          defineProps({ test: Boolean })
          console.log('test1')
        </script>
      `,
      options: optionsEmitsFirst,
      errors: [
        {
          message: message('defineProps'),
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          import Foo from 'foo'
          console.log('test1')
          /** emits */
          defineEmits(['update:foo'])
          /** props */
          const props = defineProps(['foo'])
          /** slots */
          const slots = defineSlots()
          /** options */
          defineOptions({})
        </script>
      `,
      output: `
        <script setup>
          import Foo from 'foo'
          /** options */
          defineOptions({})
          /** emits */
          defineEmits(['update:foo'])
          /** props */
          const props = defineProps(['foo'])
          /** slots */
          const slots = defineSlots()
          console.log('test1')
        </script>
      `,
      options: [
        {
          order: ['defineOptions', 'defineEmits', 'defineProps', 'defineSlots']
        }
      ],
      errors: [
        {
          message: message('defineOptions'),
          line: 12
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          /** slots */
          const slots = defineSlots()
          /** options */
          defineOptions({})
          /** emits */
          defineEmits(['update:foo'])
          /** props */
          const props = defineProps(['foo'])
        </script>
      `,
      output: `
        <script setup>
          /** options */
          defineOptions({})
          /** emits */
          defineEmits(['update:foo'])
          /** props */
          const props = defineProps(['foo'])
          /** slots */
          const slots = defineSlots()
        </script>
      `,
      options: [
        {
          order: ['defineOptions', 'defineEmits', 'defineProps', 'defineSlots']
        }
      ],
      errors: [
        {
          message: message('defineOptions'),
          line: 6
        }
      ]
    }
  ]
})
