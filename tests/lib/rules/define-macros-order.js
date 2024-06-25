/**
 * @author *****your name*****
 * See LICENSE file in root directory for full license.
 */
'use strict'

const RuleTester = require('../../eslint-compat').RuleTester
const rule = require('../../../lib/rules/define-macros-order')

const tester = new RuleTester({
  languageOptions: {
    parser: require('vue-eslint-parser'),
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

const optionsExposeLast = [
  {
    defineExposeLast: true
  }
]

function message(macro) {
  return `${macro} should be the first statement in \`<script setup>\` (after any potential import statements or type definitions).`
}

const defineExposeNotTheLast =
  '`defineExpose` should be the last statement in `<script setup>`.'

const putExposeAtBottom =
  'Put `defineExpose` as the last statement in `<script setup>`.'

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
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
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
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
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
          /** model */
          const model = defineModel()
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
          order: [
            'defineOptions',
            'defineModel',
            'defineEmits',
            'defineProps',
            'defineSlots'
          ]
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          import Foo from 'foo'
          /** props */
          defineProps(['foo'])
          /** options */
          defineOptions({})
          /** expose */
          defineExpose({})
        </script>
      `,
      options: optionsExposeLast
    },
    {
      filename: 'test.vue',
      code: `
        <script setup lang="ts">
          import Foo from 'foo'
          /** props */
          const props = defineProps({
            test: Boolean
          })
          /** emits */
          defineEmits(['update:foo'])
          /** slots */
          const slots = defineSlots()
          /** expose */
          defineExpose({})
        </script>
      `,
      options: [
        {
          order: ['defineProps', 'defineEmits'],
          defineExposeLast: true
        }
      ],
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      }
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          const first = defineModel('first')
          const second = defineModel('second')

          const slots = defineSlots()
        </script>
      `,
      options: [
        {
          order: ['defineModel', 'defineSlots']
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
      options: optionsEmitsFirst,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
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
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
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
      options: optionsEmitsFirst,
      languageOptions: {
        parserOptions: {
          parser: require.resolve('@typescript-eslint/parser')
        }
      },
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
          /** model */
          const model = defineModel()
        </script>
      `,
      output: `
        <script setup>
          import Foo from 'foo'
          /** options */
          defineOptions({})
          /** model */
          const model = defineModel()
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
          order: [
            'defineOptions',
            'defineModel',
            'defineEmits',
            'defineProps',
            'defineSlots'
          ]
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
          /** model */
          const model = defineModel()
        </script>
      `,
      output: `
        <script setup>
          /** options */
          defineOptions({})
          /** model */
          const model = defineModel()
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
          order: [
            'defineOptions',
            'defineModel',
            'defineEmits',
            'defineProps',
            'defineSlots'
          ]
        }
      ],
      errors: [
        {
          message: message('defineOptions'),
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          /** emits */
          defineEmits(['update:foo'])
          /** expose */
          defineExpose({})
          /** slots */
          const slots = defineSlots()
        </script>
      `,
      output: null,
      options: optionsExposeLast,
      errors: [
        {
          message: defineExposeNotTheLast,
          line: 6,
          suggestions: [
            {
              desc: putExposeAtBottom,
              output: `
        <script setup>
          /** emits */
          defineEmits(['update:foo'])
          /** slots */
          const slots = defineSlots()
          /** expose */
          defineExpose({})
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
        <script setup>
          /** emits */
          defineEmits(['update:foo'])
          /** expose */
          defineExpose({})
          /** options */
          defineOptions({})
          /** props */
          const props = defineProps(['foo'])
          /** slots */
          const slots = defineSlots()
        </script>
      `,
      output: `
        <script setup>
          /** options */
          defineOptions({})
          /** emits */
          defineEmits(['update:foo'])
          /** expose */
          defineExpose({})
          /** props */
          const props = defineProps(['foo'])
          /** slots */
          const slots = defineSlots()
        </script>
      `,
      options: [
        {
          order: ['defineOptions', 'defineEmits', 'defineProps'],
          defineExposeLast: true
        }
      ],
      errors: [
        {
          message: defineExposeNotTheLast,
          line: 6,
          suggestions: [
            {
              desc: putExposeAtBottom,
              output: `
        <script setup>
          /** emits */
          defineEmits(['update:foo'])
          /** options */
          defineOptions({})
          /** props */
          const props = defineProps(['foo'])
          /** slots */
          const slots = defineSlots()
          /** expose */
          defineExpose({})
        </script>
      `
            }
          ]
        },
        {
          message: message('defineOptions'),
          line: 8
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          /** options */
          defineOptions({})
          /** model */
          const first = defineModel('first')
          const second = defineModel('second')
        </script>
      `,
      output: `
        <script setup>
          /** model */
          const first = defineModel('first')
          const second = defineModel('second')
          /** options */
          defineOptions({})
        </script>
      `,
      options: [
        {
          order: ['defineModel', 'defineOptions']
        }
      ],
      errors: [
        {
          message: message('defineModel'),
          line: 6
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          const first = defineModel('first')
          defineOptions({})
          const second = defineModel('second')
        </script>
      `,
      output: `
        <script setup>
          const first = defineModel('first')
          const second = defineModel('second')
          defineOptions({})
        </script>
      `,
      options: [
        {
          order: ['defineModel', 'defineOptions']
        }
      ],
      errors: [
        {
          message: message('defineModel'),
          line: 5
        }
      ]
    },
    {
      filename: 'test.vue',
      code: `
        <script setup>
          const a = defineModel('a')
          defineOptions({})
          const c = defineModel('c')
          defineExpose({})
          const b = defineModel('b')
        </script>
      `,
      output: `
        <script setup>
          const a = defineModel('a')
          const c = defineModel('c')
          const b = defineModel('b')
          defineOptions({})
          defineExpose({})
        </script>
      `,
      options: [
        {
          order: ['defineModel', 'defineOptions'],
          defineExposeLast: true
        }
      ],
      errors: [
        {
          message: message('defineModel'),
          line: 5
        },
        {
          message: defineExposeNotTheLast,
          line: 6,
          suggestions: [
            {
              messageId: 'putExposeAtTheLast',
              output: `
        <script setup>
          const a = defineModel('a')
          defineOptions({})
          const c = defineModel('c')
          const b = defineModel('b')
          defineExpose({})
        </script>
      `
            }
          ]
        }
      ]
    }
  ]
})
